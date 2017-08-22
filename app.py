from flask import Flask, redirect, url_for, session, request
from flask_oauthlib.client import OAuth, OAuthException
import requests
import json
import uuid

from tree import Node, lookup_node
from decorators import save, load, mutator

SPOTIFY_APP_ID = '0ea32eb43e5c4e4c8eed99d75a73a7d3'
SPOTIFY_APP_SECRET = '779ac802603542fd839d0be55fac6ac3'

app = Flask(__name__)
app.debug = True
app.secret_key = 'development'
oauth = OAuth(app)

spotify = oauth.remote_app(
    'spotify',
    consumer_key=SPOTIFY_APP_ID,
    consumer_secret=SPOTIFY_APP_SECRET,
    # Change the scope to match whatever it us you need
    # list of scopes can be found in the url below
    # https://developer.spotify.com/web-api/using-scopes/
    request_token_params={'scope': 'user-read-playback-state user-modify-playback-state'},
    base_url='https://accounts.spotify.com',
    request_token_url=None,
    access_token_url='/api/token',
    authorize_url='https://accounts.spotify.com/authorize'
)

def get_auth_header():
    resp = spotify.authorized_response()
    if resp is None:
        return 'Access denied: reason={0} error={1}'.format(
            request.args['error_reason'],
            request.args['error_description']
        )

    if isinstance(resp, OAuthException):
        return 'Access denied: {0}'.format(resp.message)

    session['oauth_token'] = (resp['access_token'], '')
    token = resp['access_token']
    auth_header = resp['token_type'] + ' ' + resp['access_token']
    headers = {'Authorization': auth_header}
    return headers

@spotify.tokengetter
def get_spotify_oauth_token():
    return session.get('oauth_token')

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login')
def login():
    callback = url_for(
        'reset',
        next=request.args.get('next') or request.referrer or None,
        _external=True
    )
    return spotify.authorize(callback=callback)

@app.route('/login/authorized')
@save
def reset():
    headers = get_auth_header()
    root = Node('All songs')
 
    r_playlists = requests.get('https://api.spotify.com/v1/me/playlists', headers=headers)
    playlists = r_playlists.json()['items']

    for playlist in playlists:
        r_tracks = requests.get(playlist['tracks']['href'], headers=headers)
        tracks = r_tracks.json()['items']
        track_uris = []
        for track in tracks:
            track_uris.append(track['track']['uri'])
        new_node = Node(name=playlist['name'], parent=root, tracks=track_uris)

    return root

@app.route('/nodes/<uuid>')
@load
def get_node(root, uuid):
    return json.dumps(lookup_node(root, uuid).to_dict())

@app.route('/nodes')
@load
def get_root(root):
    return json.dumps(root.to_dict())

@app.route('/nodes/<parent_uuid>', methods=['POST'])
@mutator
def create_node(root, parent_uuid):
    name = request.json['name']
    parent = lookup_node(root, parent_uuid)
    if parent is None:
        return 'Parent not found', 400
    Node(name=name, parent=parent)
    return root

@app.route('/nodes/<uuid>', methods=['DELETE'])
@mutator
def delete_node(root, uuid):
    node = lookup_node(root, uuid)
    if node.parent is None:
        return 'Unable to delete root node', 400
    node.parent.children.remove(node)
    return root

@app.route('/nodes/<uuid>/tracks', methods=['POST'])
@mutator
def add_track(root, uuid):
    track_id = request.json['track_id']
    node = lookup_node(root, uuid)
    node.tracks.append(track_id)
    return root

@app.route('/nodes/<uuid>/tracks', methods=['DELETE'])
@mutator
def remove_track(root, uuid):
    track_id = request.json['track_id']
    node = lookup_node(root, uuid)
    node.tracks.remove(track_id)
    return root

if __name__ == '__main__':
    app.run(host='0.0.0.0')

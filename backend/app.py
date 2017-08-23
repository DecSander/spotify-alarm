#!/usr/bin/python

from flask import Flask, redirect, url_for, session, request, send_from_directory
from flask_oauthlib.client import OAuth, OAuthException
import requests
import json
import uuid

from tree import Node, lookup_node, Track
from decorators import save, load, mutator

SPOTIFY_APP_ID = '0ea32eb43e5c4e4c8eed99d75a73a7d3'
SPOTIFY_APP_SECRET = '779ac802603542fd839d0be55fac6ac3'

app = Flask(__name__, static_url_path='')
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

@app.route('/')
def index():
    return 'Hi!'

@spotify.tokengetter
def get_spotify_token(token=None):
    return session.get('spotify_token')

@app.route('/login')
def login():
    return spotify.authorize(callback=url_for('oauth_authorized',
        next=request.args.get('next') or request.referrer or None, _external=True))

@app.route('/login/authorized')
@spotify.authorized_handler
def oauth_authorized(resp):
    next_url = request.args.get('next') or url_for('index')
    if resp is None:
        flash(u'You denied the request to sign in.')
        return redirect(next_url)

    session['spotify_token'] = resp['token_type'] + ' ' + resp['access_token']
    return redirect(next_url)

@app.route('/resettree')
@save
def reset():
    print get_spotify_token()
    headers = {'Authorization': get_spotify_token()}
    root = Node('All songs')
 
    r_playlists = requests.get('https://api.spotify.com/v1/me/playlists', headers=headers)
    playlists = r_playlists.json()['items']

    for playlist in playlists:
        r_tracks = requests.get(playlist['tracks']['href'], headers=headers)
        tracks = r_tracks.json()['items']
        track_objs = []
        for track in tracks:
            track_obj = track['track']
            new_track = Track(uuid=track_obj['uri'], name=track_obj['name'], artist=track_obj['artists'][0]['name'])
            track_objs.append(new_track)
        new_node = Node(name=playlist['name'], parent=root, tracks=track_objs)

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

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('../frontend', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0')

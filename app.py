from flask import Flask, redirect, url_for, session, request
from flask_oauthlib.client import OAuth, OAuthException
import requests
import json


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

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login')
def login():
    callback = url_for(
        'spotify_authorized',
        next=request.args.get('next') or request.referrer or None,
        _external=True
    )
    print(callback)
    return spotify.authorize(callback=callback)

@app.route('/login/authorized')
def spotify_authorized():
    headers = get_auth_header()

    r_devices = requests.get('https://api.spotify.com/v1/me/player/devices', headers=headers)
    devices = r_devices.json()['devices']
    if len(devices) == 0:
        return 'no devices found'
    device_selected = None
    for device in devices:
        if 'iPhone' in device['name']:
            print(device)
            device_selected = device['id']
    if device_selected == None:
        return 'no iphone found'
    data = json.dumps({'device_ids': [device_selected], 'play': False})
    r_transfer = requests.put('https://api.spotify.com/v1/me/player', data=data, headers=headers)

    #r_playlists = requests.get('https://api.spotify.com/v1/me/playlists', headers=headers)
    #print(r_playlists.json())
    r_shuffle = requests.put('https://api.spotify.com/v1/me/player/shuffle?state=true', headers=headers)
    print(r_shuffle.status_code)
    playlist = 'spotify:user:12148607014:playlist:3EW4zuXYer9GSVkXn4ttsy'
    play_data = json.dumps({'context_uri': playlist})
    r_play = requests.put('https://api.spotify.com/v1/me/player/play', data=play_data, headers=headers)
    print(r_play.status_code)
    return "success"

@spotify.tokengetter
def get_spotify_oauth_token():
    return session.get('oauth_token')

if __name__ == '__main__':
    app.run(host='0.0.0.0')

import json
import requests

def get(url, headers=None, params=None):
    req = requests.get(url, headers=headers, params=params)
    try:
        resp = req.json()
        if 'error' in resp:
            raise Exception(resp['error'])
        return resp
    except ValueError:
        pass

def post(url, headers=None, params=None, body=None):
    req = requests.post(url, headers=headers, params=params, data=json.dumps(body))
    try:
        resp = req.json()
        if 'error' in resp:
            raise Exception(resp['error'])
        return resp
    except ValueError:
        pass

def put(url, headers=None, params=None, body=None):
    req = requests.put(url, headers=headers, params=params, data=json.dumps(body))
    try:
        resp = req.json()
        if 'error' in resp:
            raise Exception(resp['error'])
        return resp
    except ValueError:
        pass

def delete(url, headers=None, params=None, body=None):
    req = requests.delete(url, headers=headers, params=params, data=json.dumps(body))
    try:
        resp = req.json()
        if 'error' in resp:
            raise Exception(resp['error'])
        return resp
    except ValueError:
        pass

import json
import uuid as uuid_lib

class Node:
    name = None
    uuid = None
    parent = None
    children = None
    tracks = None

    def __init__(self, name, uuid=None, parent=None, tracks=None):
        self.name = name
        self.uuid = uuid_lib.uuid4().hex if uuid is None else uuid
        self.parent = parent
        if parent is not None:
            parent.children.append(self)
        self.children = []
        self.tracks = [] if tracks is None else tracks

    def get_all_subtracks(self):
        ret = []
        ret += self.tracks
        for child in children:
            ret += child.get_all_subtracks()
        return ret

    def to_meta_dict(self):
        return {
            "name": self.name,
            "uuid": self.uuid
        }

    def to_tree_dict(self):
        return {
            "name": self.name,
            "children": [child.to_tree_dict() for child in self.children],
            "uuid": self.uuid
        }

    def to_dict(self):
        return {
            "name": self.name,
            "children": [child.to_dict() for child in self.children],
            "tracks": [track.to_dict() for track in self.tracks],
            "uuid": self.uuid
        }

    def get_songs(self):
        songs = []
        for child in self.children:
            child_meta_dict = child.to_meta_dict();
            for song in child.get_songs():
                song[1].insert(0, child_meta_dict)
                songs.append(song)

        for track in self.tracks:
            songs.append((track.to_dict(), []))

        return songs

    def __str__(self):
        return "{0} tracks: {1}".format(self.name, self.tracks)

    def __eq__(self, other):
        return self.uuid == other.uuid

class Track:
    name = None
    artist = None
    uuid = None

    def __init__(self, name, artist, uuid):
        self.name = name
        self.artist = artist
        self.uuid = uuid

    def to_dict(self):
        return {
            "name": self.name,
            "artist": self.artist,
            "uuid": self.uuid
        }

    def __str__(self):
        return "{0}".format(self.name)

    def __eq__(self, other):
        return self.uuid == other.uuid

def save_to_file(node):
    with open('data.json', 'w') as f:
        f.write(json.dumps(node.to_dict()))

def dict_to_track(dct):
    return Track(name=dct['name'], uuid=dct['uuid'], artist=dct['artist'])

def create_from_dict(dct, parent=None):
    new_node = Node(name=dct['name'], uuid=dct['uuid'], parent=parent,
                    tracks=map(dict_to_track, dct['tracks']))
    for child in dct['children']:
        create_from_dict(child, new_node)
    return new_node

def load_from_file():
    with open('data.json', 'r') as f:
        return create_from_dict(json.loads(f.read()))

def lookup_node(root, uuid):
    if root.uuid == uuid:
        return root

    for child in root.children:
        result = lookup_node(child, uuid)
        if result is not None:
            return result

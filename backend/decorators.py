from functools import wraps
from tree import load_from_file, save_to_file

def getter(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        kwargs['root'] = load_from_file()
        return f(*args, **kwargs)
    return decorated_function

def setter(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        results = f(*args, **kwargs)
        save_to_file(results)
        return 'Success'
    return decorated_function

def mutator(f):
    @wraps(f)
    @getter
    @setter
    def decorated_function(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated_function

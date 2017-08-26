// @flow

import Dispatcher from 'dispatcher/Dispatcher';
import { ActionTypes } from 'constants/ActionTypes';
import Store from 'stores/Store';

let _selected_playlist = '';

function updateSelectedPlaylist(uuid) { _selected_playlist = uuid; }

class NavStore extends Store {

  constructor() {
    super();
  }

  getSelectedPlaylist() {
    return _selected_playlist;
  }

}

const navStore = new NavStore();

navStore.dispatchToken = Dispatcher.register(action => {
  switch(action.type) {
  case ActionTypes.SELECT_PLAYLIST:
    updateSelectedPlaylist(action.uuid);
    navStore.emitChange();
    break;
  default:
    // do nothing
  }
});

export default navStore;

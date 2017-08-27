// @flow

import Dispatcher from 'dispatcher/Dispatcher';
import { ActionTypes } from 'constants/ActionTypes';
import Store from 'stores/Store';

let _selectedPlaylist = '';
let _openDrawer = false;

function updateSelectedPlaylist(uuid) { _selectedPlaylist = uuid; }
function updateDrawerOpen(open) { _openDrawer = open; }

class NavStore extends Store {

  constructor() {
    super();
  }

  getSelectedPlaylist() {
    return _selectedPlaylist;
  }

  getDrawerOpen() {
    return _openDrawer;
  }

}

const navStore = new NavStore();

navStore.dispatchToken = Dispatcher.register(action => {
  switch(action.type) {
  case ActionTypes.SELECT_PLAYLIST:
    updateSelectedPlaylist(action.uuid);
    navStore.emitChange();
    break;
  case ActionTypes.OPEN_DRAWER:
    updateDrawerOpen(action.open);
    navStore.emitChange();
    break;
  default:
    // do nothing
  }
});

export default navStore;

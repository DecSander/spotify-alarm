import Dispatcher from 'dispatcher/Dispatcher';
import { ActionTypes } from 'constants/ActionTypes';

export function selectPlaylist(uuid) {
  Dispatcher.dispatch({
    type: ActionTypes.SELECT_PLAYLIST,
    uuid
  });
}

export function openDrawer(open) {
  Dispatcher.dispatch({
    type: ActionTypes.OPEN_DRAWER,
    open
  });
}

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

export function playerInfo(player) {
  Dispatcher.dispatch({
    type: ActionTypes.PLAYER_INFO,
    player
  });
}

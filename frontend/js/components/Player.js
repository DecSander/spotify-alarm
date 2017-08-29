import React from 'react';
import autobind from 'react-autobind';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import PlayButton from 'material-ui/svg-icons/av/play-circle-outline';
import PauseButton from 'material-ui/svg-icons/av/pause-circle-outline';
import SkipNext from 'material-ui/svg-icons/av/skip-next';
import SkipPrev from 'material-ui/svg-icons/av/skip-previous';

import { playerInfo } from 'actions/ActionCreator';
import NavStore from 'stores/NavStore';

function getStateFromStore() {
  return {
    player: NavStore.getPlayerInfo()
  };
}

class Player extends React.Component {

  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      player: {
        playing: false,
        shuffle: false,
        device: {
          id: '',
          name: ''
        }
      }
    };

    setInterval(this.getPlayerInfo, 1000)
  }

  getPlayerInfo() {
    fetch(`/player`, {credentials: 'include'})
      .then(res => res.json())
      .then(player => playerInfo(player))
      .catch(console.error);
  }

  playPause() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const { playing } = this.state.player;
    fetch('/player', {
      method: 'put',
      body: JSON.stringify({playing: !playing}),
      credentials: 'include',
      headers: headers
    }).catch(console.error);
    this.setState({playing: !playing})
  }

  _onChange() {
    this.setState(getStateFromStore());
  }

  componentDidMount() {
    NavStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    NavStore.removeChangeListener(this._onChange);
  }

  skipPrev() {
    fetch('/player/previous', {
      method: 'put',
      credentials: 'include'
    }).catch(console.error)
  }

  skipNext() {
    fetch('/player/next', {
      method: 'put',
      credentials: 'include'
    }).catch(console.error)
  }

  render() {
    const { playing } = this.state.player;

    const player_text = playing ? 'Pause' : 'Play';
    const player_icon = playing ? <PauseButton /> : <PlayButton />;
    return (
      <div style={{position: "fixed", bottom:"0", width:"100%"}}>
        <BottomNavigation>
          <BottomNavigationItem label="Prev" icon={<SkipPrev onClick={() => this.skipPrev()} />} />
          <BottomNavigationItem label={player_text} icon={player_icon} onClick={() => this.playPause()} />
          <BottomNavigationItem label="Next" icon={<SkipNext onClick={() => this.skipNext()} />} />
        </BottomNavigation>
      </div>
    );
  }
}

export default Player;

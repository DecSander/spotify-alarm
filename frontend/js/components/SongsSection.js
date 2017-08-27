import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import autobind from 'react-autobind';
import PlayButton from 'material-ui/svg-icons/av/play-circle-filled';
import IconButton from 'material-ui/IconButton';
import Chip from 'material-ui/Chip';
import { blue300 } from 'material-ui/styles/colors';

import { selectPlaylist } from 'actions/ActionCreator';
import NavStore from 'stores/NavStore';

function getStateFromStore() {
  return {
    playlist: NavStore.getSelectedPlaylist()
  }
}

class SongsSection extends React.Component {

  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      tracks: [],
      playlist: ''
    }
  }

  _onChange() {
    this.setState(getStateFromStore(), this.getTracks);
  }

  componentDidMount() {
    NavStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    NavStore.removeChangeListener(this._onChange);
  }

  getTracks() {
    if (this.state.playlist === '') return;
    fetch(`/nodes/${this.state.playlist}/songs`, {credentials: 'include'})
      .then(res => res.json())
      .then(tracks => this.setState({tracks}))
      .catch(console.error)
  }

  setPlay(song) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    fetch(`/play/${this.state.playlist}`, {
      method: 'put',
      headers: headers,
      body: JSON.stringify({start_with: song}),
      credentials: 'include'
    }).catch(console.error);
  }

  buildChip(tag) {
    const { name, uuid } = tag;
    const chipStyle = {
      margin: 4
    };

    return (
      <Chip style={chipStyle} key={`chip-${uuid}`}
        backgroundColor={blue300} onClick={() => selectPlaylist(uuid)}>
        {name}
      </Chip>
    );
  }

  buildPlayButton(metadata) {
    const { uuid } = metadata;
    return (
      <IconButton onClick={() => this.setPlay(uuid)}>
        <PlayButton />
      </IconButton>
    );
  }

  jsonToTableEntry(obj) {
    const [metadata, tags] = obj;
    const { name, artist, uuid } = metadata;

    return (
      <TableRow key={`song-${uuid}`}>
        <TableRowColumn>{this.buildPlayButton(metadata)}</TableRowColumn>
        <TableRowColumn>{name}</TableRowColumn>
        <TableRowColumn>{artist}</TableRowColumn>
        <TableRowColumn>{tags.map(this.buildChip)}</TableRowColumn>
      </TableRow>
    );
  }

  render() {
    const body = this.state.length === 0 ?
      <TableRow><TableRowColumn>Loading ...</TableRowColumn></TableRow> :
      this.state.tracks.map(this.jsonToTableEntry);
    return (
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn></TableHeaderColumn>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Artist</TableHeaderColumn>
            <TableHeaderColumn>Tags</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {body}
        </TableBody>
      </Table>
    );
  }
};

export default SongsSection;

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

class SongsSection extends React.Component {

  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      tracks: []
    }

    this.getTracks();
  }

  getTracks() {
    fetch('/nodes/d64532c052644af891c4c2390680d5ca/songs')
      .then(res => res.json())
      .then(tracks => this.setState({tracks}))
      .catch(console.error)
  }

  setPlay(uuid) {
    fetch(`/tracks/${uuid}/play`, {
      method: 'post'
    }).catch(console.error);
  }

  buildChip(tag) {
    const { name } = tag;
    const chipStyle = {
      margin: 4
    };

    return (
      <Chip style={chipStyle} backgroundColor={blue300} onClick={() => {}}>
        {name}
      </Chip>
    );
  }

  buildPlayButton(metadata) {
    const { uuid } = metadata;
    return (
      <IconButton onClick={this.setPlay.bind(this, uuid)}>
        <PlayButton />
      </IconButton>
    );
  }

  jsonToTableEntry(obj) {
    const [metadata, tags] = obj;
    const { name, artist } = metadata;

    return (
      <TableRow>
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

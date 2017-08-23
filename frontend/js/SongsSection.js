import React from 'react';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import autobind from 'react-autobind';
import PlayButton from 'material-ui/svg-icons/av/play-circle-filled';
import IconButton from 'material-ui/IconButton';

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
    fetch('/nodes')
      .then(res => res.json())
      .then(out => out.children[0].tracks)
      .then(tracks => this.setState({tracks}))
      .catch(console.error)
  }

  setPlay(uuid) {
    fetch(`/tracks/${uuid}/play`, {
      method: 'post'
    }).catch(console.error);
  }

  jsonToTableEntry(obj) {
    return (
      <TableRow>
        <TableRowColumn><IconButton onClick={this.setPlay.bind(this, obj.uuid)}><PlayButton /></IconButton></TableRowColumn>
        <TableRowColumn>{obj.name}</TableRowColumn>
        <TableRowColumn>{obj.artist}</TableRowColumn>
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
            <TableHeaderColumn tooltip="The Name">Name</TableHeaderColumn>
            <TableHeaderColumn tooltip="The Artist">Artist</TableHeaderColumn>
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

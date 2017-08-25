import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import {ListItem} from 'material-ui/List';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import autobind from 'react-autobind';

class PlaylistNavigation extends React.Component {

  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      tree: {}
    }

    this.getTree();
  }

  jsonToListItem(obj) {
    const { children, name, uuid } = obj;
    const subitems = !Array.isArray(children) || children.length === 0 ? undefined : children.map(this.jsonToListItem);
    return (
      <ListItem key={uuid} primaryText={name} nestedItems={subitems} />
    );
  }

  getTree() {
    fetch('/nodes/d64532c052644af891c4c2390680d5ca')
      .then(res => res.json())
      .then(tree => this.setState({tree}))
      .catch(console.error)
  }

  render() {
    return (
      <Drawer open={true}>
        {this.jsonToListItem(this.state.tree)}
      </Drawer>
    );
  }

};

export default PlaylistNavigation;

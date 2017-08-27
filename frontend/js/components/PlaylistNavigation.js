import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import { ListItem } from 'material-ui/List';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import autobind from 'react-autobind';

import { selectPlaylist, openDrawer } from 'actions/ActionCreator';
import NavStore from 'stores/NavStore';

function getStateFromStore() {
  return {
    playlist: NavStore.getSelectedPlaylist(),
    open: NavStore.getDrawerOpen()
  }
}

class PlaylistNavigation extends React.Component {

  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      tree: {},
      playlist: '',
      open: true
    }

    this.getTree()
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

  jsonToListItem(obj) {
    const { children, name, uuid } = obj;
    const subitems = Array.isArray(children) && children.length !== 0 ?
      children.map(this.jsonToListItem) : undefined;
    return (
      <ListItem initiallyOpen={true} onClick={() => selectPlaylist(uuid)}
        key={uuid} primaryText={name} nestedItems={subitems}
      />
    );
  }

  getTree() {
    fetch(`/nodes`, {credentials: 'include'})
      .then(res => res.json())
      .then(tree => this.setState({tree}))
      .catch(console.error)
  }

  render() {
    return (
      <Drawer open={this.state.open}>
        <ListItem onClick={() => openDrawer(false)} primaryText="Close Navigation" 
          rightIcon={<NavigationClose />}
        />
        {this.jsonToListItem(this.state.tree)}
      </Drawer>
    );
  }

};

export default PlaylistNavigation;

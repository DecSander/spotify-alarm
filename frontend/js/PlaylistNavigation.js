import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import {ListItem} from 'material-ui/List';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

class PlaylistNavigation extends React.Component {

  jsonToListItem(obj) {
    const { children, name } = obj;
    const subitems = !Array.isArray(children) || children.length === 0 ? undefined : children.map(this.jsonToListItem);
    return (
      <ListItem primaryText={name} nestedItems={subitems} />
    );
  }

  getJson() {
    return {
      name: 'Root',
      children: [{
        name: 'Sub1'
      }]
    }
  }

  render() {
    return (
      <Drawer open={false}>
        {this.jsonToListItem(this.getJson())}
      </Drawer>
    );
  }

};

export default PlaylistNavigation;

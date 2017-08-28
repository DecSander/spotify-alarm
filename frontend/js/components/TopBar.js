import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';

import { openDrawer } from 'actions/ActionCreator';

class TopBar extends React.Component {

  render() {
    return (
      <AppBar title="Spoti-Tree"
        iconElementLeft={<IconButton onClick={() => openDrawer(true)}><NavigationMenu /></IconButton>}
      />
    );
  }
}

export default TopBar;

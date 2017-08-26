import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import PlaylistNavigation from 'components/PlaylistNavigation';
import SongsSection from 'components/SongsSection';

import { openDrawer } from 'actions/ActionCreator';

const App = () => (
  <MuiThemeProvider>
    <div>
      <AppBar
        title="Spoti-Tree"
        iconElementLeft={<IconButton onClick={() => openDrawer(true)}><NavigationMenu /></IconButton>}
      />
      <PlaylistNavigation />
      <SongsSection />
    </div>
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('react')
);
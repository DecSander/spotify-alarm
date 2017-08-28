import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import PlaylistNavigation from 'components/PlaylistNavigation';
import SongsSection from 'components/SongsSection';
import Player from 'components/Player';
import TopBar from 'components/TopBar';

const App = () => (
  <MuiThemeProvider>
    <div>
      <TopBar />
      <PlaylistNavigation />
      <SongsSection />
      <Player />
    </div>
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('react')
);
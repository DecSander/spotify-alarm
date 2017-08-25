import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import PlaylistNavigation from './PlaylistNavigation';
import SongsSection from './SongsSection';

const App = () => (
  <MuiThemeProvider>
    <div>
      <AppBar
        title="Spoti-Tree"
        iconElementLeft={<IconButton><NavigationClose /></IconButton>}
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
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import PlaylistNavigation from './PlaylistNavigation';
import SongsSection from './SongsSection';

const App = () => (
  <MuiThemeProvider>
    <div>
      <PlaylistNavigation />
      <SongsSection />
    </div>
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('react')
);
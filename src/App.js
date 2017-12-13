import React from 'react';
import Chat from './Chat';

const inlineStyles = {
  appContainer: {
    display: 'flex',
    height: '98%',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
};

const App = () => (
  <div style={inlineStyles.appContainer}>
    <Chat />
    <Chat />
    <Chat />
  </div>
);

export default App;

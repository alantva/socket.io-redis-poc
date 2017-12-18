import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Chat from './containers/Chat';
import Login from './containers/Login';

import { getRandomClient } from './utils/common';

const inlineStyles = {
  appContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    height: '100%',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflow: 'auto',
  },
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: [],
    };
  }

  @autobind
  addClient(type) {
    const { clients } = this.state;
    clients.push(getRandomClient(type));
    this.setState({ clients });
  }

  @autobind
  removeClient(rClient = {}) {
    const { clients } = this.state;
    const nClients = clients.filter(client => client.id !== rClient.id);
    this.setState({ clients: nClients });
  }

  renderClients() {
    const { clients } = this.state;
    return clients.map(client => (
      <Chat {...client} onLogout={this.removeClient} />
    ));
  }

  render() {
    return (
      <MuiThemeProvider>
        <div style={inlineStyles.appContainer}>
          <Login onClick={this.addClient} />
          {this.renderClients()}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;

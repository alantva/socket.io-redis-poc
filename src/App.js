import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { ready: false };
  }
  render() {
    return (
      <div>{this.state.ready.toString()}</div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import io from 'socket.io-client';
import _ from 'lodash';

import names from './names';

const inlineStyles = {
  mainContainer: {
    height: '98%',
    width: '98%',
    margin: '1%',
  },
  statusContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameStyle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pingStyle: {
    fontSize: 10,
  },
  messagesContainer: {
    height: '65%',
    width: '100%',
    overflow: 'auto',
    border: '1px solid grey',
    backgroundColor: '#cecece',
  },
  paragraphStyle: {
    padding: '0 10px',
  },
  meStyle: {
    color: 'blue',
  },
  strangerStyle: {
    color: 'red',
  },
  textareaContainer: {
    height: '30%',
  },
  textareaStyle: {
    height: '98%',
    width: '98%',
    overflow: 'auto',
    padding: '1%',
    resize: 'none',
    backgroundColor: '#ededed',
  },
};

const socketOptions = {
  reconnectionDelay: 5000,
  reconnectionDelayMax: 10000,
  transports: ['websocket', 'polling'],
  forceNew: true,
};

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: names[Math.floor(Math.random() * names.length)],
      value: '',
      messages: [],
      ping: 0,
    };
    this.io = io(process.env.API_URL, socketOptions);
    this.io.on('pong', this.handlePong);

    this.receiver = io(`${process.env.API_URL}/receiver`, socketOptions);
    this.receiver.on('message', this.handleMessage);

    this.sender = io(`${process.env.API_URL}/sender`, socketOptions);
  }

  @autobind
  onChange(ev) {
    const { value } = ev.currentTarget;
    this.setState({ value });
  }

  @autobind
  onKeyDown(ev) {
    const { name, value } = this.state;
    const { keyCode } = ev;
    if (keyCode === 13) {
      ev.preventDefault();
      this.sender.emit('message', {
        name,
        text: value,
      });
      this.setState({ value: '' }, () => {
        this.container.scrollTop = this.container.offsetHeight;
      });
    }
  }

  @autobind
  handleMessage(data) {
    const { messages, name } = this.state;
    const nData = _.cloneDeep(data);
    nData.id = `id_${messages.length}`;
    nData.name = name === data.name ? 'Me' : data.name;
    nData.me = name === data.name;
    messages.push(nData);
    this.setState({ messages }, () => {
      this.container.scrollTop = this.container.offsetHeight;
    });
  }

  @autobind
  handlePong(ping) {
    this.setState({ ping });
  }

  render() {
    const {
      name,
      value,
      messages,
      ping,
    } = this.state;
    return (
      <div style={inlineStyles.mainContainer}>
        <div style={inlineStyles.statusContainer}>
          <span style={inlineStyles.nameStyle}>{name}</span>
          <span style={inlineStyles.pingStyle}>{ping}ms</span>
        </div>
        <div ref={(r) => { this.container = r; }} style={inlineStyles.messagesContainer}>
          {messages.map(message => (
            <p style={inlineStyles.paragraphStyle} key={message.id}>
              <span style={message.me ? inlineStyles.meStyle : inlineStyles.strangerStyle}>
                {message.name}:&nbsp;
              </span>
              {message.text}
            </p>
          ))}
        </div>
        <div style={inlineStyles.textareaContainer}>
          <textarea
            type="text"
            style={inlineStyles.textareaStyle}
            value={value}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
          />
        </div>
      </div>
    );
  }
}

export default Chat;

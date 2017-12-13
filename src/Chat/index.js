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
  messagesContainer: {
    height: '70%',
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

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: names[Math.floor(Math.random() * names.length)],
      value: '',
      messages: [],
    };
    this.SOCKET = io(process.env.API_URL, {
      reconnectionDelay: 5000,
      reconnectionDelayMax: 10000,
      transports: ['websocket', 'polling'],
      forceNew: true,
    });

    this.SOCKET.on('message', this.handleMessage);
  }

  @autobind
  onChange(ev) {
    const { value } = ev.currentTarget;
    this.setState({ value });
  }

  @autobind
  onKeyDown(ev) {
    const { name, value, messages } = this.state;
    const { keyCode } = ev;
    if (keyCode === 13) {
      ev.preventDefault();
      messages.push({
        id: `id_${messages.length}`,
        name: 'Me',
        text: value,
        me: true,
      });
      this.SOCKET.emit('message', {
        name,
        text: value,
      });
      this.setState({ value: '', messages }, () => {
        this.container.scrollTop = this.container.offsetHeight;
      });
    }
  }

  @autobind
  handleMessage(data) {
    const { messages } = this.state;
    const nData = _.cloneDeep(data);
    nData.id = `id_${messages.length}`;
    messages.push(nData);
    this.setState({ messages }, () => {
      this.container.scrollTop = this.container.offsetHeight;
    });
  }

  render() {
    const { value, messages } = this.state;
    return (
      <div style={inlineStyles.mainContainer}>
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

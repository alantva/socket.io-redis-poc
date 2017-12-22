import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import RaisedButton from 'material-ui/RaisedButton';
import io from 'socket.io-client';
import _ from 'lodash';

import './chat.css';

const inlineStyles = {
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'calc(25% - 20px)',
    height: 'calc(33.3% - 20px)',
    padding: 10,
    border: 'none',
  },
  statusContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
  },
  nameStyle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pingStyle: {
    fontSize: 10,
  },
  dcStyle: {
    minWidth: 70,
  },
  messagesContainer: {
    height: '65%',
    width: '100%',
    overflow: 'auto',
    border: '1px solid grey',
    backgroundColor: 'azure',
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
    width: '100%',
  },
  textareaStyle: {
    height: '100%',
    width: '100%',
    overflow: 'auto',
    padding: '0',
    margin: '0',
    border: 'none',
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
      value: '',
      roomID: null,
      messages: [],
      ping: 0,
    };
    this.connection = io(process.env.API_URL, socketOptions);
    this.connection.on('pong', this.handlePong);
  }

  componentWillMount() {
    this.connection.on('message', this.handleMessage);
    this.connection.on('room', this.handleRoom);
  }

  componentWillUnmount() {
    this.connection.disconnect();
  }

  @autobind
  onChange(ev) {
    const { value } = ev.currentTarget;
    this.setState({ value });
  }

  @autobind
  onKeyDown(ev) {
    const { value, roomID } = this.state;
    const { name } = this.props;
    const { keyCode } = ev;
    if (keyCode === 13) {
      ev.preventDefault();
      this.connection.emit('message', { name, text: value, roomID });
      this.setState({ value: '' }, () => {
        this.container.scrollTop = this.container.offsetHeight;
      });
    }
  }

  @autobind
  handleMessage(data) {
    const { messages } = this.state;
    const { name } = this.props;
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
  handleRoom(data) {
    const { roomID } = data;
    this.setState({ roomID });
  }

  @autobind
  handlePong(ping) {
    this.setState({ ping });
  }

  @autobind
  handleDisconnect(ev) {
    ev.preventDefault();
    const { id } = this.props;
    this.props.onLogout({ id });
  }

  render() {
    const { value, roomID, messages, ping } = this.state; // eslint-disable-line
    const { name, type } = this.props;
    return (
      <div style={inlineStyles.mainContainer} className={type}>
        <div style={inlineStyles.statusContainer}>
          <span style={inlineStyles.nameStyle}>{name}</span>
          <span style={inlineStyles.pingStyle}>{ping}ms</span>
          <RaisedButton
            onClick={this.handleDisconnect}
            style={inlineStyles.dcStyle}
            label="Sair"
          />
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
            disabled={roomID === null}
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

Chat.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Chat;

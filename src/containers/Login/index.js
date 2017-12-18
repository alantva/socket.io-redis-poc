import React from 'react';
import PropTypes from 'prop-types';
import MUIRaisedButton from 'material-ui/RaisedButton';

const inlineStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'calc(25% - 20px)',
    height: 'calc(33.3% - 20px)',
    backgroundColor: '#cecece',
    padding: 10,
    border: 'none',
  },
};

const Login = props => (
  <div style={inlineStyles.container}>
    <div>
      <h3>Are you</h3>
    </div>
    <div>
      <MUIRaisedButton label="User" primary onClick={() => props.onClick('user')} />
    </div>
    <div>
      <h4>or</h4>
    </div>
    <div>
      <MUIRaisedButton label="Customer" primary onClick={() => props.onClick('customer')} />
    </div>
  </div>
);

Login.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Login;

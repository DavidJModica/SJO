import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import jwt from 'jsonwebtoken';

// Import Style
import styles from './Header.css';

// Import MaterialUI Elements
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle'

const authButtonStyle = {
  float: 'right',
  margin: '0 5px',
}

// TODO: If token is authed, show logout instead of register/login
export function Header(props, context) {
  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <h1 className={styles['site-title']}>
          <Link to="/"><FormattedMessage id="siteTitle" /></Link>
        </h1>
        <div>
        {
          (props.token)
          ? <div>
              <Button variant="raised" href="/auth/login" style={authButtonStyle} onClick={props.logout}>
                <FormattedMessage id="logout" />
              </Button>
              <Button variant="raised" color="secondary" href="/entries" style={authButtonStyle}>
                <FormattedMessage id="entries" />
              </Button>
            </div>
          : <div>
              <Button variant="raised" color="secondary" href="/auth/signup" style={authButtonStyle}>
                <FormattedMessage id="register" />
              </Button>
              <Button variant="raised" color="secondary" href="/auth/login" style={authButtonStyle}>
                <FormattedMessage id="login" />
              </Button>
          </div>
        }
        </div>
        <div>
          {
            props.token && jwt.decode(props.token).userType == 'admin' &&
            <div>
              <Button variant="raised" href="/admin" style={authButtonStyle}>
                <FormattedMessage id="admin" />
              </Button>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

Header.contextTypes = {
  router: PropTypes.object,
};

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  token: PropTypes.string,
};

export default Header;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import Style
import styles from './App.css';

// Import Components
import Helmet from 'react-helmet';
import DevTools from './components/DevTools';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// Import Actions
import { addUserProps, logOutRequest } from './AppActions';
import { restoredSession } from '../Auth/AuthActions';
// Import Selectors
import { getToken } from '../Auth/AuthReducer';

// Import Cookies
import { withCookies, Cookies } from 'react-cookie';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#4D93CC",
      main: "#2275BA",
      dark: "#095390",
      contrastText: "#FFF"
    },
    secondary: {
      light: "#46D199",
      main: "#18C17D",
      dark: "#00985B",
      contrastText: "#FFF"
    },
    error: {
      light: "#FB5460",
      main: "#FA1F2F",
      dark: "#DA0010",
      contrastText: "#FFF"
    }
  }
});

export class App extends Component {
  constructor(props, context) {
    super(props, context);
    const { cookies } = this.props;
    const token = cookies.get('sales-journal-token');
    if (token) {
      this.props.dispatch(restoredSession(token));
    }
    this.state = { isMounted: false };
  }

  componentDidMount() {
    this.setState({isMounted: true}); // eslint-disable-line
  }

  handleLogout() {
    this.props.dispatch(logOutRequest());
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          {this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools />}
          <div>
            <Helmet
              title="Sales Journal"
              titleTemplate="%s - Sales Journal Online"
              meta={[
                { charset: 'utf-8' },
                {
                  'http-equiv': 'X-UA-Compatible',
                  content: 'IE=edge',
                },
                {
                  name: 'viewport',
                  content: 'width=device-width, initial-scale=1',
                },
              ]}
            />
            <Header
              logout={this.handleLogout.bind(this)}
              token={this.props.token}
            />
            <div className={styles.container}>
              {this.props.children}
            </div>
            <Footer />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};

// Retrieve data from state as props
function mapStateToProps(state) {
  return {
    intl: state.intl,
    token: state.auth.token,
  };
}

export default connect(mapStateToProps)(withCookies(App));

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

class EnsureNotLoggedInContainer extends Component {
  componentDidMount() {
    if(this.props.token) {
      // set the current url/path for future redirection (we use a Redux action)
      // then redirect (we use a React Router method)
      browserHistory.replace("/entries")
    }
  }

  render() {
    if (!this.props.token) {
      return this.props.children
    } else {
      return null
    }
  }
}

// Grab a reference to the current URL. If this is a web app and you are
// using React Router, you can use `ownProps` to find the URL. Other
// platforms (Native) or routing libraries have similar ways to find
// the current position in the app.
function mapStateToProps(state) {
  return { token: state.auth.token };
}

export default connect(mapStateToProps)(EnsureNotLoggedInContainer)

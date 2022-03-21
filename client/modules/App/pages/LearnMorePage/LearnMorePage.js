import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';

//import styles from './LearnMorePage.css';

class LearnMorePage extends Component {
  render() {
    return (
      <div>
        <div>
          <Button variant="raised" color="secondary" href="/auth/signup">
            <FormattedMessage id="register" />
          </Button>
          <p>
            Accomplishing your goals and big wins begins with focusing on your most important tasks,
            not the busy work that makes days slip away. Built from productivity principles, the Sales
            Journal has been designed to help you beat procrastination and get more important work done
            to help you CRUSH YOUR QUOTA.
          </p>
        </div>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps() {
  return {
  };
}

LearnMorePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

LearnMorePage.contextTypes = {
  router: PropTypes.object,
};

export default injectIntl(connect(mapStateToProps)(LearnMorePage));

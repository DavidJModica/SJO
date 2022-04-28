import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import styles from './HomePage.css';

class HomePage extends Component {
  render() {
    return (
      <div>
        <div>
          <div className={styles.title}>
            <h2>Get More Done. Crush Your Quota.</h2>
          </div>
          <div className={styles.content}>
            <p>Stay focused. Stay productive. Soar past your targets. Built from
            productivity principles, the Sales Journal has been designed specifically
            for sales professionals.</p>
          </div>
          <div className={styles.button}>
            <Button variant="raised" color="secondary" href="/auth/signup">
              <FormattedMessage id="register" />
            </Button>
          </div>
        </div>
        <div className={styles.details}>
          <Grid container spacing={24}>
            <Grid item xs={12} lg={6}>
              <strong>Most Important Task of the Day</strong> – Humans are terrible multi-taskers.
              Writing down one major task for the day will hold us accountable and put it
              in our subconscious throughout the day. Over time, achieving that one major
              task every day will put the SDR on top of the leaderboard.
            </Grid>
            <Grid item xs={12} lg={6}>
              <strong>People I Need to Contact Today (no matter what)</strong> – The primary function
              of the Sales Development Rep role is to book meetings with the right people. Writing down their
              names will keep us focused on who we can’t let slip through the cracks.
            </Grid>
            <Grid item xs={12} lg={6}>
              <strong>Call Counter</strong> – This is a psychological motivator to achieve activities.
              Making calls can be hard, especially for new SDRs.
            </Grid>
            <Grid item xs={12} lg={6}>
              <strong>Time Blocks</strong> – Build the day before it begins and be disciplined with time.
            </Grid>
            <Grid item xs={12} lg={6}>
              <strong>Results Tracker</strong> – Sales is a numbers game. You cannot improve what you do not
              track. Keeping count of your activities, intros, and SQLs is an important part of making sure
              you're hitting the numbers you need to be.
            </Grid>
            <Grid item xs={12} lg={6}>
              <strong>What Went Well Today?</strong> - There are days it feels like nothing is going right.
              Leaving the office on that note can hurt confidence and motivation. There’s always
              a silver lining to every day, even the worst of them. Taking the time to think about
              the good and writing it down will keep the SDR in a positive frame of mind to start
              fresh the next day.
            </Grid>
            <Grid item xs={12} lg={6}>
              <strong>What Could I Have Done Better Today?</strong> - Reflection is a necessary part of growth.
              Small, incremental improvements every day will result in high-achiever performance in
              the long run.
            </Grid>
          </Grid>
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

HomePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

HomePage.contextTypes = {
  router: PropTypes.object,
};

export default injectIntl(connect(mapStateToProps)(HomePage));

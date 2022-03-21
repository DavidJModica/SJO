import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage, FormattedDate } from 'react-intl';
import moment from 'moment';
import classNames from 'classnames';
import update from 'immutability-helper';

// Import Calendar
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Import MaterialUI Elements
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TimeInput from 'material-ui-time-picker';

// Import Custom Components
import Notification from '../../../../components/Notification';
import QuoteWidget from '../../../Quote/components/QuoteWidget/QuoteWidget';

// Import Style
import styles from './EntryDetailPage.css';

// Import Actions
import { fetchEntry, saveEntryRequest } from '../../EntryActions';
import { fetchRandomQuote } from '../../../Quote/QuoteActions';

// Import Selectors
import { getEntry, getMessage, getNotificationState, getNotificationType } from '../../EntryReducer';
import { getToken } from '../../../Auth/AuthReducer';
import { getRandomQuote } from '../../../Quote/QuoteReducer';

// Import Cookies
import { Cookies, withCookies } from 'react-cookie'

const deleteButtonStyle = {
  'backgroundColor': '#FA1F2F',
  'color': '#FFF'
}

class EntryDetailPage extends Component {
  constructor(props) {
    super(props);

    // The weirdness with schedule is to make sure that all 10 schedule
    // TextFields have an initial value to prevent React from complaining
    // that it's going from uncontrolled to controlled. We're also converting
    // the date into a format the text field recognizes.

    // The ugliness with events is because react-big-calendar needs dates, but
    // the dates are stored as strings in the DB, so they have to be converted.
    // In the case where there are no events, we're falling back to checking the
    // schedule and converting them into the proper event format.
    this.state = {
      activities: this.props.entry.activities || 0,
      addEvent: false,
      editEvent: false,
      eventIndex: null,
      calls: this.props.entry.calls || 0,
      contact: this.props.entry.contact || "",
      rawDate: moment(this.props.entry.date),
      date: moment(this.props.entry.date).format("YYYY-MM-DD") || moment().format("YYYY-MM-DD"),
      dialogTitle: "Add Event",
      events: this.props.entry.events.length > 0 ?
        this.props.entry.events.map(event => { return {'title': event.title, startDate: new Date(event.startDate), endDate: new Date(event.endDate)} }) :
        this.props.entry.schedule.map((schedule, index) => {
          return {
            'title': schedule,
            startDate: moment(this.props.entry.date).add(8+index, 'hours').toDate(),
            endDate: moment(this.props.entry.date).add(9+index, 'hours').toDate()
          }}).filter(event => event.title),
      eventStart: moment(),
      eventEnd: moment(),
      eventTitle: "",
      improve_desc: this.props.entry.improve_desc || "",
      improve_how: this.props.entry.improve_how || "",
      intros: this.props.entry.intros || 0,
      move_needle: this.props.entry.move_needle || "",
      negative_desc: this.props.entry.negative_desc || "",
      negative_why: this.props.entry.negative_why || "",
      notes: this.props.entry.notes || "",
      positive_desc: this.props.entry.positive_desc || "",
      positive_why: this.props.entry.positive_why || "",
      schedule: this.props.entry.schedule.concat(new Array(10-this.props.entry.schedule.length).fill("")),
      sqls: this.props.entry.sqls || 0,
      task: this.props.entry.task || "",
      type: this.props.entry.type || "daily",
      _id: this.props.entry._id,
      notification: this.props.notification,
      width: 0,
      height: 0,
    };
  }

  handleWindowClose(event) {
    event.preventDefault();
    return event.returnValue = '';
  };

  componentDidMount() {
    // TODO: Check state for entry before making API call to fetch it
    const { cookies } = this.props;
    const token = cookies.get('sales-journal-token');
    this.props.dispatch(fetchEntry(this.props.params.id, token));
    this.props.dispatch(fetchRandomQuote(token));
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  };

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleWindowClose);
    window.removeEventListener('resize', this.updateWindowDimensions);
  };

  handleChange(event) {
    // To update the schedule we need to create a mutable
    // copy of the array from state, then update it and
    // set the entire schedule array in state at once
    window.addEventListener('beforeunload', this.handleWindowClose);
    if (event.target.name == 'schedule') {
      let schedule = this.state.schedule.slice();
      schedule[event.target.id] = event.target.value;
      this.setState({ schedule });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  };

  handleStartTimeChange(startTime) {
    startTime = new Date(moment(startTime).year(this.state.rawDate.year()).week(this.state.rawDate.week()).date(this.state.rawDate.date()));
    this.setState({ 'eventStart': startTime })
  }

  handleEndTimeChange(endTime) {
    endTime = new Date(moment(endTime).year(this.state.rawDate.year()).week(this.state.rawDate.week()).date(this.state.rawDate.date()));
    this.setState({ 'eventEnd': endTime })
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ notification: false });
  };

  handleIncrement = () => this.setState({'calls': ++this.state.calls});

  handleDecrement = () => this.state.calls > 0 ? this.setState({'calls': --this.state.calls}) : 0;

  save(event) {
    event.preventDefault();
    const { cookies } = this.props;
    const token = cookies.get('sales-journal-token');
    // We're make a copy of the state and formatting the
    // date for the backend.
    let formattedState = Object.assign({}, this.state);
    formattedState.date = moment(formattedState.date).toISOString();
    this.props.dispatch(saveEntryRequest(formattedState, token));
    this.setState({ notification: true });
    window.removeEventListener('beforeunload', this.handleWindowClose);
  }

  addEvent(slotInfo) {
    this.setState({
      addEvent: true,
      eventStart: slotInfo.start,
      eventEnd: slotInfo.end,
      dialogTitle: "Add Event"
    });
  }

  modifyEvent(event) {
    this.setState({
      editEvent: true,
      eventStart: event.startDate,
      eventEnd: event.endDate,
      eventTitle: event.title,
      eventIndex: this.state.events.indexOf(event),
      dialogTitle: "Edit Event"
    });
  }

  handleEventSave() {
    let newEvents = [];
    const index = this.state.eventIndex;
    const event = {
      startDate: this.state.eventStart,
      endDate: this.state.eventEnd,
      title: this.state.eventTitle
    };

    if (index) {
      newEvents = update(this.state.events, {[index]: {$set: event}});
    } else {
      newEvents = update(this.state.events, {$push: [event]});
    }

    this.setState({
      events: newEvents,
      addEvent: false,
      editEvent: false,
      eventTitle: "",
      eventIndex: null
    });
  }

  handleEventDelete(event) {
    const newEvents = update(this.state.events, {$splice: [[this.state.eventIndex, 1]]});

    this.setState({
      events: newEvents,
      addEvent: false,
      editEvent: false,
      eventTitle: "",
      eventIndex: null
    });
  }

  handleEventClose() {
    this.setState({ addEvent: false, editEvent: false, eventTitle: "" });
  }

  render() {
    BigCalendar.momentLocalizer(moment);

    const saveButtonClassName = classNames(styles['save-entry-button'],
      (this.state.notification && this.state.width < 1280) ? styles['save-move-up'] : styles['save-move-down']);

    return (
      <div>
        <div className={`${(this.state.notification ? styles.flex : styles.hide)}`}>
          <Notification
            open={this.state.notification}
            onClose={this.handleClose}
            variant={this.props.notificationType}
            message={this.props.message}
          />
        </div>
        <Dialog
          open={this.state.addEvent || this.state.editEvent}
          onClose={this.handleEventClose.bind(this)}
          aria-labelledby="form-dialog-event-title"
        >
          <DialogTitle id="form-dialog-event-title">{this.state.dialogTitle}</DialogTitle>
          <DialogContent>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="eventTitle"
                  name="eventTitle"
                  label="Title"
                  type="text"
                  fullWidth
                  multiline
                  value={this.state.eventTitle}
                  onChange={this.handleChange.bind(this)}
                />
              </Grid>
              <Grid item xs={12} lg={4}>
                <FormControl>
                  <InputLabel>Start Time</InputLabel>
                  <TimeInput
                    mode='12h'
                    value={this.state.eventStart}
                    onChange={(eventStart) => this.handleStartTimeChange(eventStart)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={4}>
                <FormControl>
                  <InputLabel htmlFor="end-time">End Time</InputLabel>
                  <TimeInput
                    id='end-time'
                    mode='12h'
                    value={this.state.eventEnd}
                    onChange={(eventEnd) => this.handleEndTimeChange(eventEnd)}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {this.state.editEvent &&
              <Button onClick={this.handleEventDelete.bind(this)} style={deleteButtonStyle}>
                Delete
              </Button>
            }
            <Button onClick={this.handleEventClose.bind(this)}>
              Cancel
            </Button>
            <Button onClick={this.handleEventSave.bind(this)} color="secondary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <QuoteWidget
          quote = {this.props.quote}
        />
        <form onSubmit={this.save.bind(this)}>
          <Grid container spacing={16}>
            <h2 className={styles['entry-date']}>
              <FormattedDate
                value={moment(this.state.date)}
                weekday='long'
                year='numeric'
                month='long'
                day='2-digit'
              />
            </h2>
            <br/>
            <br/>
          </Grid>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <TextField
                id="date"
                name="date"
                type="date"
                label="Date"
                value={this.state.date}
                onChange={this.handleChange.bind(this)}
              />
            </Grid>
            <Grid item xs={12} className={`${styles['edit-entry-type']}`}>
              <h5>Entry Type</h5>
              <Select
                native
                value={this.state.type}
                onChange={this.handleChange.bind(this)}
                name="type"
                input={<Input id="type" />}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </Select>
            </Grid>
          </Grid>
          <div id="daily" className={`${(this.state.type == 'daily' ? styles.show : styles.hide)}`}>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <h5>TODAY, MY MOST IMPORTANT TASK IS</h5>
                <TextField
                  id="task"
                  name="task"
                  label="If you could only do one thing today, this would be it."
                  value={this.state.task}
                  onChange={this.handleChange.bind(this)}
                  margin="dense"
                  fullWidth
                  multiline
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <Grid item xs={12}>
                  <h5 className={`${styles['header-center']}`}>
                    THE PEOPLE I NEED TO<br/>
                    CONTACT TODAY
                  </h5>
                  <TextField
                    id="contact"
                    name="contact"
                    label="No matter what."
                    value={this.state.contact}
                    onChange={this.handleChange.bind(this)}
                    margin="normal"
                    rows="17"
                    rowsMax="17"
                    fullWidth
                    multiline
                  />
                </Grid>
                <Grid item xs={12}>
                  <h5 className={`${styles['header-center']}`}>CALL COUNTER</h5>
                  <Grid container justify="center">
                    <Grid item>
                      <Icon onClick={this.handleDecrement} className={`${styles['edit-entry-calls-sub']}`}>indeterminate_check_box</Icon>
                      <TextField
                        id="calls"
                        name="calls"
                        value={this.state.calls}
                        onChange={this.handleChange.bind(this)}
                        margin="normal"
                        type="number"
                      />
                      <Icon onClick={this.handleIncrement} className={`${styles['edit-entry-calls-add']}`}>add_box</Icon>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} lg={6} className={`${styles['schedule']}`}>
                <h5 className={`${styles['header-center']}`}>SCHEDULE</h5>
                <BigCalendar
                  selectable={true}
                  defaultView={BigCalendar.Views.DAY}
                  defaultDate={moment(this.state.date).toDate()}
                  events={this.state.events}
                  startAccessor='startDate'
                  endAccessor='endDate'
                  views={['day']}
                  toolbar={false}
                  scrollToTime={moment("2018-08-04T12:00:00Z").toDate()}
                  onSelectSlot={slotInfo => {this.addEvent(slotInfo)}}
                  onSelectEvent={event => this.modifyEvent(event)}
                />
              </Grid>
              <Grid item xs={12}>
                <h5 className={`${styles['header-center']}`}>
                  NOTES
                </h5>
                <TextField
                  id="notes"
                  name="notes"
                  value={this.state.notes}
                  onChange={this.handleChange.bind(this)}
                  margin="normal"
                  fullWidth
                  multiline
                  rows="10"
                  rowsMax="10"
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container alignItems="center">
                  <Grid item xs={12} lg={3}>
                    <h5>
                      RESULTS OF THE DAY
                    </h5>
                  </Grid>
                  <Grid item xs={12} lg={3}>
                    <TextField
                      id="activities"
                      name="activities"
                      label="Activities"
                      value={this.state.activities}
                      onChange={this.handleChange.bind(this)}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} lg={3}>
                    <TextField
                      id="intros"
                      name="intros"
                      label="Intros"
                      value={this.state.intros}
                      onChange={this.handleChange.bind(this)}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} lg={3}>
                    <TextField
                      id="sqls"
                      name="sqls"
                      label="SQLs"
                      value={this.state.sqls}
                      onChange={this.handleChange.bind(this)}
                      type="number"
                      />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} className={`${styles['edit-entry-positive-desc']}`}>
                <h5>WHAT WENT WELL TODAY</h5>
                <TextField
                  id="positive_desc"
                  name="positive_desc"
                  value={this.state.positive_desc}
                  onChange={this.handleChange.bind(this)}
                  fullWidth
                  multiline
                />
              </Grid>
              <Grid item xs={12} className={`${styles['edit-entry-negative-desc']}`}>
                <h5>WHAT COULD I HAVE DONE BETTER TODAY</h5>
                <TextField
                  id="negative_desc"
                  name="negative_desc"
                  value={this.state.negative_desc}
                  onChange={this.handleChange.bind(this)}
                  fullWidth
                  multiline
                />
              </Grid>
            </Grid>
          </div>
          <div id="weekly" className={`${(this.state.type == 'weekly' ? styles.show : styles.hide)}`}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justify="center" spacing={16}>
                <Grid item xs={12} lg={3}>
                  <h3>
                    RESULTS OF THE WEEK
                  </h3>
                </Grid>
                <Grid item xs={12} lg={3}>
                  <TextField
                    id="intros"
                    name="intros"
                    label="Intros"
                    value={this.state.intros}
                    onChange={this.handleChange.bind(this)}
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} lg={3}>
                  <TextField
                    id="sqls"
                    name="sqls"
                    label="SQLs"
                    value={this.state.sqls}
                    onChange={this.handleChange.bind(this)}
                    type="number"
                    />
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={16}>
              <Grid item xs={12} lg={6}>
                <h5 className={`${styles['header-center']}`}>
                  WHAT WENT WELL THIS WEEK
                </h5>
                <TextField
                  id="positive_desc"
                  name="positive_desc"
                  value={this.state.positive_desc}
                  onChange={this.handleChange.bind(this)}
                  margin="normal"
                  rows="10"
                  rowsMax="10"
                  fullWidth
                  multiline
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <h5 className={`${styles['header-center']} ${styles['italic']}`}>
                  Why did it go well this week?
                </h5>
                <TextField
                  id="positive_why"
                  name="positive_why"
                  value={this.state.positive_why}
                  onChange={this.handleChange.bind(this)}
                  margin="normal"
                  rows="10"
                  rowsMax="10"
                  fullWidth
                  multiline
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <h5 className={`${styles['header-center']}`}>
                  WHAT COULD I HAVE DONE<br/>
                  BETTER THIS WEEK
                </h5>
                <TextField
                  id="negative_desc"
                  name="negative_desc"
                  value={this.state.negative_desc}
                  onChange={this.handleChange.bind(this)}
                  margin="normal"
                  rows="10"
                  rowsMax="10"
                  fullWidth
                  multiline
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <h5 className={`${styles['header-center']} ${styles['italic']}`}>
                  Why didn't it happen this week?<br/><br/>
                </h5>
                <TextField
                  id="negative_why"
                  name="negative_why"
                  value={this.state.negative_why}
                  onChange={this.handleChange.bind(this)}
                  margin="normal"
                  rows="10"
                  rowsMax="10"
                  fullWidth
                  multiline
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <h5 className={`${styles['header-center']}`}>
                  WHAT SKILL WILL I IMPROVE<br/>
                  NEXT WEEK
                </h5>
                <TextField
                  id="improve_desc"
                  name="improve_desc"
                  value={this.state.improve_desc}
                  onChange={this.handleChange.bind(this)}
                  margin="normal"
                  rows="10"
                  rowsMax={10}
                  fullWidth
                  multiline
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <h5 className={`${styles['header-center']}  ${styles['italic']}`}>
                  What will I do to improve this skill?<br/><br/>
                </h5>
                <TextField
                  id="improve_how"
                  name="improve_how"
                  value={this.state.improve_how}
                  onChange={this.handleChange.bind(this)}
                  margin="normal"
                  rows="10"
                  rowsMax="10"
                  fullWidth
                  multiline
                />
              </Grid>
              <Grid item xs={12} className={`${styles['edit-entry-move-needle']}`}>
                <h5>WHAT IS ONE THING I CAN DO NEXT WEEK TO MOVE THE NEEDLE?</h5>
                <TextField
                  id="move_needle"
                  name="move_needle"
                  value={this.state.move_needle}
                  onChange={this.handleChange.bind(this)}
                  fullWidth
                  multiline
                />
              </Grid>
            </Grid>
          </div>
          <div id="save" className={saveButtonClassName}>
            <Button
              variant="raised"
              label="save"
              type="submit"
              color="secondary"
              fullWidth
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
EntryDetailPage.need = [
  (params) => { return fetchEntry(params.id, params.token); },
  (params) => { return fetchRandomQuote(params.token); }
];

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    entry: getEntry(state, props.params.id),
    token: getToken(state),
    message: getMessage(state),
    notification: getNotificationState(state),
    notificationType: getNotificationType(state),
    quote: getRandomQuote(state),
  };
}

EntryDetailPage.propTypes = {
  entry: PropTypes.shape({
    activities: PropTypes.number,
    calls: PropTypes.number,
    contact: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(PropTypes.shape({
      startDate: PropTypes.String,
      endDate: PropTypes.String,
      title: PropTypes.String,
    })),
    improve_desc: PropTypes.string,
    improve_how: PropTypes.string,
    intros: PropTypes.number,
    move_needle: PropTypes.string,
    negative_desc: PropTypes.string,
    negative_why: PropTypes.string,
    notes: PropTypes.string,
    positive_desc: PropTypes.string,
    positive_why: PropTypes.string,
    schedule: PropTypes.arrayOf(PropTypes.string),
    sqls: PropTypes.number,
    task: PropTypes.string,
    type: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  message: PropTypes.string,
  notification: PropTypes.bool,
  notificationType: PropTypes.oneOf(['info', 'success', 'error']),
  quote: PropTypes.shape({
    text: PropTypes.string,
    author: PropTypes.string,
  }),
};

EntryDetailPage.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(withCookies(EntryDetailPage));

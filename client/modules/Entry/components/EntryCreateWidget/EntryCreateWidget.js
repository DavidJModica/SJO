import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

// Import Style
import styles from './EntryCreateWidget.css';

export class EntryCreateWidget extends Component {
  addEntry = () => {
    const typeRef = this.refs.type;
    const dateRef = this.refs.date;
    const taskRef = this.refs.task;
    const contactsRef = this.refs.contacts;
    const callsRef = this.refs.calls;
    const scheduleRef = this.refs.schedule;
    const notesRef = this.refs.notes;
    const resultsActivitesRef = this.refs.results.activites;
    const resultsIntrosRef = this.refs.results.intros;
    const resultsSqlsRef = this.refs.results.sqls;
    if (typeRef.value && dateRef.vale) {
      this.props.addEntry(typeRef.value,
                          dateRef.value,
                          taskRef.value,
                          contactsRef.value,
                          callsRef.value,
                          scheduleRef.value,
                          notesRef.value,
                          resultsActivitesRef.value,
                          resultsIntrosRef.value,
                          resultsSqlsRef.value);
      typeRef.value = dateRef.value = taskRef.value = contactsRef.value = callsRef.value = scheduleRef.value = notesRef.value = resultsActivitesRef.value = resultsIntrosRef.value = resultsSqlsRef.value = '';
    }
  };

  render() {
    return (
      <div className={cls}>
        <div className={styles['form-content']}>
          <h2 className={styles['form-title']}><FormattedMessage id="createNewEntry" /></h2>
          <input placeholder={this.props.intl.messages.entryType} className={styles['form-field']} ref="type" />
          <input type="date" placeholder={this.props.intl.messages.entryDate} className={styles['form-field']} ref="date" />

          <input placeholder={this.props.intl.messages.entryTask} className={styles['form-field']} ref="task" />
          <input placeholder={this.props.intl.messages.entryContacts} className={styles['form-field']} ref="contacts" />
          <input type="number" placeholder={this.props.intl.messages.entryCalls} className={styles['form-field']} ref="calls" />

          <div className={styles['form-schedule']}>
            <input placeholder={this.props.intl.messages.entrySchedule} className={styles['form-field']} ref="schedule" />
          </div>

          <input placeholder={this.props.intl.messages.entryNotes} className={styles['form-field']} ref="notes" />

          <div className={styles['form-results']}>
            <input type="number" placeholder={this.props.intl.messages.entryResultsActivities} className={styles['form-field']} ref="results.activites" />
            <input type="number" placeholder={this.props.intl.messages.entryResultsIntros} className={styles['form-field']} ref="results.intros" />
            <input type="number" placeholder={this.props.intl.messages.entryResultsSqls} className={styles['form-field']} ref="results.sqls" />
          </div>

          <a className={styles['entry-submit-button']} href="#" onClick={this.addEntry}><FormattedMessage id="submit" /></a>
        </div>
      </div>
    );
  }
}

EntryCreateWidget.propTypes = {
  addEntry: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(EntryCreateWidget);

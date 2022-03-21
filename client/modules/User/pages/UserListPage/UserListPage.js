import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { FormattedMessage, FormattedDate } from 'react-intl';

// Import Components
import ReactTable from 'react-table';

// Import Actions
import { fetchUsersWithUserCount } from '../../UserActions';

// Import Selectors
import { getUsers } from '../../UserReducer';
import { getToken } from '../../../Auth/AuthReducer';

// Import Styles
import 'react-table/react-table.css';

// Import Cookies
import { Cookies, withCookies } from 'react-cookie';

class UserListPage extends Component {
  componentDidMount() {
    // TODO: Make sure we're not loading on the client side for no reason when page was SSR'ed
    const { cookies } = this.props;
    const token = cookies.get('sales-journal-token');
    this.props.dispatch(fetchUsersWithUserCount(token));
  }

  render() {
    const data = this.props.users;

    const columns = [{
      Header: 'Email',
      accessor: 'email',
    }, {
      Header: 'Entries',
      accessor: 'entries',
      defaultSortDesc: true,
    }, {
      Header: 'Last Login',
      accessor: 'lastLoginTime',
      defaultSortDesc: true,
      Cell: props => props.value ? <FormattedDate
                        value={new Date(props.value)}
                        year='2-digit'
                        month='numeric'
                        day='numeric'
                        hour='numeric'
                        minute='2-digit'
                        second='2-digit'
                      /> : 'N/A'
    }];

    return (
        <div>
          <ReactTable
            data={data}
            columns={columns}
            defaultPageSize={10}
            minRows={0}
            defaultSorted={[{
              id: 'entries',
              desc: true
            }]}
          />
        </div>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
UserListPage.need = [
  (params) => { return fetchUsersWithUserCount(params.token); }
];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    users: getUsers(state),
  };
}

UserListPage.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    entries: PropTypes.number,
    lastLoginTime: PropTypes.string,
  })).isRequired,
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  dispatch: PropTypes.func.isRequired,
};

UserListPage.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(withCookies(UserListPage));

import React, { Component } from 'react';
import {BrowserRouter, Switch, Route, NavLink} from 'react-router-dom'
import { List } from '../../components/List/List';
import { UserDetails } from '../../components/UserDetails/UserDetails';
import { UserListOption } from '../../components/UserListOption/UserListOption';
import { accessToken } from '../../constants';
import './UserPage.scss';
import {Loading} from "../../components/Loading/Loading";


const CN = 'user-page';

export class UserPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      usersList: [],
      selectedUserId: '',
      isLoading: false,
      error: ''
    };
  }

  componentDidMount() {
    this.loadUsers();
  }

  onUserSelect = (userId) => {
    this.setState({
      selectedUserId: userId
    });
  };

  loadUsers = () => {
    this.setState({
      isLoading: true
    });

    fetch(`https://gorest.co.in/public-api/users?access-token=${accessToken}`)
      .then(res => {
        if (!res.ok) throw Error(res.statusText);
        return res.json();
      })
      .then(data => {
        console.log(data);
        this.setState({
          usersList: data.result,
          isLoading: false
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          isLoading: false,
          error: 'error  happened'
        });
      });
  };

  render() {
    const { usersList, selectedUserId, isLoading, error } = this.state;
    const selectedUser = usersList.length && usersList.find(user => user.id === selectedUserId);

    return (
      <div className={CN}>
        {
          error && <div>{error}</div>
        }
        {
          isLoading && <Loading/>
        }

        {
          !isLoading && (
            <div className={`${CN}__content d-flex`}>
                <List
                  options={usersList}
                  onOptionSelect={this.onUserSelect}
                  selectedOptionId={selectedUserId}
                  itemRenderer={UserListOption}
                  className={`${CN}__user-list`}
                  title="All Users:"
                />
                <Switch>
                  <Route exact path="/details" render={() => <div>Click on user to see info about he/she</div>}/>
                  <Route exact path="/details/:id" render={(routerProps) =>
                      <UserDetails user={selectedUser} {...routerProps}/>}/>
                  {/*<UserDetails user={selectedUser}/>*/}
                </Switch>

            </div>
          )
        }

      </div>
    );
  }
}
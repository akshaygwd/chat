import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Row, Col, Button, Image } from 'react-bootstrap';
import { useMessageDispatch } from '../../context/message';
import { useMessageState } from '../../context/message';
import classNames from 'classnames';

const GET_USERS = gql `
  query getUsers{
    getUsers {
      username
      imageUrl
      email
      createdAt
      latestMessage {
        from
        uuid
        to
        content
        createdAt
      }
    }
  }
`;

export default function Users() {

  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find(u => u.selected == true)?.username;
  const { loading } = useQuery(GET_USERS, {
    onCompleted: data => dispatch({
      type: 'SET_USERS',
      payload: data.getUsers
    }),
    onError: err => console.log(err)
  });

  let userMarkup;
  if(!users || loading) {
    userMarkup = <p>Loading...</p>
  } else if (users.length === 0) {
    userMarkup = <p>No users have join yet</p>
  } else if (users.length > 0) {
    userMarkup = users.map((user) => {
      const selected = selectedUser === user.username;
      return (
        <div  role="button"
        className={classNames(" d-flex p-3 user-dev justify-content-center justify-content-md-start", {'bg-white': selected})}
        key={user.username} onClick={() => dispatch({type: 'SET_SELECTED_USER', payload: user.username})}>
        <Image
          src={user.imageUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
          className="user-image"/>
        <div className="d-none d-md-block ml-2">
          <p className="text-success">{user.username}</p>
          <p className="font-weight-light">
            {user.latestMessage ? user.latestMessage.content : 'You are now connected!'}
          </p>
        </div>
      </div>
      )
    })
  }

  return(
    <Col xs={2} md={4} className="user-box p-0 bg-secondary">
      {userMarkup}
    </Col>
  )
}
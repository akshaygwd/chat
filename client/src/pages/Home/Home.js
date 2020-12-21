import React, { useEffect } from 'react';
import { Row, Col, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuthDispatch, useAuthState } from '../../context/auth';
import { useMessageDispatch } from '../../context/message';
import { gql, useSubscription } from '@apollo/client';
import User from './User';
import Message from './Message';

const NEW_MESSAGE = gql`
  subscription newMessage{
    newMessage {
      from
      uuid
      to
      content
      createdAt
    }
  }
`;




function Home(props) {
  const { user } = useAuthState();
  const authDispatch = useAuthDispatch();
  const messageDispatch = useMessageDispatch();

  const { data: messageData, error: messageError } = useSubscription(NEW_MESSAGE);

  useEffect(() => {
    if(messageError) console.log(messageError);
    if(messageData) {
      const message = messageData.newMessage;
      const otherUser = user.username == message.to ? message.from: message.to;

      messageDispatch({type: 'ADD_MESSAGE', payload:
        {
          username: otherUser,
          message: messageData.newMessage
        }
      });
    }
  }, [messageData, messageError])

  const logout = () => {
    authDispatch({type: 'LOGOUT'});
    window.location.herf = '/login';
  }

  return (
    <>
    <Row className="bg-white justify-content-around mb-1">
      <Link to="/login">
        <Button varient="link">
          Login
        </Button>
      </Link>
      <Link to="/register">
        <Button varient="link">
          Register
        </Button>
      </Link>
      <Button onClick={logout} variant="link">
        Logout
      </Button>
    </Row>
    <Row className="bg-white">
      <User />
      <Message  />
    </Row>
    </>
  );
}

export default Home;
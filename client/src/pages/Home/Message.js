import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Image, Form } from 'react-bootstrap';
import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { useMessageDispatch } from '../../context/message';
import { useMessageState } from '../../context/message';
import Msg from './Msg';

const GET_MESSAGES = gql`
query getMessage($from: String!) {
  getMessage(from: $from) {
    from
    uuid
    to
    content
    createdAt
  }
}
`;

const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      from
      uuid
      to
      content
      createdAt
    }
  }
`;

export default function Message() {
  const [content, setContent] = useState('');
  const { users } = useMessageState();
  const dispatch  = useMessageDispatch();
  const selectedUser = users?.find(u => u.selected == true);
  const [getMessages, {loading: msgLoading, data:messageData}] = useLazyQuery(GET_MESSAGES);
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: err => console.log(err)
  });
  const messages = selectedUser?.messages;

  let selectedChatMAarkup
  if(!messages && !msgLoading) {
    selectedChatMAarkup = <p className="info-text">select a friend</p>;
  }else if(msgLoading) {
    selectedChatMAarkup = <p className="info-text">...loading</p>;
  }else if(messages.length > 0) {
    selectedChatMAarkup = messages.map((message, index) => (
      <>
        <Msg key={message.uuid} message={message}/>
        {index === messages.length - 1 && (
          <div className="invisible">
            <hr className="m-0" />
          </div>
        )}
      </>
    ))
  }else if(messages.length == 0) {
    selectedChatMAarkup = <p className="info-text">You are now connected</p>;
  }
  useEffect(() => {
    console.log(selectedUser, 'hit');
    if(selectedUser && !selectedUser.message) {
      getMessages({variables: {from: selectedUser.username}})
    }
  }, [selectedUser]);

  if(messageData) {
    console.log(messageData, 'hie');
  }

  useEffect(() => {
    if(messageData) {
      dispatch({type: 'SET_USER_MESSAGE', payload: {
        username: selectedUser.username,
        messages: messageData.getMessage
      }})
    }
  }, [messageData]);

  const submitMessage = e => {
    e.preventDefault();
    if(content.trim() == '' || !selectedUser) return;
    sendMessage({variables: {to: selectedUser.username, content: content}})
  }

  return (
    <Col xs={10} md={8} style={{height: '500px'}}>
      <div className="message-box d-flex flex-column-reverse">
        {
         selectedChatMAarkup
        }
      </div>
      <div>
        <Form onSubmit={submitMessage}>
          <Form.Group className="d-flex align-items-center">
            <Form.Control
              type="text"
              className="msg-input p-4 rounded-pill bg-secondary border-0"
              placeholder="Type a message.."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <i onClick={submitMessage}
            className="fas fa-paper-plane fa-2x text-primary ml-2" role="button"></i>
          </Form.Group>
        </Form>
      </div>
    </Col>
  )
}
import React from 'react';
import { useAuthState } from '../../context/auth';
import classNames from 'classnames';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment';

export default function Msg({message}) {
  const { user } = useAuthState();
  const sent = message.from == user.username;
  const recevied = !sent;
  return (
    <OverlayTrigger
      placement="left"
      placement={sent ? 'left': 'right'}
      overlay={
        <Tooltip>
          {moment(message.createdAt).format('MMMM DD, YYYY @ h:mm a')}
        </Tooltip>
      }
      >
      <div className={classNames('d-flex my-3', {
        'ml-auto': sent,
        'mr-auto': recevied
      })}>
        <div className={classNames('py-2 px-3 rounded-pill bg-primary',
          { 'bg-primary': sent, 'bg-secondary': recevied })}>
          <p className={classNames({'text-white': sent})}>{message.content}</p>
        </div>
      </div>
    </OverlayTrigger>
  )
}
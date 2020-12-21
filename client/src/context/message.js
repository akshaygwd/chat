import React, { createContext, useReducer, useContext } from 'react';
const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

const messageReducer = (state, action) => {
  let userCopy, userIndex;
  const { username, message, messages } = action.payload;
  switch(action.type) {
    case "SET_USERS":
        return {
            ...state,
            users: action.payload
        }
    case 'SET_USER_MESSAGE':
        userCopy = [...state.users];
        userIndex = userCopy.findIndex(u => u.username == username);
        userCopy[userIndex] = { ...userCopy[userIndex], messages }
        console.log(userCopy, 'userCopy');
        return {
          ...state,
          users: userCopy
        }

    case 'ADD_MESSAGE':
      userCopy = [...state.users];
      userIndex = userCopy.findIndex( u => u.username == username);

      let newUser = {
        ...userCopy[userIndex],
        messages: userCopy[userIndex].messages ? [message, ...userCopy[userIndex].messages] : null,
        latestMessage: message,
      }

      userCopy[userIndex] = newUser;
      console.log(userCopy, 'updated');

      return {
        ...state,
        users: userCopy
      }

    case 'SET_SELECTED_USER':
      userCopy = state.users.map((user) => {
        return {
          ...user,
          selected: user.username === action.payload
        }
      })
      return {
        ...state,
        users: userCopy
      }
    default:
      return state;
  }
}

export const MessageProvider = (props) => {
  const [state, dispatch] = useReducer(messageReducer, {users: null});
  return(
    <MessageDispatchContext.Provider value={dispatch}>
      <MessageStateContext.Provider value={state}>
        {props.children}
      </MessageStateContext.Provider>
    </MessageDispatchContext.Provider>
  )
}

export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = () => useContext(MessageDispatchContext);
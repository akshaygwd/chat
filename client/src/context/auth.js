import React, { createContext, useReducer, useContext } from 'react';
import jwtDecode from 'jwt-decode';
const AuthStateContext = createContext();
const AuthDispatchContext = createContext();


const token = localStorage.getItem('token');
let user = null;
if(token) {
  const decodedToken = jwtDecode(token);
  console.log(decodedToken);
  const expiresAt = new Date (decodedToken.exp * 1000);
  if(new Date() > expiresAt) {
    localStorage.removeItem('token');
  } else{
    user = decodedToken;
  }
}

const authReducer = (state, action) => {
  switch(action.type) {
    case 'LOGIN':
    localStorage.setItem('token', action.payload.token);
    return {
      ...state,
      user: action.payload
    }
    case 'LOGOUT':
    localStorage.removeItem('token');
    return {
      ...state,
      user: null
    }
    default:
      return state;
  }
}

export const AuthProvider = (props) => {
  const [state, dispatch] = useReducer(authReducer, {user: user});
  return(
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {props.children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  )
}

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
import React from 'react';
import './App.scss';
import { Container } from 'react-bootstrap';
import ApolloProvider from './ApolloProvider';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home/Home';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AuthProvider } from './context/auth';
import { MessageProvider } from './context/message';
import DynamicRoute from './util/DynamicRoutes';

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <BrowserRouter>
            <Container className="pt-5">
              <Switch>
                <DynamicRoute path="/" exact component={Home} authenticated />
                <DynamicRoute path="/register" component={Register} guest/>
                <DynamicRoute path="/login" component={Login} guest/>
              </Switch>
            </Container>
          </BrowserRouter>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;

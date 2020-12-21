import React, {useState} from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { gql, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
      email
      createdAt
    }
  }`;

function Register (props) {

  const [variables, setVariables] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  const [ errors, setErrors ] = useState({});

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, res) {
      props.history.push('/login');
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    }
  });

  const submitRegisterForm = (e) => {
    e.preventDefault();
    console.log(variables);
    registerUser({variables})
  }

  return (
    <Row className="bg-white py-5 justify-content-center">
    <Col sm={8} md={6} lg={4}>
      <h1 className="text-center">Register</h1>
        <Form onSubmit={submitRegisterForm}>
          <Form.Group>
            <Form.Label className={errors.email && 'text-danger'}>
              {errors.email ?? 'Email address'}
            </Form.Label>
            <Form.Control
              type="email"
              className={errors.email && 'is-invalid'}
              value={variables.email}
              onChange={(e) => setVariables({...variables, email: e.target.value})}/>
          </Form.Group>
          <Form.Group>
            <Form.Label className={errors.username && 'text-danger'}>
              { errors.username ?? 'Username' }
            </Form.Label>
            <Form.Control
              type="text"
              className={errors.username && 'is-invalid'}
              value={variables.username}
              onChange={(e) => setVariables({...variables, username: e.target.value})}
            />
          </Form.Group>
          <Form.Group>
          <Form.Label className={errors.password && 'text-danger'}>
              { errors.password ?? 'Password' }
            </Form.Label>
            <Form.Control
              type="password"
              className={errors.password && 'is-invalid'}
              value={variables.password}
              onChange={(e) => setVariables({...variables, password: e.target.value})}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>confirm Email password</Form.Label>
            <Form.Control
              type="password"
              value={variables.confirmPassword}
              onChange={(e) => setVariables({...variables, confirmPassword: e.target.value})}
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              Register
            </Button>
            <small>
              <p>Already have an account ?</p>
              <Link to="/login">Login</Link>
            </small>
          </div>
        </Form>
    </Col>
  </Row>
  )
}

export default Register;
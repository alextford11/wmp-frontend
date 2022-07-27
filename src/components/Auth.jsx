import {useNavigate} from 'react-router-dom';
import {handleErrorMessage, handleErrors} from '../utils';
import {Button, Col, Container, Row} from 'react-bootstrap';
import {FullInput} from './FormWidgets';
import React, {useEffect} from 'react';

function storeAccessToken(accessToken) {
  localStorage.setItem(process.env.REACT_APP_ACCESS_TOKEN_KEY, accessToken)
}

export function LoginForm() {
  const navigate = useNavigate()

  function handleOnSubmitLogin(e) {
    e.preventDefault()
    const form = e.target
    const elements = form.elements
    const formData = {
      username: elements.id_email.value,
      password: elements.id_password.value,
      grant_type: 'password',
      scope: null,
      client_id: null,
      client_secret: null
    }
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/login/`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(formData).toString()
    })
      .then(handleErrors)
      .then(data => {
        const accessToken = data['access_token']
        storeAccessToken(accessToken)
        navigate('/')
        window.location.reload()
      })
      .catch(error => {
        handleErrorMessage(error, form)
      })
  }

  return (
    <Container>
      <h1 className="text-center">Login</h1>
      <Row>
        <Col md={6} className="mx-auto">
          <form onSubmit={handleOnSubmitLogin}>
            <div className="mb-3">
              <FullInput label="Email" type="email" inputOptions={{id: 'id_email'}}/>
            </div>
            <div className="mb-3">
              <FullInput label="Password" type="password" inputOptions={{id: 'id_password'}}/>
            </div>
            <div className="text-center">
              <Button type="submit">Login</Button>
            </div>
          </form>
        </Col>
      </Row>
    </Container>
  )
}

export function SignUpForm() {
  const navigate = useNavigate()

  function handleOnSubmitSignUp(e) {
    e.preventDefault()
    const form = e.target
    const elements = form.elements
    const formData = {
      first_name: elements.id_first_name.value,
      last_name: elements.id_last_name.value,
      email: elements.id_email.value,
      password: elements.id_password.value
    }
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/signup/`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {'Content-Type': 'application/json'}
    })
      .then(handleErrors)
      .then(data => {
        const accessToken = data['access_token']
        storeAccessToken(accessToken)
        navigate('/')
        window.location.reload()
      })
      .catch(error => {
        handleErrorMessage(error, form)
      })
  }

  return (
    <Container>
      <h1 className="text-center">Create account</h1>
      <Row>
        <Col md={6} className="mx-auto">
          <form onSubmit={handleOnSubmitSignUp}>
            <div className="mb-3">
              <FullInput label="First Name" type="text" inputOptions={{id: 'id_first_name'}}/>
            </div>
            <div className="mb-3">
              <FullInput label="Last Name" type="text" inputOptions={{id: 'id_last_name'}}/>
            </div>
            <div className="mb-3">
              <FullInput label="Email" type="email" inputOptions={{id: 'id_email'}}/>
            </div>
            <div className="mb-3">
              <FullInput label="Password" type="password" inputOptions={{id: 'id_password'}}/>
            </div>
            <div className="text-center">
              <Button type="submit">Create account</Button>
            </div>
          </form>
        </Col>
      </Row>
    </Container>
  )
}

export function Logout() {
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.removeItem(process.env.REACT_APP_ACCESS_TOKEN_KEY)
    localStorage.removeItem(process.env.REACT_APP_USER_PROFILE_DATA_KEY)
    navigate('/')
    window.location.reload()
  })
  return <></>
}

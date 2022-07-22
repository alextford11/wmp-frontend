import React from 'react';

import {Button, Col, Container, Row} from 'react-bootstrap';
import {FullInput} from './FormWidgets';
import {useNavigate} from 'react-router-dom';
import {handleErrors} from '../utils';

export default function SignUpForm() {
  const navigate = useNavigate()

  function handleOnSubmitSignUp(e) {
    e.preventDefault()
    const form = e.target
    const elements = form.elements
    const form_data = {
      first_name: elements.id_first_name.value,
      last_name: elements.id_last_name.value,
      email: elements.id_email.value,
      password: elements.id_password.value
    }
    console.log(form_data, JSON.stringify(form_data))
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/signup/`, {
      method: 'POST',
      body: JSON.stringify(form_data),
      headers: {'Content-Type': 'application/json'}
    })
      .then(handleErrors)
      .then(data => {
        console.log(data)
        navigate('/')
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
              <Button type="submit" id="signup_submit">Create account</Button>
            </div>
          </form>
        </Col>
      </Row>
    </Container>
  )
}

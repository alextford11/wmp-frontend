import React from 'react';

import {Button, Col, Container, Row} from 'react-bootstrap';
import {FullInput} from './FormWidgets';

export default class SignUpForm extends React.Component {
  render() {
    return (
      <Container>
        <h1 className="text-center">Create account</h1>
        <Row>
          <Col md={6} className="mx-auto">
            <form>
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
}

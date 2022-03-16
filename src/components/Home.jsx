import React from 'react';
import {Button, Container} from 'react-bootstrap';

export default class Home extends React.Component {
  render() {
    return (
      <Container className="text-center">
        <h1>Create your workout</h1>
        <Button variant="primary" href="/board/">Create Workout Plan</Button>
      </Container>
    )
  }
}

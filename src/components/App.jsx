import React from 'react';
import Board from './Board';
import {Container, Row, Col} from 'react-bootstrap';

export default class App extends React.Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <Col lg={8} className={'mx-auto'}>
            <Board/>
          </Col>
        </Row>
      </Container>
    );
  }
}

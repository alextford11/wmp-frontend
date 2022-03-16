import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Home';
import BoardComponentWrapper from './Board';


export default class App extends React.Component {
  render() {
    return (
      <Router>
        <Container fluid>
          <Row>
            <Col lg={8} className={'mx-auto'}>
              <Row>
                <Col lg={8}>
                  <Routes>
                    <Route index element={<Home/>}/>
                    <Route path="board" element={<BoardComponentWrapper/>}>
                      <Route path=":boardId" element={<BoardComponentWrapper/>}/>
                    </Route>
                  </Routes>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </Router>
    );
  }
}

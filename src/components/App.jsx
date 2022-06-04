import React from 'react';
import {Container, Row, Col, Navbar, Nav} from 'react-bootstrap';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Home';
import BoardComponentWrapper from './Board';
import SignUpForm from './SignUp';
import '../styles/App.scss';


class GlobalNavbar extends React.Component {
  render() {
    return (
      <Navbar>
        <Container>
          <Navbar.Brand href="/">Workout Planner</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link href="/signup/">Sign Up</Nav.Link>
            <Nav.Link href="/login/">Login</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    )
  }
}


export default class App extends React.Component {
  render() {
    return (
      <Router>
        <GlobalNavbar/>
        <Container fluid>
          <Row>
            <Col lg={8} className={'mx-auto'}>
              <Routes>
                <Route index element={<Home/>}/>
                <Route path="board" element={<BoardComponentWrapper/>}>
                  <Route path=":boardId" element={<BoardComponentWrapper/>}/>
                </Route>
                <Route path="signup" element={<SignUpForm/>}/>
              </Routes>
            </Col>
          </Row>
        </Container>
      </Router>
    );
  }
}

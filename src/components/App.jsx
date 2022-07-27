import React, {useState} from 'react';
import {Container, Row, Col, Navbar, Nav} from 'react-bootstrap';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Home';
import Board from './Board';
import '../styles/App.scss';
import PropTypes from 'prop-types';
import {handleErrors} from '../utils';
import {LoginForm, Logout, SignUpForm} from './Auth';

function GlobalNavbar(props) {
  return (
    <Navbar>
      <Container>
        <Navbar.Brand href="/">Workout Planner</Navbar.Brand>
        <Nav className="ms-auto">
          {
            props.userLoggedIn ? (
              <Nav.Link href="/logout/">Logout</Nav.Link>
            ) : (
              <>
                <Nav.Link href="/signup/">Sign Up</Nav.Link>
                <Nav.Link href="/login/">Login</Nav.Link>
              </>
            )
          }
        </Nav>
      </Container>
    </Navbar>
  )
}

GlobalNavbar.propTypes = {
  userLoggedIn: PropTypes.bool
}


export default function App() {
  const [user, setUser] = useState({})
  const userAccessToken = localStorage.getItem(process.env.REACT_APP_ACCESS_TOKEN_KEY)
  const userProfileData = localStorage.getItem(process.env.REACT_APP_USER_PROFILE_DATA_KEY) || null

  function setUserData() {
    if (!Object.keys(user).length > 0) {
      if (userProfileData) {
        setUser(userProfileData)
        return
      }

      if (userAccessToken) {
        fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/user/profile/`, {
          headers: {'Authorization': 'Bearer ' + userAccessToken}
        })
          .then(handleErrors)
          .then(data => {
            localStorage.setItem(process.env.REACT_APP_USER_PROFILE_DATA_KEY, data)
            setUser(data)
          })
      }
    }
  }

  setUserData()
  return (
    <Router forceRefresh={true}>
      <GlobalNavbar userLoggedIn={Object.keys(user).length > 0}/>
      <Container fluid>
        <Row>
          <Col lg={8} className={'mx-auto'}>
            <Routes>
              <Route index element={<Home/>}/>
              <Route path="board" element={<Board/>}>
                <Route path=":boardId" element={<Board/>}/>
              </Route>
              <Route path="login" element={<LoginForm/>}/>
              <Route path="signup" element={<SignUpForm/>}/>
              <Route path="logout" element={<Logout/>}/>
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

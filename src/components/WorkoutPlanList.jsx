import {Col, Container, ListGroup, Row} from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import {handleErrors} from '../utils';
import PropTypes from 'prop-types';

export default function WorkoutPlanList(props) {
  const [boards, setBoards] = useState([])
  const [boardsLoaded, setBoardsLoaded] = useState(false)

  useEffect(() => {
    if (!boardsLoaded) {
      fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/user/boards/`, {
        headers: {'Authorization': 'Bearer ' + props.userAccessToken}
      })
        .then(handleErrors)
        .then(data => {
          setBoards(data['boards'])
          setBoardsLoaded(true)
        })
    }
  })

  return (
    <Container>
      <h1>Your Workout Plans</h1>
      <Row>
        <Col>
          <ListGroup variant="flush">
            {
              boards.map((board, index) => {
                return (
                  <ListGroup.Item className="py-4" key={index}>
                    <a href={`/board/${board.id}/`}>Board - {board.id}</a>
                    <p className="text-muted small mb-0">Created 2 weeks ago</p>
                  </ListGroup.Item>
                )
              })
            }
          </ListGroup>
        </Col>
      </Row>
    </Container>
  )
}

WorkoutPlanList.propTypes = {
  userAccessToken: PropTypes.string
}

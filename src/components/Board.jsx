import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Row} from 'react-bootstrap';

import '../styles/Board.scss'
import WorkoutList from './WorkoutList';
import PropTypes from 'prop-types';
import {useNavigate, useParams} from 'react-router-dom';
import {handleErrors} from '../utils';
import {SelectInputWidget} from './FormWidgets';
import {ErrorBoundary} from './ErrorHandling';

function Title() {
  return (
    <div className="plan-title">
      <h2 className="text-center">Workout Plan</h2>
    </div>
  )
}

function AddWorkoutInput(props) {
  const [addBtnDisabled, setAddBtnDisabled] = useState(true)
  const [selectedWorkout, setSelectedWorkout] = useState(null)

  function handleOnSelectChange(option) {
    setSelectedWorkout(option)
    setAddBtnDisabled(!option)
  }

  function handleOnFormSubmit(e) {
    e.preventDefault()
    const request_data = {
      method: 'POST',
      body: JSON.stringify({'workout_id': selectedWorkout.value}),
      headers: {'Content-Type': 'application/json'}
    }
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/board/${props.boardId}/workout/`, request_data)
      .then(handleErrors)
      .then(() => {
        setSelectedWorkout(null)
        props.updateBoard()
      })
  }

  return (
    <Form onSubmit={handleOnFormSubmit} className="mb-3">
      <Row>
        <Col>
          <SelectInputWidget
            id="id_select_workout"
            optionsUrl={process.env.REACT_APP_BACKEND_BASE_URL + '/workouts/list/grouped/'}
            placeholder="Select a workout..."
            handleOnSelectChange={handleOnSelectChange}
            isClearable={true}/>
        </Col>
        <Col sm="auto">
          <Button variant="primary" type="submit" className="w-100 mt-2 mt-sm-0" disabled={addBtnDisabled}>
            Add
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

AddWorkoutInput.propTypes = {
  boardId: PropTypes.number,
  updateBoard: PropTypes.func
}

function WorkoutStats(props) {
  const muscle_counts = props.board.board_muscle_counts
  return (
    <Card className="mb-3 mb-sm-0">
      <Card.Title className="text-center">Workout Stats</Card.Title>
      <Card.Body>
        {
          muscle_counts ?
            Object.entries(muscle_counts).map(([muscle_name, count]) => (
              <div key={muscle_name}>
                <span className="fw-bold">{muscle_name}</span>
                <span className="float-end">{count}</span>
              </div>
            )) : null
        }
      </Card.Body>
    </Card>
  )
}

WorkoutStats.propTypes = {
  board: PropTypes.object
}

export default function Board(props) {
  const [boardId, setBoardId] = useState(Number(useParams().boardId))
  const [board, setBoard] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoaded) {
      if (boardId) {
        getBoardWithId()
      } else {
        fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/board/create/`, {
          method: 'POST',
          body: JSON.stringify({user_access_token: props.userAccessToken ? props.userAccessToken : null}),
          headers: {'Content-Type': 'application/json'}
        })
          .then(response => response.json())
          .then(data => {
            setBoardId(data.id)
            navigate(`/board/${data.id}/`)
          })
      }
    }
  })

  function getBoardWithId() {
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/board/${boardId}/`)
      .then(handleErrors)
      .then(data => {
        setBoardId(data.id)
        setBoard(data)
        setIsLoaded(true)
      })
  }

  function handleOnDragEnd(result) {
    if (!result.destination) {
      return
    }

    if (result.source.index === result.destination.index) {
      return
    }

    const workoutOrder = Array.from(board.board_workout_order)
    workoutOrder.splice(result.source.index, 1)
    workoutOrder.splice(result.destination.index, 0, Number(result.draggableId))
    setBoard({
      ...board, board_workout_order: workoutOrder,
    })

    const reorder_data = {workout_order: workoutOrder}
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/board/${boardId}/update_order/`, {
      method: 'POST', body: JSON.stringify(reorder_data), headers: {'Content-Type': 'application/json'}
    })
      .then(handleErrors)
  }

  function removeBoardWorkout(boardWorkoutId) {
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/board/${boardId}/workout/${boardWorkoutId}/`, {
      method: 'DELETE', headers: {'Content-Type': 'application/json'}
    })
      .then(handleErrors)
      .then(() => {
        updateBoard()
      })
  }

  function updateBoardWorkoutDetails(boardWorkoutId, data) {
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/board/${boardId}/workout/${boardWorkoutId}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
    })
      .then(handleErrors)
      .then(() => {
        updateBoard()
      })
  }

  function updateBoard() {
    getBoardWithId()
  }

  const workoutListProps = isLoaded ? {
    boardId: boardId,
    boardWorkoutOrder: board.board_workout_order,
    boardWorkouts: board.board_workouts,
    handleOnDragEnd: handleOnDragEnd,
    removeBoardWorkout: removeBoardWorkout,
    updateBoardWorkoutDetails: updateBoardWorkoutDetails
  } : {}
  return (
    <Row>
      <Col>
        <Row>
          <Col sm={8}>
            <Title/>
            <ErrorBoundary>
              <AddWorkoutInput boardId={boardId} updateBoard={updateBoard}/>
            </ErrorBoundary>
          </Col>
        </Row>
        <Row>
          <Col xs={{order: 'last'}} sm={{span: 8, order: 'first'}}>
            <ErrorBoundary>
              {isLoaded ? <WorkoutList {...workoutListProps}/> : <div>Loading...</div>}
            </ErrorBoundary>
          </Col>
          <Col xs={{order: 'first'}} sm={{span: 4, order: 'last'}}>
            <ErrorBoundary>
              <WorkoutStats board={board}/>
            </ErrorBoundary>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

Board.propTypes = {
  userAccessToken: PropTypes.string
}

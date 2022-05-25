import React from 'react';
import {Button, Card, Col, Form, Row} from 'react-bootstrap';

import '../styles/Board.scss'
import WorkoutList from './WorkoutList';
import PropTypes from 'prop-types';
import {useNavigate, useParams} from 'react-router-dom';
import {handleErrors} from '../utils';
import {SelectInputWidget} from './FormWidgets';

export default function BoardComponentWrapper() {
  const {boardId} = useParams()
  const navigate = useNavigate()
  return <Board boardId={boardId} navigate={navigate}/>
}

class Title extends React.Component {
  render() {
    return (
      <div className="plan-title">
        <h2 className="text-center">Workout Plan</h2>
      </div>
    )
  }
}

class AddWorkoutInput extends React.Component {
  static propTypes = {
    boardId: PropTypes.number,
    updateBoard: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      workoutOptions: [], addBtnDisabled: true, selectedWorkout: null
    }
    this.handleOnSelectChange = this.handleOnSelectChange.bind(this)
    this.handleOnFormSubmit = this.handleOnFormSubmit.bind(this)
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/workouts/list/grouped/`)
      .then(handleErrors)
      .then(data => {
        console.log(data)
        this.setState({
          workoutOptions: data
        })
      })
  }

  handleOnSelectChange(option) {
    this.setState({selectedWorkout: option, addBtnDisabled: !option})
  }

  handleOnFormSubmit(e) {
    e.preventDefault()
    const request_data = {
      method: 'POST',
      body: JSON.stringify({'workout_id': this.state.selectedWorkout.value}),
      headers: {'Content-Type': 'application/json'}
    }
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/board/${this.props.boardId}/workout/`, request_data)
      .then(handleErrors)
      .then(() => {
        this.setState({selectedWorkout: null})
        this.props.updateBoard()
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    return (
      <Form onSubmit={this.handleOnFormSubmit} className="mb-3">
        <Row>
          <Col>
            <SelectInputWidget
              optionsUrl={process.env.REACT_APP_BACKEND_BASE_URL + '/workouts/list/grouped/'}
              placeholder="Select a workout..."
              handleOnSelectChange={this.handleOnSelectChange}
              isClearable={true}/>
          </Col>
          <Col sm="auto">
            <Button variant="primary" type="submit" className="w-100 mt-2 mt-sm-0" disabled={this.state.addBtnDisabled}>
              Add
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

class WorkoutStats extends React.Component {
  static propTypes = {
    board: PropTypes.object
  }

  render() {
    const muscle_counts = this.props.board.board_muscle_counts
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
              )) : ''
          }
        </Card.Body>
      </Card>
    )
  }
}

export class Board extends React.Component {
  static propTypes = {
    boardId: PropTypes.string, navigate: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      boardId: Number(props.boardId), board: {}, isLoaded: false
    }
    this.handleOnDragEnd = this.handleOnDragEnd.bind(this)
    this.updateBoard = this.updateBoard.bind(this)
    this.getBoardWithId = this.getBoardWithId.bind(this)
    this.removeBoardWorkout = this.removeBoardWorkout.bind(this)
    this.updateBoardWorkoutDetails = this.updateBoardWorkoutDetails.bind(this)
  }

  componentDidMount() {
    if (this.state.boardId) {
      this.getBoardWithId()
    } else {
      fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/board/create/`, {method: 'POST'})
        .then(response => response.json())
        .then(data => {
          this.props.navigate(`/board/${data.id}/`)
          this.setState({boardId: data.id})
          this.getBoardWithId()
        })
    }
  }

  getBoardWithId() {
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/board/${this.state.boardId}/`)
      .then(handleErrors)
      .then(data => {
        this.setState({
          boardId: data.id, board: data, isLoaded: true
        })
      })
  }

  handleOnDragEnd(result) {
    if (!result.destination) {
      return
    }

    if (result.source.index === result.destination.index) {
      return
    }

    const workoutOrder = Array.from(this.state.board.board_workout_order)
    workoutOrder.splice(result.source.index, 1)
    workoutOrder.splice(result.destination.index, 0, Number(result.draggableId))
    this.setState({
      board: {
        ...this.state.board, board_workout_order: workoutOrder,
      }
    })

    const reorder_data = {workout_order: workoutOrder}
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/board/${this.state.boardId}/update_order/`, {
      method: 'POST', body: JSON.stringify(reorder_data), headers: {'Content-Type': 'application/json'}
    })
      .then(handleErrors)
  }

  removeBoardWorkout(boardWorkoutId) {
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/board/${this.props.boardId}/workout/${boardWorkoutId}/`, {
      method: 'DELETE', headers: {'Content-Type': 'application/json'}
    })
      .then(handleErrors)
      .then(() => {
        this.updateBoard()
      })
  }

  updateBoardWorkoutDetails(boardWorkoutId, data) {
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/board/${this.props.boardId}/workout/${boardWorkoutId}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
    })
      .then(handleErrors)
      .then(() => {
        this.updateBoard()
      })
  }

  updateBoard() {
    this.getBoardWithId()
    this.forceUpdate()
  }

  render() {
    const workoutListProps = this.state.isLoaded ? {
      boardId: this.state.boardId,
      boardWorkoutOrder: this.state.board.board_workout_order,
      boardWorkouts: this.state.board.board_workouts,
      handleOnDragEnd: this.handleOnDragEnd,
      removeBoardWorkout: this.removeBoardWorkout,
      updateBoardWorkoutDetails: this.updateBoardWorkoutDetails
    } : {}
    return (
      <Row>
        <Col>
          <Row>
            <Col sm={8}>
              <Title/>
              <AddWorkoutInput boardId={this.state.boardId} updateBoard={this.updateBoard}/>
            </Col>
          </Row>
          <Row>
            <Col xs={{order: 'last'}} sm={{span: 8, order: 'first'}}>
              {this.state.isLoaded ? <WorkoutList {...workoutListProps}/> : <div>Loading...</div>}
            </Col>
            <Col xs={{order: 'first'}} sm={{span: 4, order: 'last'}}>
              <WorkoutStats board={this.state.board}/>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

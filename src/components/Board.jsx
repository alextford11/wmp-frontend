import React from 'react';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';

import '../styles/Board.scss'
import WorkoutList from './WorkoutList';
import PropTypes from 'prop-types';
import {useNavigate, useParams} from 'react-router-dom';
import {handleErrors} from '../utils';
import Select from 'react-select';

export default function BoardComponentWrapper() {
  const {boardId} = useParams()
  const navigate = useNavigate()
  return <Board boardId={boardId} navigate={navigate}/>
}

class Title extends React.Component {
  render() {
    return (
      <h2 className={'text-center'}>Workout Plan</h2>
    );
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
      workoutOptions: [],
      isLoaded: false,
      addBtnDisabled: true,
      selectedWorkout: null
    }
    this.handleOnSelectChange = this.handleOnSelectChange.bind(this)
    this.handleOnFormSubmit = this.handleOnFormSubmit.bind(this)
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/workouts/list/`)
      .then(handleErrors)
      .then(data => {
        function str_compare(a, b) {
          if (a.label < b.label) {
            return -1;
          }
          if (a.label > b.label) {
            return 1;
          }
          return 0;
        }

        let workoutOptions = data['workouts'].map(workout => {
          return {value: workout.id, label: workout.name}
        }).sort(str_compare)
        this.setState({
          workoutOptions: workoutOptions,
          isLoaded: true
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
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/board/${this.props.boardId}/add_workout/`, request_data)
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
            <Select
              value={this.state.selectedWorkout}
              options={this.state.workoutOptions}
              isClearable={true}
              onChange={this.handleOnSelectChange}/>
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

export class Board extends React.Component {
  static propTypes = {
    boardId: PropTypes.string,
    navigate: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      boardId: Number(props.boardId),
      board: {},
      isLoaded: false
    }
    this.handleOnDragEnd = this.handleOnDragEnd.bind(this)
    this.updateBoard = this.updateBoard.bind(this)
    this.getBoardWithId = this.getBoardWithId.bind(this)
  }

  componentDidMount() {
    if (this.state.boardId) {
      this.getBoardWithId()
    } else {
      fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/board/create/`, {method: 'POST'})
        .then(response => response.json())
        .then(data => {
          this.props.navigate(`/board/${data.id}/`)
          this.setState({
            boardId: data.id,
            board: data,
            isLoaded: true
          })
        })
    }
  }

  getBoardWithId() {
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/board/${this.state.boardId}/`)
      .then(handleErrors)
      .then(data => {
        this.setState({
          boardId: data.id,
          board: data,
          isLoaded: true
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
        ...this.state.board,
        board_workout_order: workoutOrder,
      }
    })
  }

  updateBoard() {
    this.getBoardWithId()
    this.forceUpdate()
  }

  render() {
    const workoutListProps = this.state.isLoaded ? {
      boardWorkoutOrder: this.state.board.board_workout_order,
      boardWorkouts: this.state.board.board_workouts,
      handleOnDragEnd: this.handleOnDragEnd
    } : {}
    return (
      <Container>
        <Title/>
        <AddWorkoutInput boardId={this.state.boardId} updateBoard={this.updateBoard}/>
        {
          this.state.isLoaded ?
            <WorkoutList {...workoutListProps}/> :
            <div>Loading...</div>
        }
      </Container>
    )
  }
}

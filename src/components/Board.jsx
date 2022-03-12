import React from 'react';
import {Container} from 'react-bootstrap';

import '../styles/Board.scss'
import WorkoutList from './WorkoutList';
import PropTypes from 'prop-types';
import {useNavigate, useParams} from 'react-router-dom';

export default function BoardComponentWrapper() {
  const {boardId} = useParams()
  const navigate = useNavigate()
  return <Board boardId={boardId} navigate={navigate} />
}

class Title extends React.Component {
  render() {
    return (
      <h2 className={'text-center'}>Workout Plan</h2>
    );
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
      boardId: props.boardId,
      board: {},
      isLoaded: false
    }
    this.handleOnDragEnd = this.handleOnDragEnd.bind(this)
  }

  componentDidMount() {
    if (this.props.boardId) {
      fetch(`http://localhost:8000/board/${this.state.boardId}/`)
        .then(response => response.json())
        .then(data => {
          this.setState({
            board: data,
            isLoaded: true
          })
        })
    } else {
      fetch('http://localhost:8000/board/create/', {method: 'POST'})
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

  handleOnDragEnd(result) {
    if (!result.destination) {
      return
    }

    if (result.source.index === result.destination.index) {
      return
    }

    const workoutOrder = Array.from(this.state.board.board_workout_order)
    workoutOrder.splice(result.source.index, 1)
    workoutOrder.splice(result.destination.index, 0, result.draggableId)
    this.setState({
      board: {
        ...this.state.board,
        board_workout_order: workoutOrder,
      }
    })
  }

  render() {
    const workoutListProps = this.state.isLoaded ? {
      board_workout_order: this.state.board.board_workout_order,
      board_workouts: this.state.board.board_workouts,
      handleOnDragEnd: this.handleOnDragEnd
    } : {}
    return (
      <Container>
        <Title/>
        {
          this.state.isLoaded ?
            <WorkoutList {...workoutListProps}/> :
            <div>Loading...</div>
        }
      </Container>
    )
  }
}

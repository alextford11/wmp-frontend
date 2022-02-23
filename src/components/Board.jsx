import React from 'react';
import {Container} from 'react-bootstrap';

import '../styles/Board.scss'
import WorkoutList from './WorkoutList';

class Title extends React.Component {
  render() {
    return (
      <h2 className={'text-center'}>Workout Plan</h2>
    );
  }
}

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: {},
      isLoaded: false
    }
    this.handleOnDragEnd = this.handleOnDragEnd.bind(this)
  }

  componentDidMount() {
    fetch('http://localhost:8000/board')
      .then(response => response.json())
      .then(data => {
        this.setState({
          board: data.board,
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

    const workoutOrder = Array.from(this.state.board.workout_order)
    workoutOrder.splice(result.source.index, 1)
    workoutOrder.splice(result.destination.index, 0, result.draggableId)
    this.setState({
      board: {
        ...this.state.board,
        workout_order: workoutOrder,
      }
    })
  }

  render() {
    const workoutListProps = {
      workout_order: this.state.board.workout_order,
      workouts: this.state.board.workouts,
      handleOnDragEnd: this.handleOnDragEnd
    }
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

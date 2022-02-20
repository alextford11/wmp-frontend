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
      setBoard: {},
      isLoaded: false
    }
  }

  componentDidMount() {
    fetch('http://localhost:8000/board')
      .then(response => response.json())
      .then(data => {
        this.setState({
          setBoard: data.board,
          isLoaded: true
        })
      })
  }

  render() {
    console.log(this.state)
    return (
      <Container>
        <Title/>
        {
          this.state.isLoaded ?
            <WorkoutList workout_order={this.state.setBoard.workout_order} workouts={this.state.setBoard.workouts}/>:
            <div>Loading...</div>
        }
      </Container>
    )
  }
}

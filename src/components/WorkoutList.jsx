import React from 'react';
import {Container} from 'react-bootstrap';
import WorkoutItem from './WorkoutItem';
import PropTypes from 'prop-types';

export default class WorkoutList extends React.Component {
  render() {
    return (
      <Container>
        {
          this.props.workout_order.map(workout_id => (
            <WorkoutItem key={workout_id} workout={this.props.workouts[workout_id]}/>
          ))
        }
      </Container>
    )
  }
}

WorkoutList.propTypes = {
  workouts: PropTypes.object,
  workout_order: PropTypes.array
}

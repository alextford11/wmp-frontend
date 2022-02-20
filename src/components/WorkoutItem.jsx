import React from 'react';
import PropTypes from 'prop-types';
import {Badge, Container} from 'react-bootstrap';

export default class WorkoutItem extends React.Component {
  render() {
    const workout = this.props.workout
    const muscles = Object.values(workout.muscles)
    return (
      <Container>
        <h3>{workout.title}</h3>
        {
          muscles.map(muscle => (
            <Badge key={muscle.id} className='me-3'>{muscle.name}</Badge>
          ))
        }
      </Container>
    )
  }
}

WorkoutItem.propTypes = {
  workout: PropTypes.object
}

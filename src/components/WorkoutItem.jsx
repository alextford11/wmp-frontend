import React from 'react';
import PropTypes from 'prop-types';
import {Badge, Card} from 'react-bootstrap';
import {Draggable} from 'react-beautiful-dnd';

export default class WorkoutItem extends React.Component {
  static propTypes = {
    workout: PropTypes.object,
    index: PropTypes.number
  }

  render() {
    const workout = this.props.workout
    const muscles = Object.values(workout.muscles)
    return (
      <Draggable key={workout.id} draggableId={workout.id} index={this.props.index}>
        {
          (provided) => (
            <Card className="mb-3" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
              <Card.Body>
                <Card.Title>{workout.title}</Card.Title>
                {
                  muscles.map(muscle => (
                    <Badge key={muscle.id} className="me-3">{muscle.name}</Badge>
                  ))
                }
              </Card.Body>
            </Card>
          )
        }
      </Draggable>
    )
  }
}

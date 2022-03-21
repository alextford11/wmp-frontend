import React from 'react';
import PropTypes from 'prop-types';
import {Badge, Card} from 'react-bootstrap';
import {Draggable} from 'react-beautiful-dnd';

export default class WorkoutItem extends React.Component {
  static propTypes = {
    boardWorkout: PropTypes.object,
    index: PropTypes.number
  }

  removeWorkout() {

  }

  render() {
    if (this.props.boardWorkout === undefined) {
      return
    }
    const workout = this.props.boardWorkout.workout
    return (
      <Draggable
        key={this.props.boardWorkout.id}
        draggableId={String(this.props.boardWorkout.id)}
        index={this.props.index}>
        {
          (provided) => (
            <Card className="mb-3" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
              <Card.Body>
                <Card.Title>
                  {workout.name}
                  <span className="fa-solid fa-xmark float-end"/>
                </Card.Title>
                {
                  workout.related_muscles.map(muscle => (
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

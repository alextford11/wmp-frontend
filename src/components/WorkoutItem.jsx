import React from 'react';
import PropTypes from 'prop-types';
import {Badge, Card} from 'react-bootstrap';
import {Draggable} from 'react-beautiful-dnd';

export default class WorkoutItem extends React.Component {
  static propTypes = {
    boardWorkout: PropTypes.object,
    index: PropTypes.number,
    removeWorkout: PropTypes.func,
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
                  <span
                    className="fa-solid fa-xmark float-end"
                    onClick={() => this.props.removeWorkout(this.props.boardWorkout.id)}
                  />
                </Card.Title>
                <div className="mb-3">
                  {
                    workout.related_muscles.map(muscle => (
                      <Badge key={muscle.id} className="me-3">{muscle.name}</Badge>
                    ))
                  }
                </div>
                <div>
                  <span className="me-3">
                    <Badge pill={true}>{this.props.boardWorkout.reps_value}</Badge> <small>Reps</small>
                  </span>
                  <span className="me-3">
                    <Badge pill={true}>{this.props.boardWorkout.sets_value}</Badge> <small>Sets</small>
                  </span>
                  <span className="me-3">
                    <Badge
                      pill={true}>{this.props.boardWorkout.measurement_value}</Badge> <small>{this.props.boardWorkout.measurement_unit}</small>
                  </span>
                </div>
              </Card.Body>
            </Card>
          )
        }
      </Draggable>
    )
  }
}

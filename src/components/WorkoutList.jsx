import React from 'react';
import {Container} from 'react-bootstrap';
import WorkoutItem from './WorkoutItem';
import PropTypes from 'prop-types';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';

export default class WorkoutList extends React.Component {
  static propTypes = {
    board_workouts: PropTypes.array,
    board_workout_order: PropTypes.array,
    handleOnDragEnd: PropTypes.func
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.props.handleOnDragEnd}>
        <Droppable droppableId="workout-list">
          {
            (provided) => (
              <Container className="workout-list" {...provided.droppableProps} ref={provided.innerRef}>
                {
                  this.props.board_workout_order.map((workout_id, index) => (
                    <WorkoutItem key={workout_id} workout={this.props.board_workouts.find(workout_id)} index={index}/>
                  ))
                }
                {provided.placeholder}
              </Container>
            )
          }
        </Droppable>
      </DragDropContext>
    )
  }
}

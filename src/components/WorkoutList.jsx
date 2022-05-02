import React from 'react';
import WorkoutItem from './WorkoutItem';
import PropTypes from 'prop-types';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';

export default class WorkoutList extends React.Component {
  static propTypes = {
    boardId: PropTypes.number.isRequired,
    boardWorkouts: PropTypes.array.isRequired,
    boardWorkoutOrder: PropTypes.array.isRequired,
    handleOnDragEnd: PropTypes.func.isRequired,
    removeBoardWorkout: PropTypes.func.isRequired,
    updateBoardWorkoutDetails: PropTypes.func.isRequired
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.props.handleOnDragEnd}>
        <Droppable droppableId="workout-list">
          {
            (provided) => (
              <div className="workout-list" {...provided.droppableProps} ref={provided.innerRef}>
                {
                  this.props.boardWorkoutOrder.map((workout_id, index) => (
                    <WorkoutItem
                      key={workout_id}
                      boardId={this.props.boardId}
                      boardWorkout={this.props.boardWorkouts.find(workout => workout.id === workout_id)}
                      removeBoardWorkout={this.props.removeBoardWorkout}
                      updateBoardWorkoutDetails={this.props.updateBoardWorkoutDetails}
                      index={index}/>
                  ))
                }
                {provided.placeholder}
              </div>
            )
          }
        </Droppable>
      </DragDropContext>
    )
  }
}

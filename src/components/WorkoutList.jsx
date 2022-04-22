import React from 'react';
import WorkoutItem from './WorkoutItem';
import PropTypes from 'prop-types';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';

export default class WorkoutList extends React.Component {
  static propTypes = {
    boardWorkouts: PropTypes.array,
    boardWorkoutOrder: PropTypes.array,
    handleOnDragEnd: PropTypes.func,
    removeBoardWorkout: PropTypes.func,
    updateBoardWorkoutDetails: PropTypes.func
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

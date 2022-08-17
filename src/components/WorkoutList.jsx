import React from 'react';
import WorkoutItem from './WorkoutItem';
import PropTypes from 'prop-types';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';

export default function WorkoutList(props) {
  return (
    <DragDropContext onDragEnd={props.handleOnDragEnd}>
      <Droppable droppableId="workout-list">
        {
          (provided) => (
            <div className="workout-list" {...provided.droppableProps} ref={provided.innerRef}>
              {
                props.boardWorkoutOrder.length ? props.boardWorkoutOrder.map((workout_id, index) => (
                  <WorkoutItem
                    key={workout_id}
                    boardId={props.boardId}
                    boardWorkout={props.boardWorkouts.find(workout => workout.id === workout_id)}
                    removeBoardWorkout={props.removeBoardWorkout}
                    updateBoardWorkoutDetails={props.updateBoardWorkoutDetails}
                    index={index}/>
                )) : <p>No workouts have been added to this plan.</p>
              }
              {provided.placeholder}
            </div>
          )
        }
      </Droppable>
    </DragDropContext>
  )
}

WorkoutList.propTypes = {
  boardId: PropTypes.number.isRequired,
  boardWorkouts: PropTypes.array.isRequired,
  boardWorkoutOrder: PropTypes.array.isRequired,
  handleOnDragEnd: PropTypes.func.isRequired,
  removeBoardWorkout: PropTypes.func.isRequired,
  updateBoardWorkoutDetails: PropTypes.func.isRequired
}

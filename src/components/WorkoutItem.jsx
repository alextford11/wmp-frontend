import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Badge, Card, Col, Row} from 'react-bootstrap';
import {Draggable} from 'react-beautiful-dnd';
import {FullInput, InputLabel, NumberInputWidget, SelectInputWidget} from './FormWidgets';
import ReactMarkdown from 'react-markdown';


function WorkoutItemDetails(props) {
  const boardWorkout = props.boardWorkout
  if (props.editDetails) {
    const selectCustomStyles = {
      container: (provided) => ({
        ...provided,
        width: '150px',
      })
    }
    return (
      <form className="mb-3" onSubmit={props.handleOnSubmitEditDetails}>
        <Row className={'mb-3'}>
          <Col xs={12} md="auto">
            <FullInput
              label="Sets"
              type="number"
              tooltip="Set this value to 0 to hide."
              inputOptions={{initial: boardWorkout.sets_value, id: 'id_sets_value'}}/>
          </Col>
          <Col xs={12} md="auto">
            <FullInput
              label="Reps"
              type="number"
              tooltip="Set this value to 0 to hide."
              inputOptions={{initial: boardWorkout.reps_value, id: 'id_reps_value'}}/>
          </Col>
          <Col xs={12} md="auto">
            <div className="form-group">
              <InputLabel id="id_measurement_value" label="Measurable" tooltip="Set this value to 0 to hide."/>
              <div className="d-flex flex-row">
                <div className="pe-2">
                  <NumberInputWidget id="id_measurement_value" initial={boardWorkout.measurement_value}/>
                </div>
                <div className="ps-2">
                  <SelectInputWidget
                    id="id_measurement_unit"
                    optionsUrl={process.env.REACT_APP_BACKEND_BASE_URL + '/board/measurement-units/categories/'}
                    initial={boardWorkout.measurement_unit}
                    placeholder="Units"
                    styles={selectCustomStyles}/>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <FullInput
              label="Notes"
              type="markdown"
              tooltip="Enter any additional information, links, or images that will help you."
              inputOptions={{initial: boardWorkout.notes, id: 'id_notes'}}/>
          </Col>
        </Row>
        <div className="d-flex mt-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={props.cancelEditDetails}>Cancel</button>
          <button className="btn btn-primary btn-sm ms-2" type="submit">Save</button>
        </div>
      </form>
    )
  } else {
    return (
      <>
        {
          boardWorkout.sets_value && boardWorkout.reps_value && boardWorkout.measurement_value ?
            <div className="mb-2">
              {
                boardWorkout.sets_value ?
                  <span className="me-3">
                    <Badge pill={true}>{boardWorkout.sets_value}</Badge> <small>Sets</small>
                  </span> : null
              }
              {
                boardWorkout.reps_value ?
                  <span className="me-3">
                    <Badge pill={true}>{boardWorkout.reps_value}</Badge> <small>Reps</small>
                  </span> : null
              }
              {
                boardWorkout.measurement_value ?
                  <span className="me-3">
                    <Badge
                      pill={true}>{boardWorkout.measurement_value}</Badge> <small>{boardWorkout.measurement_unit}</small>
                  </span> : null
              }
            </div> : null
        }
        <div className="lh-1 mb-4">
          {
            props.workout.related_muscles.map(muscle => (
              <Badge key={muscle.id} className="me-3">{muscle.name}</Badge>
            ))
          }
        </div>
        {
          boardWorkout.notes ?
            <div>
              <p className="small mb-0"><strong>Notes</strong></p>
              <ReactMarkdown>{boardWorkout.notes}</ReactMarkdown>
            </div> : null
        }
      </>
    )
  }
}

WorkoutItemDetails.propTypes = {
  boardId: PropTypes.number.isRequired,
  boardWorkout: PropTypes.object.isRequired,
  workout: PropTypes.object.isRequired,
  editDetails: PropTypes.bool.isRequired,
  cancelEditDetails: PropTypes.func.isRequired,
  handleOnSubmitEditDetails: PropTypes.func.isRequired,
}


export default function WorkoutItem(props) {
  const [editDetails, setEditDetails] = useState(false)

  function handleOnSubmitEditDetails(e) {
    e.preventDefault()
    const form = e.target
    const elements = form.elements

    const data = {
      'sets_value': elements.id_sets_value.value,
      'reps_value': elements.id_reps_value.value,
      'measurement_value': elements.id_measurement_value.value,
      'measurement_unit': elements.id_measurement_unit.value,
      'notes': elements.id_notes.value
    }
    props.updateBoardWorkoutDetails(props.boardWorkout.id, data)
    cancelEditDetails()
  }

  function cancelEditDetails() {
    setEditDetails(false)
  }

  if (props.boardWorkout === undefined) {
    return
  }
  const workout = props.boardWorkout.workout
  return (
    <Draggable
      key={props.boardWorkout.id}
      draggableId={!editDetails ? String(props.boardWorkout.id) : ''}
      index={props.index}>
      {
        (provided) => (
          <Card className="mb-3" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <Card.Body>
              <div className="mb-4">
                <Card.Title>
                  {workout.name}
                  {
                    !editDetails ?
                      <div className="float-end">
                        <span
                          className="fa-solid fa-ellipsis me-3"
                          onClick={() => setEditDetails(true)}
                        />
                        <span
                          className="fa-solid fa-xmark"
                          onClick={() => props.removeBoardWorkout(props.boardWorkout.id)}
                        />
                      </div> : null
                  }
                </Card.Title>
              </div>
              <WorkoutItemDetails
                boardId={props.boardId}
                boardWorkout={props.boardWorkout}
                workout={workout}
                editDetails={editDetails}
                cancelEditDetails={cancelEditDetails}
                handleOnSubmitEditDetails={handleOnSubmitEditDetails}/>
            </Card.Body>
          </Card>
        )
      }
    </Draggable>
  )
}

WorkoutItem.propTypes = {
  boardId: PropTypes.number.isRequired,
  boardWorkout: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  removeBoardWorkout: PropTypes.func.isRequired,
  updateBoardWorkoutDetails: PropTypes.func.isRequired,
}

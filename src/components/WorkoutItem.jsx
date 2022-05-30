import React from 'react';
import PropTypes from 'prop-types';
import {Badge, Card, Col, Row} from 'react-bootstrap';
import {Draggable} from 'react-beautiful-dnd';
import {FullInput, NumberInputWidget, SelectInputWidget} from './FormWidgets';


class WorkoutItemDetails extends React.Component {
  static propTypes = {
    boardId: PropTypes.number.isRequired,
    boardWorkout: PropTypes.object.isRequired,
    editDetails: PropTypes.bool.isRequired,
    cancelEditDetails: PropTypes.func.isRequired,
    handleOnSubmitEditDetails: PropTypes.func.isRequired,
  };

  render() {
    const boardWorkout = this.props.boardWorkout
    if (this.props.editDetails) {
      const selectCustomStyles = {
        container: (provided) => ({
          ...provided,
          width: '150px',
        })
      }
      return (
        <form className="mb-3" onSubmit={this.props.handleOnSubmitEditDetails}>
          <Row>
            <Col xs={12} md="auto">
              <FullInput
                label="Sets"
                type="number"
                inputOptions={{initial: boardWorkout.sets_value, id: 'id_sets_value'}}/>
            </Col>
            <Col xs={12} md="auto">
              <FullInput
                label="Reps"
                type="number"
                inputOptions={{initial: boardWorkout.reps_value, id: 'id_reps_value'}}/>
            </Col>
            <Col xs={12} md="auto">
              <div className="form-group">
                <label htmlFor="id_measurement_value">Measurable</label>
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
          <div className="d-flex mt-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={this.props.cancelEditDetails}>Cancel</button>
            <button className="btn btn-primary btn-sm ms-2" type="submit">Save</button>
          </div>
        </form>
      )
    } else {
      return (
        <div className="mb-3">
          <span className="me-3">
            <Badge pill={true}>{boardWorkout.sets_value}</Badge> <small>Sets</small>
          </span>
          <span className="me-3">
            <Badge pill={true}>{boardWorkout.reps_value}</Badge> <small>Reps</small>
          </span>
          <span className="me-3">
            <Badge
              pill={true}>{boardWorkout.measurement_value}</Badge> <small>{boardWorkout.measurement_unit}</small>
          </span>
        </div>
      )
    }
  }
}


export default class WorkoutItem extends React.Component {
  static propTypes = {
    boardId: PropTypes.number.isRequired,
    boardWorkout: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    removeBoardWorkout: PropTypes.func.isRequired,
    updateBoardWorkoutDetails: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      editDetails: false
    }
    this.cancelEditDetails = this.cancelEditDetails.bind(this)
    this.handleOnSubmitEditDetails = this.handleOnSubmitEditDetails.bind(this)
  }

  handleOnSubmitEditDetails(e) {
    e.preventDefault()
    const form = e.target
    const elements = form.elements

    const data = {
      'sets_value': elements.id_sets_value.value,
      'reps_value': elements.id_reps_value.value,
      'measurement_value': elements.id_measurement_value.value,
      'measurement_unit': elements.id_measurement_unit.value,
    }
    this.props.updateBoardWorkoutDetails(this.props.boardWorkout.id, data)
    this.cancelEditDetails()
  }

  cancelEditDetails() {
    this.setState({editDetails: false})
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
                <div className="mb-4">
                  <Card.Title>
                    {workout.name}
                    {
                      !this.state.editDetails ?
                        <div className="float-end">
                          <span
                            className="fa-solid fa-ellipsis me-3"
                            onClick={() => this.setState({editDetails: true})}
                          />
                          <span
                            className="fa-solid fa-xmark"
                            onClick={() => this.props.removeBoardWorkout(this.props.boardWorkout.id)}
                          />
                        </div> : null
                    }
                  </Card.Title>
                </div>
                <WorkoutItemDetails
                  boardId={this.props.boardId}
                  boardWorkout={this.props.boardWorkout}
                  editDetails={this.state.editDetails}
                  cancelEditDetails={this.cancelEditDetails}
                  handleOnSubmitEditDetails={this.handleOnSubmitEditDetails}/>
                {
                  !this.state.editDetails ?
                    <div className="lh-1">
                      {
                        workout.related_muscles.map(muscle => (
                          <Badge key={muscle.id} className="me-3">{muscle.name}</Badge>
                        ))
                      }
                    </div> : null
                }
              </Card.Body>
            </Card>
          )
        }
      </Draggable>
    )
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import {Badge, Card, Col, Row} from 'react-bootstrap';
import {Draggable} from 'react-beautiful-dnd';
import {FullInput, NumberInputWidget} from './FormWidgets';
import {handleErrors} from '../utils';
import Select from 'react-select';


class MeasurementSelectInput extends React.Component {
  static propTypes = {
    optionsUrl: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {options: [], selectedOption: null, value: ''}
    this.handleOnSelectChange = this.handleOnSelectChange.bind(this)
  }

  componentDidMount() {
    fetch(this.props.optionsUrl, {method: 'OPTIONS'})
      .then(handleErrors)
      .then(data => {
        this.setState({
          options: data['definitions']['MeasurementUnits']['choices'],
        })
      })
  }

  handleOnSelectChange(option) {
    this.setState({selectedOption: option, value: option.value})
  }

  render() {
    const selectCustomStyles = {
      container: (provided) => ({
        ...provided,
        width: '150px',
      })
    }
    return (
      <div>
        <input type="hidden" value={this.state.value}/>
        <Select
          value={this.state.selectedOption}
          options={this.state.options}
          placeholder="Unit"
          onChange={this.handleOnSelectChange}
          styles={selectCustomStyles}/>
      </div>
    )
  }
}


class WorkoutItemDetails extends React.Component {
  static propTypes = {
    boardId: PropTypes.number.isRequired,
    boardWorkout: PropTypes.object.isRequired,
    editDetails: PropTypes.bool.isRequired,
    cancelEditDetails: PropTypes.func.isRequired,
  };

  render() {
    if (this.props.editDetails) {
      const optionsPath = `/board/${this.props.boardId}/workout/${this.props.boardWorkout.id}/`
      return (
        <form className="mb-3">
          <Row>
            <Col xs={12} md="auto" className="px-2">
              <FullInput label="Reps" type="number" inputOptions={{initial: 10, id: 'id_reps_value'}}/>
            </Col>
            <Col xs={12} md="auto" className="px-2">
              <FullInput label="Sets" type="number" inputOptions={{initial: 10, id: 'id_sets_value'}}/>
            </Col>
            <Col xs={12} md="auto" className="px-2">
              <div className="form-group">
                <label htmlFor="id_measurement_value">Measurable</label>
                <div className="d-flex flex-row">
                  <div className="pe-2">
                    <NumberInputWidget id="id_measurement_value" initial={10}/>
                  </div>
                  <div className="ps-2">
                    <MeasurementSelectInput
                      optionsUrl={process.env.REACT_APP_BACKEND_BASE_URL + optionsPath}
                      id="id_measurement_unit"/>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <div className="d-flex mt-2">
            <div>
              <button className="btn btn-outline-secondary" onClick={this.props.cancelEditDetails}>Cancel</button>
            </div>
            <div>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </div>
        </form>
      )
    } else {
      const boardWorkout = this.props.boardWorkout;
      return (
        <div className="mb-3">
          <span className="me-3">
            <Badge pill={true}>{boardWorkout.reps_value}</Badge> <small>Reps</small>
          </span>
          <span className="me-3">
            <Badge pill={true}>{boardWorkout.sets_value}</Badge> <small>Sets</small>
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
  }

  cancelEditDetails () {
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
                    <div className="float-end">
                      <span
                        className="fa-solid fa-ellipsis me-3"
                        onClick={() => this.setState({editDetails: true})}
                      />
                      <span
                        className="fa-solid fa-xmark"
                        onClick={() => this.props.removeBoardWorkout(this.props.boardWorkout.id)}
                      />
                    </div>
                  </Card.Title>
                </div>
                <WorkoutItemDetails
                  boardId={this.props.boardId}
                  boardWorkout={this.props.boardWorkout}
                  editDetails={this.state.editDetails}
                  cancelEditDetails={this.state.cancelEditDetails}/>
                <div className="lh-1">
                  {
                    workout.related_muscles.map(muscle => (
                      <Badge key={muscle.id} className="me-3">{muscle.name}</Badge>
                    ))
                  }
                </div>
              </Card.Body>
            </Card>
          )
        }
      </Draggable>
    )
  }
}

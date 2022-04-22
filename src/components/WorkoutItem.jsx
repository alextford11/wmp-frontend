import React from 'react';
import PropTypes from 'prop-types';
import {Badge, Card, Col, Row} from 'react-bootstrap';
import {Draggable} from 'react-beautiful-dnd';
import {FullInput} from './FormWidgets';


class WorkoutItemDetails extends React.Component {
  static propTypes = {
    boardWorkout: PropTypes.object,
    editDetails: PropTypes.bool,
  };

  render() {
    if (this.props.editDetails) {
      return (
        <form>
          <Row>
            <Col xs={12} md="auto">
              <FullInput label="Reps" type="number" inputOptions={{initial: 10, id: 'id_reps_value'}}/>
            </Col>
            <Col xs={12} md="auto">
              <FullInput label="Sets" type="number" inputOptions={{initial: 10, id: 'id_sets_value'}}/>
            </Col>
            <Col xs={12} md="auto">
              <FullInput label="Measurable" type="number" inputOptions={{initial: 10, id: 'id_measurement_value'}}/>
            </Col>
          </Row>



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
    boardWorkout: PropTypes.object,
    index: PropTypes.number,
    removeBoardWorkout: PropTypes.func,
    updateBoardWorkoutDetails: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      editDetails: false
    }
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
                <WorkoutItemDetails boardWorkout={this.props.boardWorkout} editDetails={this.state.editDetails}/>
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

import {Button, Col, Container, Dropdown, ListGroup, Modal, Row} from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import {handleErrorMessage, handleErrors} from '../utils';
import PropTypes from 'prop-types';
import moment from 'moment';
import {EllipsisDropdownToggle} from './Utils';
import {FullInput} from './FormWidgets';


export default function WorkoutPlanList(props) {
  const [boards, setBoards] = useState([])
  const [boardsLoaded, setBoardsLoaded] = useState(false)

  useEffect(() => {
    if (!boardsLoaded) {
      fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/user/boards/`, {
        headers: {'Authorization': 'Bearer ' + props.userAccessToken}
      })
        .then(handleErrors)
        .then(data => {
          setBoards(data['boards'])
          setBoardsLoaded(true)
        })
    }
  })

  function refreshBoards() {
    setBoardsLoaded(false)
  }

  return (
    <Container>
      <Row>
        <Col>
          <h1>Your Workout Plans</h1>
        </Col>
        <Col xs={'auto'}>
          <a className="btn btn-primary" href="/board/">Add Plan</a>
        </Col>
      </Row>
      <Row>
        <Col>
          <ListGroup variant="flush">
            {
              boards.length ? boards.map((board, index) => {
                return (
                  <ListGroup.Item className="py-4" key={index}>
                    <WorkoutPlanItem board={board} refreshBoards={refreshBoards}/>
                  </ListGroup.Item>
                )
              }) : <p>No workout plans found.</p>
            }
          </ListGroup>
        </Col>
      </Row>
    </Container>
  )
}

WorkoutPlanList.propTypes = {
  userAccessToken: PropTypes.string
}

function WorkoutPlanItem(props) {
  function deleteWorkoutPlan() {
    const userAccessToken = localStorage.getItem(process.env.REACT_APP_ACCESS_TOKEN_KEY)

    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/user/boards/${props.board.id}/`, {
      method: 'DELETE',
      headers: {'Authorization': 'Bearer ' + userAccessToken}
    })
      .then(handleErrors)
      .then(props.refreshBoards)
  }

  return (
    <Row>
      <Col>
        <a href={`/board/${props.board.id}/`}>
          {props.board.name || 'Workout Plan'}
        </a>
        <p className="text-muted small mb-0">Created {moment(props.board.created).fromNow()}</p>
      </Col>
      <Col xs={'auto'}>
        <Dropdown>
          <Dropdown.Toggle as={EllipsisDropdownToggle}/>
          <Dropdown.Menu align={'end'}>
            <Dropdown.Item><EditPlanModal board={props.board} refreshBoards={props.refreshBoards}/></Dropdown.Item>
            <Dropdown.Item onClick={deleteWorkoutPlan}>Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  )
}

WorkoutPlanItem.propTypes = {
  board: PropTypes.object.isRequired,
  refreshBoards: PropTypes.func.isRequired
}

function EditPlanModal(props) {
  const [show, setShow] = useState(false)

  function handleClose() {
    setShow(false)
  }

  function handleShow() {
    setShow(true)
  }

  function handleSave() {
    const form = document.getElementById('edit-plan-form')
    const formData = {name: form.elements.id_name.value}
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/board/${props.board.id}/name/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData)
    })
      .then(handleErrors)
      .then(() => {
        handleClose()
        props.refreshBoards()
      })
      .catch(error => {
        handleErrorMessage(error, form)
      })
  }

  return (
    <div onKeyDown={e => e.stopPropagation()}>
      <div onClick={handleShow}>Edit</div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="edit-plan-form" onSubmit={handleSave}>
            <div className="mb-3">
              <FullInput label="Name" type="text" inputOptions={{id: 'id_name'}}/>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

EditPlanModal.propTypes = {
  board: PropTypes.object.isRequired,
  refreshBoards: PropTypes.func.isRequired
}

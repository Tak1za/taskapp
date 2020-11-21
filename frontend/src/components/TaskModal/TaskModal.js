import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const TaskModal = (props) => {
  const [newTask, setNewTask] = useState("");

  const handleNewTaskChange = (e) => {
    const { value } = e.target;
    setNewTask(value);
  };

  const handleAddTask = () => {
    if (newTask === "") {
      return;
    }
    let tableName = props.heading.toLowerCase();
    window.backend.Conn.AddToDB(tableName, newTask)
      .then(() => {
        // props.settasks([...props.tasks, res]);
        // console.log(res);
        props.update(true);
      }).then(setNewTask(""))
      .catch((e) => console.error(e));
    props.onHide();
  };

  return (
    <div>
      <Modal
        show={props.show}
        onHide={props.onHide}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.heading}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>{`${props.type} Task`}</h6>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Control
              as="textarea"
              rows={3}
              value={newTask}
              onChange={handleNewTaskChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAddTask}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TaskModal;

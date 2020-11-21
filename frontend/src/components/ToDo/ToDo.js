import React, { useState } from "react";
import "./Todo.css";
import TaskModal from "../TaskModal/TaskModal";

const ToDo = (props) => {
  const [showAddTaskModal, setshowAddTaskModal] = useState(false);

  const handleDeleteItem = (taskId) => {
    window.backend.Conn.RemoveFromDB("todo", taskId).catch((e) =>
      console.error(e)
    );

    props.triggerUpdate(true);
  };

  const handleStartTask = (taskId) => {
    window.backend.Conn.MoveToDB("todo", "doing", taskId).catch((e) =>
      console.error(e)
    );

    props.triggerUpdate(true);
  };

  const [hovering, setHovering] = useState(false);

  const handleMouseEnter = () => {
    setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  return (
    <div className="todo">
      <div className="todo-heading">
        <h3>ToDo</h3>
        <i className="fas fa-plus" onClick={() => setshowAddTaskModal(true)} />
      </div>
      <div className="todo-list">
        <div>
          {props.list
            ? props.list.map((d) => {
                return (
                  <div className="todo-list-content" key={d.id}>
                    <div className="todo-list-task-container">
                      <i
                        className={`${
                          hovering
                            ? "fas fa-hourglass-half todo-list-item-move-doing"
                            : "fas fa-play todo-list-item-check"
                        }`}
                        onClick={() => handleStartTask(d.id)}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      />
                      <p className="todo-list-item-task">{d.task}</p>
                    </div>
                    <i
                      className="far fa-trash-alt todo-list-item-delete"
                      onClick={() => handleDeleteItem(d.id)}
                    />
                  </div>
                );
              })
            : null}
        </div>
      </div>
      <TaskModal
        show={showAddTaskModal}
        onHide={() => setshowAddTaskModal(false)}
        heading="ToDo"
        type="Add"
        settasks={props.setList}
        update={props.triggerUpdate}
        tasks={props.list ? props.list : []}
      />
    </div>
  );
};

export default ToDo;

import React from "react";
import "./Done.css";

const Done = (props) => {
  const handleDeleteItem = (taskId) => {
    window.backend.Conn.RemoveFromDB("done", taskId).catch((e) =>
      console.error(e)
    );

    props.triggerUpdate(true);
  };
  return (
    <div className="done">
      <div className="done-heading">
        <h3>Done</h3>
      </div>
      <div className="done-list">
        {props.list
          ? props.list.map((d) => {
              return (
                <div className="done-list-content" key={d.id}>
                  <div className="done-list-task-container">
                    <i className="fas fa-check-double done-list-item-check" />
                    <p className="done-list-item-task">{d.task}</p>
                  </div>
                  <i
                    className="far fa-trash-alt done-list-item-delete"
                    onClick={() => handleDeleteItem(d.id)}
                  />
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default Done;

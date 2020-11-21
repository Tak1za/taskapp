import React from "react";
import "./Doing.css";

const Doing = (props) => {
  const handleDeleteItem = (taskId) => {
    window.backend.Conn.RemoveFromDB("doing", taskId).catch((e) =>
      console.error(e)
    );

    props.triggerUpdate(true);
  };

  return (
    <div className="doing">
      <div className="doing-heading">
        <h3>Doing</h3>
      </div>
      <div className="doing-list">
        {props.list
          ? props.list.map((d) => {
              return (
                <div className="doing-list-content" key={d.id}>
                  <div className="doing-list-task-container">
                    <i className="fas fa-hourglass-half doing-list-item-check" />
                    <p className="doing-list-item-task">{d.task}</p>
                  </div>
                  <i
                    className="far fa-trash-alt doing-list-item-delete"
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

export default Doing;

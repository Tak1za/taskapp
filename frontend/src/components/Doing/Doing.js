import React, { useState } from "react";
import "./Doing.css";

const Doing = (props) => {
  const [hovering, setHovering] = useState(false);
  const handleDeleteItem = (taskId) => {
    window.backend.Conn.RemoveFromDB("doing", taskId).catch((e) =>
      console.error(e)
    );

    props.triggerUpdate(true);
  };

  const handleFinishTask = (taskId) => {
    window.backend.Conn.MoveToDB("doing", "done", taskId).catch((e) =>
      console.error(e)
    );

    props.triggerUpdate(true);
  };

  const handleMouseEnter = () => {
    setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
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
                    <i
                      className={`${
                        hovering
                          ? "fas fa-check-double doing-list-item-move-done"
                          : "fas fa-hourglass-half doing-list-item-check"
                      }`}
                      onClick={() => handleFinishTask(d.id)}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    />
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

import React, { useState, useEffect } from "react";
import "./App.css";
import ToDo from "./components/ToDo/ToDo";
import Doing from "./components/Doing/Doing";
import Done from "./components/Done/Done";
import Categories from "./components/Categories/Categories";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const [update, setUpdate] = useState(true);
  const [toDoList, setToDoList] = useState([]);
  useEffect(() => {
    if (update) {
      console.log("updating todo");
      window.backend.Conn.GetAllResults("todo")
        .then((res) => {
          setToDoList(res.data);
        })
        .catch((e) => console.error(e));
      setUpdate(false);
    }
  }, [update]);

  const [doingList, setDoingList] = useState([]);
  useEffect(() => {
    if (update) {
      console.log("updating doing");
      window.backend.Conn.GetAllResults("doing")
        .then((res) => {
          setDoingList(res.data);
        })
        .catch((e) => console.error(e));
      setUpdate(false);
    }
  }, [update]);

  const [doneList, setDoneList] = useState([]);
  useEffect(() => {
    if (update) {
      window.backend.Conn.GetAllResults("done")
        .then((res) => {
          setDoneList(res.data);
        })
        .catch((e) => console.error(e));
      setUpdate(false);
    }
  }, [update]);

  return (
    <div id="app" className="app">
      <Categories />
      <div className="app-navbar">
        <Navbar />
        <div className="app-content">
          <ToDo
            list={toDoList}
            setList={setToDoList}
            triggerUpdate={setUpdate}
          />
          <Doing list={doingList} setList={setDoingList} triggerUpdate={setUpdate} />
          <Done list={doneList} setList={setDoneList} />
        </div>
      </div>
    </div>
  );
}

export default App;

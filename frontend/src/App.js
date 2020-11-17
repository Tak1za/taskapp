import React, {useEffect, useState} from 'react';
import './App.css';
import ToDo from "./components/ToDo/ToDo";
import Doing from "./components/Doing/Doing";
import Done from "./components/Done/Done";
import Categories from "./components/Categories/Categories";
import Navbar from "./components/Navbar/Navbar";

function App() {
    const [toDoList, setToDoList] = useState([]);
    const [doingList, setDoingList] = useState([]);
    const [doneList, setDoneList] = useState([]);
    useEffect(() => {
        window.backend.Conn.GetAllResults("todo").then(res => {
            setToDoList(res.data)
        }).catch(e => console.error(e))

        window.backend.Conn.GetAllResults("doing").then(res => {
            setDoingList(res.data)
        }).catch(e => console.error(e))

        window.backend.Conn.GetAllResults("done").then(res => {
            setDoneList(res.data)
        }).catch(e => console.error(e))
    }, []);
    
  return (
    <div id="app" className="app">
      <Categories />
      <div className="app-navbar">
          <Navbar />
          <div className="app-content">
              <ToDo data={toDoList}/>
              <Doing data={doingList}/>
              <Done data={doneList}/>
          </div>
      </div>
    </div>
  );
}

export default App;

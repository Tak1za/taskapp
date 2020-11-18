import React, {useEffect, useState} from 'react';
import './Todo.css';
import {Form} from 'react-bootstrap';
import TaskModal from "../TaskModal/TaskModal";

const ToDo = (props) => {
    const [toDoList, setToDoList] = useState([]);
    useEffect(() => {
        window.backend.Conn.GetAllResults("todo").then(res => {
            setToDoList(res.data)
        }).catch(e => console.error(e))
    }, []);

    const [showAddTaskModal, setshowAddTaskModal] = useState(false);

    const handleDeleteItem = (taskId) => {
        window.backend.Conn.RemoveFromDB("todo", taskId).catch(e => console.error(e))
        let list = [...toDoList]
        let updatedList = list.filter(i => {
            return i.id !== taskId;
        })
        setToDoList(updatedList)
    }

    return (
        <div className="todo">
            <div className="todo-heading">
                <h3>ToDo</h3>
                <i className="fas fa-plus" onClick={() => setshowAddTaskModal(true)}/>
            </div>
            <div className="todo-list">
                <div className="todo-list-content">
                    {toDoList ? toDoList.map((d) => {
                        return (
                            <div key={d.id} className="todo-list-item">
                                <Form.Group controlId={`formIdCheckbox${d.id}`} className="todo-list-item-task">
                                    <Form.Check type="checkbox" label={d.task}/>
                                </Form.Group>
                                <i className="far fa-trash-alt todo-list-item-delete" onClick={() => handleDeleteItem(d.id)}/>
                            </div>
                        )
                    }) : null}
                </div>
            </div>
            <TaskModal show={showAddTaskModal} onHide={() => setshowAddTaskModal(false)} heading="ToDo" type="Add"
                       settasks={setToDoList} tasks={toDoList}/>
        </div>
    );
};

export default ToDo;

import React from 'react';
import './Todo.css';
import {Form} from 'react-bootstrap';

const ToDo = (props) => {
    return (
        <div className="todo">
            <div className="todo-heading">
                <h3>ToDo</h3>
                <i className="fas fa-plus"/>
            </div>
            <div className="todo-list">
                <div className="todo-list-content">
                    {props.data ? props.data.map((d) => {
                        return (
                            <Form.Group key={d.id} controlId={`formIdCheckbox${d.id}`}>
                                <Form.Check type="checkbox" label={d.task}/>
                            </Form.Group>
                        )
                    }) : null}
                </div>
            </div>
        </div>
    );
};

export default ToDo;

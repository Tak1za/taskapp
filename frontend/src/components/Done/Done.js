import React, {useEffect, useState} from 'react';
import './Done.css';
import {Form} from "react-bootstrap";

const Done = (props) => {
    const [doneList, setDoneList] = useState([]);
    useEffect(() => {
        window.backend.Conn.GetAllResults("done").then(res => {
            setDoneList(res.data)
        }).catch(e => console.error(e))
    }, []);

    return (
        <div className="done">
            <div className="done-heading">
                <h3>Done</h3>
            </div>
            <div className="done-list">
                <div className="done-list-content">
                    {doneList ? doneList.map((d) => {
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

export default Done;

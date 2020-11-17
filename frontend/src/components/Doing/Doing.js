import React from 'react';
import './Doing.css'
import {Form} from "react-bootstrap";

const Doing = (props) => {
    return (
        <div className="doing">
            <div className="doing-heading">
                <h3>Doing</h3>
            </div>
            <div className="doing-list">
                <div className="doing-list-content">
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

export default Doing;

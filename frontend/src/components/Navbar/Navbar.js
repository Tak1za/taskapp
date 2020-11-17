import React from 'react';
import {Nav} from 'react-bootstrap';
import './Navbar.css';

const Navbar = () => {
    return (
        <div className="navbar">
            <Nav activeKey="/home">
                <Nav.Item>
                    <Nav.Link href="/home">All</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-1">Today</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    );
};

export default Navbar;

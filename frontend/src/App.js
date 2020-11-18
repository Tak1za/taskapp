import React from 'react';
import './App.css';
import ToDo from "./components/ToDo/ToDo";
import Doing from "./components/Doing/Doing";
import Done from "./components/Done/Done";
import Categories from "./components/Categories/Categories";
import Navbar from "./components/Navbar/Navbar";

function App() {
    return (
        <div id="app" className="app">
            <Categories/>
            <div className="app-navbar">
                <Navbar/>
                <div className="app-content">
                    <ToDo/>
                    <Doing/>
                    <Done/>
                </div>
            </div>
        </div>
    );
}

export default App;

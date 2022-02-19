import React from "react";
import {HashRouter as Router, Route, Routes} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";

export default function AppRouter({isLoggedIn}: { isLoggedIn: boolean }) {
    return (
        <Router>
            <Routes>
                {isLoggedIn ?
                    <Route path={"/"} element={<Home/>}/>
                    :
                    <Route path={"/"} element={<Auth/>}/>
                }
            </Routes>
        </Router>
    )
}
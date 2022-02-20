import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";
import firebase from "firebase/compat";

interface IProps {
    isLoggedIn: boolean;
    userObj: firebase.User | null;
}

export default function AppRouter({isLoggedIn, userObj}: IProps) {
    return (
        <Router>
            {isLoggedIn && <Navigation/>}
            <Routes>
                {isLoggedIn ? (
                    <>
                        <Route path={"/"} element={<Home userObj={userObj}/>}/>
                        <Route path={"/profile"} element={<Profile/>}/>
                    </>
                ) : (
                    <>
                        <Route path={"/"} element={<Auth/>}/>
                    </>
                )}
            </Routes>
        </Router>
    )
}
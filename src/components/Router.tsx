import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";
import {TUser} from "models/User";

interface IProps {
    userObj?: TUser | null;
    refreshUser: Function;
}

export default function AppRouter({userObj, refreshUser}: IProps) {
    return (
        <Router>
            {userObj && <Navigation userObj={userObj}/>}
            <Routes>
                {userObj ? (
                    <>
                        <Route path={"/"} element={<Home userObj={userObj}/>}/>
                        <Route path={"/profile"} element={<Profile userObj={userObj} refreshUser={refreshUser}/>}/>
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
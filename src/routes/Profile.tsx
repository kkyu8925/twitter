import React from "react";
import {authService} from "../firebaseConfig";
import {useNavigate} from "react-router-dom";

export default function Profile() {
    const nav = useNavigate();
    const onLogOutClick = () => {
        authService.signOut().then()
        nav("/");
    }
    return (
        <>
            <button onClick={onLogOutClick}>Log out</button>
        </>
    )
}
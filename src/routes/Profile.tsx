import React, {useEffect, useState} from "react";
import {authService, dbService} from "../firebaseConfig";
import {useNavigate} from "react-router-dom";
import User from "models/User";

interface IProps {
    userObj: User;
    refreshUser: Function;
}

export default function Profile({userObj, refreshUser}: IProps) {
    const [newName, setNewName] = useState<string>(() => {
        if (userObj.displayName === null) {
            userObj.displayName = "";
        }
        return userObj.displayName;
    });
    const nav = useNavigate();
    const onLogOutClick = () => {
        authService.signOut().then()
        nav("/");
    }
    const getMyTweets = async () => {
        const myTweets = await dbService
            .collection("twitter")
            .where("createdId", "==", userObj.uid)
            .get();
    }
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {target: {value}} = e;
        setNewName(value);
    }
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (userObj.displayName !== newName) {
            await userObj.updateProfile({
                displayName: newName
            })
            refreshUser();
        }
    };

    useEffect(() => {
        // getMyTweets();
    }, [])

    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    onChange={onChange}
                    type={"text"}
                    placeholder={"Display name"}
                    value={newName}
                />
                <input type={"submit"} value={"Update profile"}/>
            </form>
            <button onClick={onLogOutClick}>Log out</button>
        </>
    )
}
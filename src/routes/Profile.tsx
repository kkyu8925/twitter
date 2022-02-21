import React, {useEffect, useState} from "react";
import {authService, dbService} from "firebaseConfig";
import {useNavigate} from "react-router-dom";
import {TUser} from "models/User";
import {TGetTweet} from "../models/Tweet";
import Tweet from "../components/Tweet";

interface IProps {
    userObj: TUser;
    refreshUser: Function;
}

export default function Profile({userObj, refreshUser}: IProps) {
    const [twitters, setTwitters] = useState<TGetTweet[]>([]);
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
        const newArray: TGetTweet[] = myTweets.docs.map(doc => {
            const twitter: TGetTweet = {
                text: doc.data().text,
                createdAt: doc.data().createdAt,
                createdId: doc.data().createdId,
                id: doc.id,
                imageUrl: doc.data().imageUrl
            };
            return twitter;
        })
        setTwitters(newArray)
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
        getMyTweets().then();
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
            <div>
                {twitters.map(tweet => (
                    <Tweet
                        key={tweet.id}
                        tweet={tweet}
                        isOwner={tweet.createdId === userObj?.uid}
                    />
                ))}
            </div>
        </>
    )
}
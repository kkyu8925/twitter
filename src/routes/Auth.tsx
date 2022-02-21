import React from "react";
import {authService, firebaseInstance} from "firebaseConfig";
import firebase from "firebase/compat";
import AuthForm from "../components/AuthForm";

export default function Auth() {

    const onSocialChick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const {name} = e.target as HTMLButtonElement;
        let provider!: firebase.auth.AuthProvider;
        if (name === "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider()
        } else if (name === "github") {
            provider = new firebaseInstance.auth.GithubAuthProvider()
        }
        await authService.signInWithPopup(provider);
    }

    return (
        <div>
            <AuthForm/>
            <div>
                <button name={"google"} onClick={onSocialChick}>Continue with Google</button>
                <button name={"github"} onClick={onSocialChick}>Continue with Github</button>
            </div>
        </div>
    )
}
import React, {useState} from "react";
import {authService, firebaseInstance} from "firebaseConfig";
import firebase from "firebase/compat";

export default function Auth() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [newAccount, setNewAccount] = useState<boolean>(true)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        if (name === "email") {
            setEmail(value)
        } else if (name === "password") {
            setPassword(value)
        }
    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            let data: firebase.auth.UserCredential
            if (newAccount) {
                // create
                data = await authService.createUserWithEmailAndPassword(
                    email,
                    password
                )
            } else {
                // log in
                data = await authService.signInWithEmailAndPassword(
                    email,
                    password
                )
            }
            console.log(data)
        } catch (e) {
            console.log(e)
        }
    }

    const toggleAccount = () => {
        setNewAccount((prev) => !prev);
    }

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
            <form onSubmit={onSubmit}>
                <input
                    name={"email"}
                    type={"email"}
                    placeholder={"Email"}
                    value={email}
                    onChange={onChange}
                    required
                />
                <input
                    name={"password"}
                    type={"password"}
                    placeholder={"Password"}
                    value={password}
                    onChange={onChange}
                    required
                />
                <input type={"submit"} value={newAccount ? "Create Account" : "Log In"}/>
            </form>
            <span onClick={toggleAccount}>
                {newAccount ? "Sign in" : "Sing up"}
            </span>
            <div>
                <button name={"google"} onClick={onSocialChick}>Continue with Google</button>
                <button name={"github"} onClick={onSocialChick}>Continue with Github</button>
            </div>
        </div>
    )
}
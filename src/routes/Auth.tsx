import React, {useState} from "react";
import {authService} from "../firebase";
import firebase from "firebase/compat";
import UserCredential = firebase.auth.UserCredential;

export default function Auth() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [newAccount, setNewAccount] = useState<boolean>(true)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {target: {name, value}} = e
        if (name === "email") {
            setEmail(value)
        } else if (name === "password") {
            setPassword(value)
        }
    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            let data: UserCredential
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
                <button>Continue with Google</button>
                <button>Continue with Github</button>
            </div>
        </div>
    )
}
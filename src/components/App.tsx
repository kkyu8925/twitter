import React, {useEffect, useState} from 'react';
import AppRouter from "components/Router";
import {authService} from "firebaseConfig";
import firebase from "firebase/compat";

function App() {
    const [init, setInit] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userObj, setUserObj] = useState<firebase.User | null>(null);

    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
            setUserObj(user);
            setInit(true);
        })
    }, []);

    return (
        <>
            {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initializing..."}
        </>
    );
}

export default App;

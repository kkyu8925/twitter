import React, {useEffect, useState} from 'react';
import AppRouter from "components/Router";
import {authService} from "firebaseConfig";
import firebase from "firebase/compat";

function App() {
    const [init, setInit] = useState<boolean>(false);
    const [userObj, setUserObj] = useState<firebase.User | null>(null);

    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            setUserObj(user);
            setInit(true);
        })
    }, []);

    return (
        <>
            {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj}/> : "Initializing..."}
        </>
    );
}

export default App;

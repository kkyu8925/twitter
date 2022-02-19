import React, {useEffect, useState} from 'react';
import AppRouter from "components/Router";
import {authService} from "../firebase";


function App() {
    const [init, setInit] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
            console.log("setInit()")
            setInit(true);
        })
    }, []);

    return (
        <>
            {init ? <AppRouter isLoggedIn={isLoggedIn}/> : "Initializing..."}
        </>
    );
}

export default App;

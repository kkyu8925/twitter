import React, {useEffect, useState} from 'react';
import AppRouter from "components/Router";
import {authService} from "firebaseConfig";
import firebase from "firebase/compat/app";
import {TUser} from "models/User";

function App() {
    const [init, setInit] = useState<boolean>(false);
    const [userObj, setUserObj] = useState<TUser | null>();

    const setFirebaseUserToUser = (user: firebase.User | null) => {
        if (user !== null) {
            const userInfo: TUser = {
                displayName: user.displayName!,
                uid: user.uid,
                updateProfile: (args: any) => user.updateProfile(args)
            }
            setUserObj(userInfo);
        } else {
            setUserObj(null)
        }
    }

    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            setFirebaseUserToUser(user);
            setInit(true);
        })
    }, []);

    const refreshUser = () => {
        const getCurrentUser = authService.currentUser;
        setFirebaseUserToUser(getCurrentUser);
    }

    return (
        <>
            {init ? <AppRouter refreshUser={refreshUser} userObj={userObj}/> : "Initializing..."}
        </>
    );
}

export default App;

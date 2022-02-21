import React from "react";
import {Link} from "react-router-dom";
import {TUser} from "models/User";

export default function Navigation({userObj}: { userObj: TUser }) {
    return (
        <nav>
            <ul>
                <li>
                    <Link to={"/"}>Home</Link>
                </li>
                <li>
                    <Link to={"/profile"}>{userObj.displayName} Profile</Link>
                </li>
            </ul>
        </nav>
    )
}
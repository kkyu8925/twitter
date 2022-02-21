import React, {useState} from "react";
import {dbService, storageService} from "firebaseConfig";
import {v4 as uuidv4} from "uuid";
import {TSetTweet} from "models/Tweet";
import {TUser} from "models/User";

export default function TweetForm({userObj}: { userObj: TUser }) {
    const [text, setText] = useState<string>("");
    const [attachment, setAttachment] = useState<any>("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (userObj?.uid === undefined) {
            alert("Error! please again login")
            return
        }
        let imageUrl: string = "";
        if (attachment !== "") {
            const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`)
            const response = await fileRef.putString(attachment, "data_url");
            imageUrl = await response.ref.getDownloadURL();
        }
        const data: TSetTweet = {
            text: text,
            createdAt: Date.now(),
            createdId: userObj.uid,
            imageUrl: imageUrl
        }
        await dbService.collection("twitter").add(data)
        setText("")
        setAttachment(null);
    };
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setText(value);
    };
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {target: {files}} = e;

        if (!files?.length) {
            return;
        }

        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setAttachment(reader.result)
        }
        reader.readAsDataURL(file);
    }

    const onClearAttachment = () => {
        setAttachment(null);
    }
    return (
        <form onSubmit={onSubmit}>
            <input
                value={text}
                onChange={onChange}
                type={"text"}
                placeholder={"What's on your mind?"}
                maxLength={120}
            />
            <input type={"file"} accept={"image/*"} onChange={onFileChange}/>
            <input type={"submit"} value={"twitter"}/>
            {attachment && (
                <div>
                    <img src={attachment} width={"50px"} height={"50px"} alt={"Upload"}/>
                    <button onClick={onClearAttachment}>Clear Image</button>
                </div>
            )}
        </form>
    )
}
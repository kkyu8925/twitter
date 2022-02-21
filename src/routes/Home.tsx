import React, {useEffect, useState} from "react";
import {dbService, storageService} from "../firebaseConfig";
import Tweet from "components/Tweet";
import {
    collection,
    getFirestore,
    onSnapshot,
    orderBy,
    query
} from 'firebase/firestore';
import {v4 as uuidv4} from 'uuid';
import User from "../models/User";

interface ISetTwitterDto {
    text: string;
    createdAt: number;
    createdId: string;
    imageUrl: string;
}

interface IGetTwitterDto extends ISetTwitterDto {
    id: string
}

export default function Home({userObj}: { userObj: User }) {
    const [text, setText] = useState<string>("");
    const [twitters, setTwitters] = useState<IGetTwitterDto[]>([]);
    const [attachment, setAttachment] = useState<any>("");

    useEffect(() => {
        const q = query(
            collection(getFirestore(), 'twitter'),
            orderBy('createdAt', "desc")
        );
        const getData = onSnapshot(q, querySnapshot => {
            const newArray: IGetTwitterDto[] = querySnapshot.docs.map(doc => {
                const twitter: IGetTwitterDto = {
                    text: doc.data().text,
                    createdAt: doc.data().createdAt,
                    createdId: doc.data().createdId,
                    id: doc.id,
                    imageUrl: doc.data().imageUrl
                };
                return twitter;
            });
            setTwitters(newArray);
        });

        return () => {
            getData();
        };
    }, []);

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
        const data: ISetTwitterDto = {
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
        <div>
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
            <div>
                {twitters.map(tweet => (
                    <Tweet
                        key={tweet.id}
                        tweet={tweet}
                        isOwner={tweet.createdId === userObj?.uid}
                    />
                ))}
            </div>
        </div>
    )
}
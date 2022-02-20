import React, {useEffect, useState} from "react";
import {dbService} from "../firebaseConfig";
import firebase from "firebase/compat";
import Tweet from "components/Tweet";
import {
    collection,
    getFirestore,
    onSnapshot,
    orderBy,
    query
} from 'firebase/firestore';


interface ISetTwitterDto {
    text: string;
    createdAt: number;
    createdId?: string
}

interface IGetTwitterDto extends ISetTwitterDto {
    id: string
}

export default function Home({userObj}: { userObj: firebase.User | null }) {
    const [text, setText] = useState<string>("");
    const [twitters, setTwitters] = useState<IGetTwitterDto[]>([]);

    // const getTwitters = async () => {
    //     const dbCollectionTwitter = await dbService.collection("twitter").get()
    //     dbCollectionTwitter.forEach((document) => {
    //             const twitter: getTwitterDto = {
    //                 text: document.data().text,
    //                 createdAt: document.data().createdAt,
    //                 createdId: document.data().createdId,
    //                 id: document.id
    //             }
    //             setTwitters((twitters) => [twitter, ...twitters])
    //         }
    //     )
    // }

    // useEffect(() => {
    //     // getTwitters().then();
    //     dbService.collection("twitter").onSnapshot(snapshot => {
    //         snapshot.docs.map((document) => {
    //             console.log(document)
    //             const twitter: getTwitterDto = {
    //                 text: document.data().text,
    //                 createdAt: document.data().createdAt,
    //                 createdId: document.data().createdId,
    //                 id: document.id
    //             }
    //             setTwitters((twitters: getTwitterDto[]) => [twitter, ...twitters])
    //         })
    //     })
    // }, [])

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
                    id: doc.id
                };
                return twitter;
            });
            setTwitters(newArray);
        });

        return () => {
            getData();
        };
    }, []);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data: ISetTwitterDto = {
            text: text,
            createdAt: Date.now(),
            createdId: userObj?.uid
        }
        await dbService.collection("twitter").add(data)
        setText("")
    };
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setText(value);
    };

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
                <input type={"submit"} value={"twitter"}/>
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
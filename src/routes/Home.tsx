import React, {useEffect, useState} from "react";
import Tweet from "components/Tweet";
import {
    collection,
    getFirestore,
    onSnapshot,
    orderBy,
    query
} from 'firebase/firestore';
import {TUser} from "models/User";
import {TGetTweet} from "models/Tweet";
import TweetForm from "components/TweetForm";

export default function Home({userObj}: { userObj: TUser }) {
    const [twitters, setTwitters] = useState<TGetTweet[]>([]);

    useEffect(() => {
        const q = query(
            collection(getFirestore(), 'twitter'),
            orderBy('createdAt', "desc")
        );
        const getData = onSnapshot(q, querySnapshot => {
            const newArray: TGetTweet[] = querySnapshot.docs.map(doc => {
                const twitter: TGetTweet = {
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

    return (
        <div>
            <TweetForm userObj={userObj}/>
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
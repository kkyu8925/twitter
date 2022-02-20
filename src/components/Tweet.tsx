import React, {useState} from "react";
import {dbService} from "../firebaseConfig";

interface ITweet {
    text: string;
    createdAt: number;
    createdId?: string;
    id: string;
}

export default function Tweet({tweet, isOwner}: { tweet: ITweet, isOwner: boolean }) {
    const [editing, setEditing] = useState<boolean>(false);
    const [newTweetText, setNewTweetText] = useState<string>(tweet.text)

    const onDeleteClick = async () => {
        const flag = window.confirm("Are you sure you want to delete this tweet?");
        if (flag) {
            await dbService.doc(`twitter/${tweet.id}`).delete().then();
        }
    }
    const toggleEditing = () => setEditing((prev) => !prev)
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await dbService.doc(`twitter/${tweet.id}`).update({
            text: newTweetText,
        });
        setEditing(false);
    };
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {target: {value}} = e;
        setNewTweetText(value);
    };

    return (
        <div>
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            placeholder="Edit your Tweet"
                            value={newTweetText}
                            required
                            onChange={onChange}
                        />
                        <input type="submit" value="Update Tweet"/>
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>
            ) : (
                <>
                    <h4>{tweet.text}</h4>
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>Delete</button>
                            <button onClick={toggleEditing}>Edit</button>
                        </>
                    )}
                </>
            )}
        </div>
    )
};
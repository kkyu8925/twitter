export type TSetTweet = {
    text: string;
    createdAt: number;
    createdId: string;
    imageUrl: string;
};

export type TGetTweet = TSetTweet & {
    id: string;
};
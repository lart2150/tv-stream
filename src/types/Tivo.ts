export type Recording = {
    episodic : boolean;
    shortTitle : string;
    subtitle : string;
    description: string;

    seasonNumber : number;


    collectionTitle : string;
    episodeNum : string[];
    bodyId : string;
    collectionId : string;
    recordingId : string;
    contentId : string;

    actualStartTime : string;
    actualEndTime : string;

};

export type MyShows = {
    isTop : boolean;
    recording : Recording[];
    type : string;
    IsFinal : boolean;
    isBottom : boolean;
}
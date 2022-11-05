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

export type Channel = {
    affiliate: string;
    callSign: string;
    channelId: string;
    channelNumber: string;
    isKidZone: boolean;
    isReceived: boolean;
    name: string;
    sourceType: string;
    stationId: string;
    isDigital ?: boolean;
    logoIndex ?: number;
    isBlocked: boolean;
    objectIdAndType: string;
    isHdtv: boolean;
    isEntitled: boolean;
    videoResolution: string;
    type: string;
    stbChannelId: string;
}
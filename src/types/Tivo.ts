import exp from "constants";

export type Recording = {
    episodic : boolean;
    isNew : boolean;
    shortTitle : string;
    subtitle : string;
    description : string;
    seasonNumber : number;

    collectionTitle : string;
    episodeNum ?: string[];
    bodyId : string;
    collectionId : string;
    recordingId : string;
    contentId : string;
    originalAirdate : string;
    isEpisode : boolean;

    duration : number;
    hdtv : boolean;
    size : number;

    actualStartTime : string;
    actualEndTime : string;
    scheduledStartTime : string;
    scheduledEndTime : string;
    startTime : string;

    drm : {
        cgms : string;
        mrsPlaybackPolicy : string;
        multiRoomStream : boolean;
        multiRoomView : boolean;
        recordingPlaybackPolicy : string;
        tivoToGo : boolean;
        type : string;
    };
};

export type MyShows = {
    isTop : boolean;
    recording : Recording[];
    type : string;
    IsFinal : boolean;
    isBottom : boolean;
};

export type Channel = {
    affiliate : string;
    callSign : string;
    channelId : string;
    channelNumber : string;
    isKidZone : boolean;
    isReceived : boolean;
    name : string;
    sourceType : string;
    stationId : string;
    isDigital ?: boolean;
    logoIndex ?: number;
    isBlocked : boolean;
    objectIdAndType : string;
    isHdtv : boolean;
    isEntitled : boolean;
    videoResolution : string;
    type : string;
    stbChannelId : string;
};

export type Offer = {
    cc: boolean;
    channel: Channel;
    collectionId: string;
    collectionType: string;
    contentId: string;
    duration: number;
    episodic: boolean;
    isEpisode: boolean;
    offerId: string;
    startTime: string;
    subtitle: string;
    title: string;
    internalRating: [
        {
            ratingTypeId: string;
            type: string;
            ratingValueId: string;
        }
    ],
    isNew: boolean;
    type: "offer",
    videoResolution: 'hd' | 'sd';
}

export type GridRow = {
    channel: Channel;
    offer?: Offer[];
}
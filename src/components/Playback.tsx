import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import VideoJS from './VideoJS';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import type {TransitionProps} from '@mui/material/transitions';
import Typography from '@mui/material/Typography';
import {forwardRef, useContext, useEffect, useState} from 'react';
import type {ReactElement, Ref} from 'react';
import type videojs from 'video.js';
import {tivoContext} from './TivoContext';
import type {MyShows, Recording} from '@/types/Tivo';
import {useFetch} from '@/util/api';
import { ErrorModal } from './ErrorModal';

type Props = {
    openState : boolean;
    close : () => void;
    recording : Recording | null;
};

type Stream = {
    hlsSession : {
        clientUuid : string;
        hlsSessionId : string;
        playlistUri : string;
        type : string;
        isLocal : boolean;
    };
    errorCode : string | undefined;

    type : string;
    IsFinal : boolean;
};

const Transition = forwardRef(function Transition(
    props : TransitionProps & {
        children : ReactElement;
    },
    ref : Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props}/>;
});

const Playback = ({openState, close, recording} : Props) : JSX.Element => {
    const [stream, setStream] = useState<Stream | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const fetch = useFetch();
    const context = useContext(tivoContext);

    const clearSession = async (hlsSessionId : string) => {
        return await fetch(`/stream/stop/${encodeURIComponent(hlsSessionId)}`);
    };

    const getSession = async (recordingId : string) => {
        if (stream && stream.hlsSession.hlsSessionId) {
            clearSession(stream.hlsSession.hlsSessionId);
        }

        const rsp = await fetch(`/stream/start/${encodeURIComponent(recordingId)}`);
        const strm = await rsp.json();
        return strm;
    };

    const closeWindow = () => {
        if (stream && stream.hlsSession?.hlsSessionId) {
            clearSession(stream.hlsSession.hlsSessionId);
        }

        setStream(null);
        close();
    };

    useEffect(() => {
        if (recording?.recordingId) {
            getSession(recording.recordingId).then(newStream => {
                console.log('setStream');
                setStream(newStream);
            }).catch(e => {
                setErrorMessage('error starting stream');
            })
        }

        return () => {
            if (!stream || !stream.hlsSession.hlsSessionId) {
                console.log('skipping unmount clear');
                return;
            }

            clearSession(stream.hlsSession.hlsSessionId);
        };
    }, [recording]);

    if (!recording) {
        return <></>;
    }

    const episode = recording.episodeNum !== undefined ? `S${recording.seasonNumber} E${recording.episodeNum.join(',')} ` : '';
    const secondary = `${episode}${recording.subtitle}`;
    return (
        <Dialog
            fullScreen
            open={openState}
            onClose={closeWindow}
            TransitionComponent={Transition}
        >
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={closeWindow}
                        aria-label="close"
                    >
                        <CloseIcon/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                        {recording.shortTitle}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg">
                <Typography variant="h3">{recording.shortTitle} {episode} - {secondary}</Typography>
                {stream && stream.hlsSession?.playlistUri && (
                    <>
                        <VideoJS
                            options={{
                                controls: true,
                                preload: 'auto',
                                autoplay: true,
                                sources: [{
                                    src: `${(context?.apiBaseUrl ?? '') + stream.hlsSession.playlistUri}`,
                                    type: 'application/x-mpegURL',
                                }],
                                playbackRates: [
                                    0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5,
                                ],
                                liveui: true,
                                userActions: {
                                    hotkeys: function (event) {
                                        console.log('this', this);
                                        const player = this as videojs.Player;

                                        switch (event.code) {
                                            case 'space':
                                                player.pause();
                                                break;
                                            case 'ArrowLeft':
                                                player.currentTime(player.currentTime() - 30);
                                                break;
                                            case 'ArrowRight':
                                                player.currentTime(player.currentTime() + 30);
                                                break;
                                        }

                                        console.log('which', event.which);
                                        console.log('event', event);
                                    },
                                },
                            }}
                        />
                    </>)}
                {stream && stream.errorCode === undefined && (
                    <>
                        <span>{stream.errorCode}</span>
                    </>
                )}
                <Typography>{recording.description}</Typography>
                <Button
                    variant="contained"
                    onClick={closeWindow}
                >Close</Button>

            </Container>
            <ErrorModal 
                message={errorMessage}
                handleClose={() => {setErrorMessage(undefined)}}
                />
        </Dialog>
    );
};

export default Playback;

import Typography from '@mui/material/Typography';
import { forwardRef, ReactElement, Ref, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

import type { MyShows, Recording } from '@/types/Tivo';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import type { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import VideoJS from './VideoJS';
import Container from '@mui/material/Container';
import { useFetch } from '@/util/api';

type Props = {
    openState : boolean;
    close : () => void;
    recording : Recording | null;
}

type Stream = {
    hlsSession: {
        clientUuid : string;
        hlsSessionId : string;
        playlistUri : string;
        type : string;
        isLocal : boolean;
    }
    errorCode : string|undefined;

    type : string;
    IsFinal : boolean;
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
      children: ReactElement;
    },
    ref: Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const Playback = ({openState, close, recording} : Props) : JSX.Element => {
    const [stream, setStream] = useState<Stream|null>(null);
    const fetch = useFetch();

        
    const clearSession = async (hlsSessionId : string) => {
        return await fetch(`/stream/stop/${encodeURIComponent(hlsSessionId)}`);
    }

    const getSession = async (recordingId : string) => {
        if (stream && stream.hlsSession?.hlsSessionId) {
            clearSession(stream.hlsSession?.hlsSessionId);
        }
        const rsp = await fetch(`/stream/start/${encodeURIComponent(recordingId)}`)
        const strm = await rsp.json();
        return strm;
    }

    const closeWindow = () => {
        if (stream && stream.hlsSession?.hlsSessionId) {
            clearSession(stream.hlsSession?.hlsSessionId);
        }
        setStream(null);
        close();
    }

    useEffect(() => {
        if (recording?.recordingId) {
            getSession(recording?.recordingId).then((newStream) => {
                setStream(newStream);
            });
        }
        return () => {
            if (!stream || !stream.hlsSession?.hlsSessionId) {
                console.log('skipping unmount clear');
                return;
            }
            clearSession(stream.hlsSession?.hlsSessionId);
          }
    }, [recording]);
    if (!recording) {
        return <></>;
    }
    const episode = recording.episodeNum?.length > 0 ? `S${recording.seasonNumber} E${recording.episodeNum.join(',')} ` : ``;
    const secondary = `${episode}${recording.subtitle}`;
    return (
        <Dialog
        fullScreen
        open={openState}
        onClose={closeWindow}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={closeWindow}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {recording?.shortTitle}
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg">
            <Typography variant="h3">{recording?.shortTitle} {episode} - {secondary}</Typography>
            {stream && stream.hlsSession?.playlistUri && (
                <>
                <VideoJS
                    options={{
                        controls: true,
                        preload: 'auto',
                        autoplay: true,
                        sources : [{
                            src: `${stream.hlsSession.playlistUri}`,
                            type: 'application/x-mpegURL'
                        }]
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
      </Dialog>
    );
};


export default Playback;
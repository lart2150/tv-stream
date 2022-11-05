import Typography from '@mui/material/Typography';
import { forwardRef, ReactElement, Ref, useContext, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

import type { Channel } from '@/types/Tivo';
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
import { tivoContext } from './TivoContext';
import type videojs from 'video.js';

type Props = {
    openState : boolean;
    close : () => void;
    channel : Channel | null;
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

const ChannelComponent = ({openState, close, channel} : Props) : JSX.Element => {
    const [stream, setStream] = useState<Stream|null>(null);
    const fetch = useFetch();
    const context = useContext(tivoContext);

        
    const clearSession = async (hlsSessionId : string) => {
        return await fetch(`/stream/stop/${encodeURIComponent(hlsSessionId)}`);
    }

    const getSession = async (stbChannelId : string) => {
        if (stream && stream.hlsSession?.hlsSessionId) {
            clearSession(stream.hlsSession?.hlsSessionId);
        }
        const rsp = await fetch(`/stream/startChannel/${encodeURIComponent(stbChannelId)}`)
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
        if (channel?.stbChannelId) {
            getSession(channel?.stbChannelId).then(async (newStream) => {
                await new Promise(r => setTimeout(r, 2000));
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
    }, [channel]);
    if (!channel) {
        return <></>;
    }
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
              {channel.affiliate}
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg">
            {stream && stream.hlsSession?.playlistUri && (
                <>
                <VideoJS
                    options={{
                        controls: true,
                        preload: 'auto',
                        autoplay: true,
                        sources : [{
                            src: `${(context?.apiBaseUrl ?? '') + stream.hlsSession.playlistUri}`,
                            type: 'application/x-mpegURL'
                        }],
                        playbackRates: [
                            0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5
                        ],
                    }}
                />
            </>)}
            {stream && stream.errorCode === undefined && (
                <>
                    <span>{stream.errorCode}</span>
                </>
            )}
            <Button 
                variant="contained"
                onClick={closeWindow}
            >Close</Button>

        </Container>
      </Dialog>
    );
};


export default ChannelComponent;
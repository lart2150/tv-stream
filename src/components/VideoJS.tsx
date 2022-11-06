import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

type Props = {
    options : videojs.PlayerOptions;
    onReady ?: (player : videojs.Player) => void;
};

export const VideoJS = (props : Props) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const playerRef = React.useRef<videojs.Player | null>(null);
    const {options, onReady} = props;

    React.useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef.current) {
            const videoElement = videoRef.current;

            if (!videoElement) return;

            const player = playerRef.current = videojs(videoElement, options, () => {
                videojs.log('player is ready');
                onReady && onReady(player);
            });

            // You could update an existing player in the `else` block here
            // on prop change, for example:
        } else {
            // const player = playerRef.current;

            // player.autoplay(options.autoplay);
            // player.src(options.sources);
        }
    }, [options, videoRef]);

    // Dispose the Video.js player when the functional component unmounts
    React.useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return (
        <div data-vjs-player>
            <video
                ref={videoRef}
                style={{
                    width: '100%',
                }}
                className='video-js vjs-big-play-centered'
            />
        </div>
    );
};

export default VideoJS;

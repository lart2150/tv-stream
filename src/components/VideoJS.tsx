import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import seekButtons from 'videojs-seek-buttons';
import 'video.js/dist/video-js.css';

type Props = {
    options : videojs.PlayerOptions;
    onReady ?: (player : videojs.Player) => void;
};

const VideoJS = (props : Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<videojs.Player | null>(null);
    const {options, onReady} = props;

    useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef.current) {
            const videoElement = videoRef.current;

            if (!videoElement) return;

            const player = playerRef.current = videojs(videoElement, options, () => {
                videojs.log('player is ready');
                onReady && onReady(player);
            });

            if (options.liveui) {
              player.seekButtons({
                forward: 30,
                back: 10
              })
            }
        } else {
            // const player = playerRef.current;

            // player.autoplay(options.autoplay);
            // player.src(options.sources);
        }
    }, [options, videoRef]);

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
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
                className='video-js vjs-big-play-centered vjs-fluid'
            />
        </div>
    );
};

export default VideoJS;

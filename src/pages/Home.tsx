import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import type { Recording } from '@/types/Tivo';
import { useFetch } from '@/util/api';
import { lazy, useEffect, useState, Suspense} from 'react';

const Playback = lazy(() => import('@/components/Playback'));

const Home = () : JSX.Element => {
    const [recordings, setRecordings] = useState<Recording[]>([]);
    const [selectedRecording, setSelectedRecording] = useState<Recording|null>(null);
    const fetch = useFetch();

    useEffect(() => {
        fetch('/getMyShows?limit=50&tivo=Bolt&offset=0').then(async (rec) => {
            setRecordings(await rec.json());
        });
    },[]);

    useEffect(() => {
        console.log('selectedRecording', selectedRecording);
    }, [selectedRecording]);

    return (
        <>
            <Typography variant="h6">Home</Typography>
            <List>
                {recordings.map((recording) => {
                    const episode = recording.episodeNum?.length > 0 ? `S${recording.seasonNumber} E${recording.episodeNum.join(',')} ` : ``;
                    const secondary = `${episode}${recording.subtitle}`;
                    return <ListItem disablePadding key={recording.recordingId}>
                            <ListItemButton 
                                onClick={() => {
                                    console.log('recording', recording);
                                    setSelectedRecording(recording);
                                }}
                            >
                                <ListItemText 
                                    primary={recording.collectionTitle} 
                                    secondary={secondary}
                                />
                            </ListItemButton>
                        </ListItem>
                })}
            </List>
            <Suspense fallback={<div>Loading...</div>}>
                <Playback
                    openState={selectedRecording !== null}
                    close={() => {setSelectedRecording(null)}}
                    recording={selectedRecording}
                />
            </Suspense>
        </>
    );
};

export default Home;

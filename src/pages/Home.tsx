import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Box, Tabs, Tab, Chip} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Container from '@mui/system/Container';
import {lazy, useEffect, useState, Suspense} from 'react';
import type {Channel, Recording} from '@/types/Tivo';
import {useFetch} from '@/util/api';

const Playback = lazy(async () => import('@/components/Playback'));
const ChannelComponent = lazy(async () => import('@/components/ChannelComponent'));

type TabPanelProps = {
    children ?: React.ReactNode;
    index : number;
    value : number;
};

function TabPanel(props : TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const Home = () : JSX.Element => {
    const [recordings, setRecordings] = useState<Recording[]>([]);
    const [uniqueCollections, setUniqueCollections] = useState<Recording[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [tab, setTab] = useState<number>(0);
    const fetch = useFetch();

    const changeTab = (event : React.SyntheticEvent, newValue : number) => {
        setSelectedChannel(null);
        setSelectedRecording(null);
        setTab(newValue);
    };

    useEffect(() => {
        fetch('/getMyShows').then(async rec => {
            const rawRecordings = await rec.json() as Recording[];
            setUniqueCollections(rawRecordings.filter((r, i) => rawRecordings.findIndex(or => or.collectionId === r.collectionId) === i));
            setRecordings(rawRecordings);
        });
        fetch('/getMyLineup').then(async rec => {
            const allChannels = await rec.json();
            const channelList = allChannels.channel as Channel[];
            setChannels(channelList.filter(c => c.isReceived));
        });
    }, []);

    return (
        <>
            <Container maxWidth="lg">
                <Typography variant="h6">Home</Typography>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs sx={{paddingX: 3}} value={tab} onChange={changeTab} aria-label="basic tabs example">
                        <Tab label="Recordings"/>
                        <Tab label="Channels"/>
                    </Tabs>
                </Box>
                <TabPanel value={tab} index={0}>

                    {uniqueCollections.map((c, i) => {
                        const collectionRecordings = recordings.filter(r => r.collectionId === c.collectionId).reverse();
                        const latestRecording = collectionRecordings.length
                            ? new Date(collectionRecordings[0].actualStartTime).toLocaleDateString()
                            : '';
                        return <Accordion key={c.collectionId}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Chip sx={{mr: 1}} label={collectionRecordings.length}/>
                                <Typography>{c.collectionTitle} {latestRecording}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List>
                                    {collectionRecordings.map(recording => {
                                        const recordingStart = new Date(recording.scheduledStartTime).toLocaleString();
                                        const episode = recording.episodeNum?.length !== undefined ? `S${recording.seasonNumber} E${recording.episodeNum.join(',')} ` : '';
                                        const secondary = `${episode}${recording.subtitle}`;
                                        return <ListItem disablePadding key={recording.recordingId}>
                                            <ListItemButton
                                                onClick={() => {
                                                    console.log('recording', recording);
                                                    setSelectedRecording(recording);
                                                }}
                                            >
                                                <ListItemText
                                                    primary={recordingStart}
                                                    secondary={secondary}
                                                />
                                            </ListItemButton>
                                        </ListItem>;
                                    })}
                                </List>
                            </AccordionDetails>
                        </Accordion>;
                    })}
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    <List>
                        {channels.map(channel => {
                            return <ListItem disablePadding key={channel.stbChannelId}>
                                <ListItemButton
                                    onClick={() => {
                                        console.log('channel', channel);
                                        setSelectedChannel(channel);
                                    }}
                                >
                                    <ListItemText
                                        primary={channel.channelNumber + ' ' + channel.callSign}
                                        secondary={channel.affiliate}
                                    />
                                </ListItemButton>
                            </ListItem>;
                        })}
                    </List>
                </TabPanel>
            </Container>
            <Suspense fallback={<div></div>}>
                <Playback
                    openState={selectedRecording !== null}
                    close={() => {
                        setSelectedRecording(null);
                    }}
                    recording={selectedRecording}
                />
            </Suspense>
            <Suspense fallback={<div></div>}>
                <ChannelComponent
                    openState={selectedChannel !== null}
                    close={() => {
                        setSelectedChannel(null);
                    }}
                    channel={selectedChannel}
                />
            </Suspense>

        </>
    );
};

export default Home;

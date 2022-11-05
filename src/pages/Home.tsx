import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import type { Channel, Recording } from '@/types/Tivo';
import { useFetch } from '@/util/api';
import { lazy, useEffect, useState, Suspense} from 'react';
import { Box, Tabs, Tab} from '@mui/material';

const Playback = lazy(() => import('@/components/Playback'));
const ChannelComponent = lazy(() => import('@/components/ChannelComponent'));

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

const Home = () : JSX.Element => {
    const [recordings, setRecordings] = useState<Recording[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [selectedRecording, setSelectedRecording] = useState<Recording|null>(null);
    const [selectedChannel, setSelectedChannel] = useState<Channel|null>(null);
    const [tab, setTab] = useState<number>(0);
    const fetch = useFetch();

    const changeTab = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedChannel(null);
        setSelectedRecording(null);
        setTab(newValue);
    };

    useEffect(() => {
        fetch('/getMyShows').then(async (rec) => {
            setRecordings(await rec.json());
        });
        fetch('/getMyLineup').then(async (rec) => {
            const allChannels = await rec.json();
            const channelList = allChannels.channel as Channel[];
            setChannels(channelList.filter((c) => c.isReceived));
            console.log('channels', channelList.filter((c) => c.isReceived));
        });
    },[]);

    useEffect(() => {
        console.log('selectedRecording', selectedRecording);
    }, [selectedRecording]);

    return (
        <>
            <Typography variant="h6">Home</Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs sx={{paddingX: 3}} value={tab} onChange={changeTab} aria-label="basic tabs example">
                <Tab label="Recordings"/>
                <Tab label="Channels"/>
            </Tabs>
            </Box>
            <TabPanel value={tab} index={0}>
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
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <List>
                    {channels.map((channel) => {
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
                            </ListItem>
                    })}
                </List>
            </TabPanel>
            <Suspense fallback={<div>Loading...</div>}>
                <Playback
                    openState={selectedRecording !== null}
                    close={() => {setSelectedRecording(null)}}
                    recording={selectedRecording}
                />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
                <ChannelComponent
                    openState={selectedChannel !== null}
                    close={() => {setSelectedChannel(null)}}
                    channel={selectedChannel}
                />
            </Suspense>
            
        </>
    );
};

export default Home;

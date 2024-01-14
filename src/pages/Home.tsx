import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Box, Tabs, Tab, Chip, CardMedia, Card, CardContent, Grid, Link} from '@mui/material';
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
import type {Channel, GridRow, Offer, Recording} from '@/types/Tivo';
import {useFetch} from '@/util/api';
import { useQuery } from 'react-query';

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
    const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [tab, setTab] = useState<number>(0);
    const fetch = useFetch();

    const { isLoading, error, data: guideData } = useQuery<GridRow[]>('repoData', () =>
        fetch('/gridSearch').then(async rec => (await rec.json()).gridRow)
    );

    console.log('guideData', guideData);

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
                        {guideData && guideData.map(guideRow => {
                            const firstOffer : Offer = guideRow.offer && guideRow.offer.length ? guideRow.offer[0] : {
                                cc: false,
                                channel: guideRow.channel,
                                collectionId: '123',
                                collectionType: 'string',
                                contentId: '123',
                                duration: 600, 
                                episodic: false,
                                isEpisode: false,
                                offerId: '123',
                                startTime: new Date().toISOString().replace('Z', ''),
                                subtitle: 'Missing',
                                title: 'No Show',
                                internalRating: [        {
                                    ratingTypeId: 'a',
                                    type: 'a',
                                    ratingValueId: 'a',
                                }],
                                isNew: false,
                                type: "offer",
                                videoResolution: 'sd',
                            };
                            const start = new Date(firstOffer.startTime + "z");
                            const end = new Date((start.valueOf()) + (firstOffer.duration ?? 1 * 1000));
                            return <Card sx={{ m: 1}}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={8}>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {guideRow.channel.channelNumber + ' ' + guideRow.channel.callSign}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <p>{firstOffer.title + " Until " + end.toLocaleTimeString()}</p>
                                                <p>{firstOffer.subtitle}</p>
                                            </Typography>
                                            <Link 
                                                onClick={() => {
                                                    setSelectedChannel(guideRow.channel);
                                                }}
                                                href="#">
                                                Watch Now
                                            </Link>
                                        </CardContent>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <img 
                                            style={{maxHeight: '150px'}}
                                            src={`http://i.tivo.com/images-production/images/${firstOffer.contentId}/episodeBanner_544x306?fallbackPolicy=episodeToSeries`}
                                        />
                                    </Grid>
                                </Grid>
                            </Card>
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

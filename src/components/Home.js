import React from "react"
import { Button, Tab, Tabs, Box, Stack, Paper, TextField, CircularProgress, IconButton, Divider } from "@mui/material"
import { useNavigate, useSearchParams } from "react-router-dom"

import { set, ref, onValue, get, off } from "firebase/database"
import { db_context } from "../App"
import ShareIcon from '@mui/icons-material/Share';
import Header from "./Header" 


export const HomeMain = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [curTab, setCurTab] = React.useState(searchParams.get('joinRoomId') ? 1 : 0);

    return (
        <Box>
            <Header />
            <Paper elevation={5} sx={{ width:'fit-content', margin:'2rem auto', p:2, transition:'all 2s'}}>
                <Tabs sx={{marginBottom:2}} value={curTab} onChange={() => setCurTab(1 - curTab)} centered>
                    <Tab label="CREATE Room" />
                    <Tab label="JOIN Room" />
                </Tabs>
                {
                    curTab == 0 && <CreateRoomBox />
                }
                {
                    curTab == 1 && <JoinRoomBox roomId={searchParams.get('joinRoomId')} />
                }

            </Paper>
        </Box>


    )
}

const CreateRoomBox = () => {

    const [roomId, setRoomId] = React.useState(".....")
    const [wait, setWait] = React.useState(false);

    const db = React.useContext(db_context);

    const navigate = useNavigate()

    const getRoom = () => {
        var newRoomId = parseInt(Date.now() / 100).toString(36).toUpperCase();
        setRoomId(newRoomId);
        set(ref(db, `/rooms/${newRoomId}`),
            {
                0: (document.getElementById("name_0_txt").value || "Buddy1").toUpperCase(),
                strikes: JSON.stringify([])
            });
        setWait(true)
        onValue(ref(db, `/rooms/${newRoomId}/1`), (snap) => {
            if (snap.exists()) {
                navigate(`game/?p=0&roomId=${newRoomId}`);
                off(ref(db, `/rooms/${newRoomId}/1`));
            }
        })
    }

    const shareClick = () => {
        navigator.share({
            title: 'BOZ-BINGO Invite',
            text: `Let's play BOZ-BINGO`,
            url: `https://bozbingo.web.app/?joinRoomId=${roomId}`
        })
    }


    return (
        <div>
            <Stack alignItems={'center'} spacing={2}>
                <TextField id="name_0_txt" label="Your Name" variant="standard" />
                <Button variant={'contained'} onClick={getRoom}>Get Room</Button>
                <Stack direction={'row'}>
                    <Paper variant="outlined" sx={{ padding: 1, alignItems: 'center', fontWeight: 'bold' }}>{roomId}
                        {roomId != "....." && <IconButton onClick={shareClick}><ShareIcon /></IconButton>}
                    </Paper>

                </Stack>

                {wait &&
                    <Stack alignItems={'center'}><CircularProgress /> Waiting for opponent</Stack>
                }
            </Stack>
        </div>
    )
}

const JoinRoomBox = ({ roomId }) => {

    const db = React.useContext(db_context);

    const [roomError, setRoomError] = React.useState(false);

    const navigate = useNavigate();

    const joinRoom = () => {
        var roomId = document.getElementById("room_id_text").value;

        get(ref(db, `/rooms/${roomId}`)).then(snap => {
            if (!snap.exists())
                setRoomError(true);
            else {
                setRoomError(false);
                set(ref(db, `/rooms/${roomId}/1`), (document.getElementById("name_1_txt").value || "Buddy2")).toUpperCase();
                navigate(`game/?p=1&roomId=${roomId}`);
            }
        })
    }

    return (
        <div>
            <Stack alignItems={'center'} spacing={2}>
                <TextField id="name_1_txt" label="Your Name" variant="standard" />
                <TextField value={roomId} id="room_id_text" error={roomError} label="Room ID" variant="standard" helperText={roomError ? "Invalid Room ID" : ""} />
                <Button variant={'contained'} onClick={joinRoom}>Join</Button>
            </Stack>
        </div>
    )
}
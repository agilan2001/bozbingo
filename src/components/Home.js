import React from "react"
import { Button, Tab, Tabs, Box, Stack, Paper, TextField, CircularProgress} from "@mui/material"
import { useNavigate } from "react-router-dom"

import {set, ref, onValue, get, off } from "firebase/database"
import { db_context } from "../App"


export const HomeMain = ()=>{
    const [curTab, setCurTab] = React.useState(0)
    
    return(
        <Box maxWidth={600} m={'auto'}>
            <Tabs value={curTab} onChange={()=>setCurTab(1-curTab)} centered>
                <Tab label="CREATE Room"/>
                <Tab label="JOIN Room"/>
            </Tabs>
            {
                curTab==0 && <CreateRoomBox/>
            }
            {
                curTab==1 && <JoinRoomBox/>
            }

        </Box>

        
    )
}

const CreateRoomBox = ()=>{

    const [roomId, setRoomId] = React.useState(".....")
    const [wait, setWait] = React.useState(false);

    const db = React.useContext(db_context);

    const navigate = useNavigate()

    const getRoom = ()=>{
        var newRoomId = parseInt(Date.now()/100).toString(36).toUpperCase();
        setRoomId(newRoomId);
        set(ref(db,`/rooms/${newRoomId}`), 
            {
                0: document.getElementById("name_0_txt").value || "Buddy1",
                strikes: JSON.stringify([])
            });
        setWait(true)
        onValue(ref(db,`/rooms/${newRoomId}/1`), (snap)=>{
            if(snap.exists()){
                navigate(`game/?p=0&roomId=${newRoomId}`);
                off(ref(db,`/rooms/${newRoomId}/1`));
            }
        })
    }
    

    return (
        <div>
            <Stack alignItems={'center'} spacing={2}>
                <TextField id="name_0_txt" label = "Your Name" variant="standard" />
                <Button onClick={getRoom}>Get Room</Button>
                <Paper sx={{padding:1, alignItems:'center', fontWeight:'bold'}}>{roomId}</Paper>
                {wait && <div><CircularProgress/> Waiting for opponent</div>}
            </Stack>
        </div>
    )
}

const JoinRoomBox = ()=>{

    const db = React.useContext(db_context);

    const [roomError, setRoomError] = React.useState(false);

    const navigate = useNavigate();

    const joinRoom = ()=>{
        var roomId = document.getElementById("room_id_text").value;

        get(ref(db,`/rooms/${roomId}`)).then(snap=>{
            if(!snap.exists())
                setRoomError(true);
            else{
                setRoomError(false);
                set(ref(db,`/rooms/${roomId}/1`), document.getElementById("name_1_txt").value || "Buddy2");
                navigate(`game/?p=1&roomId=${roomId}`);
            }             
        })
    }

    return (
        <div>
            <Stack alignItems={'center'} spacing={2}>
                <TextField id="name_1_txt" label = "Your Name" variant="standard" />
                <TextField id="room_id_text" error={roomError} label = "Room ID" variant="standard" helperText={roomError?"Invalid Room ID":""} />
                <Button onClick={joinRoom}>Join</Button>
            </Stack>
        </div>
    )
}
import React from 'react';
import { Button, Grid, Paper, Stack } from '@mui/material'
import NumberButton from './NumberButton';
import { useSearchParams } from 'react-router-dom';

import { db_context } from '../App';
import { set, ref, get, onValue, off } from 'firebase/database';


export default () => {

    const db = React.useContext(db_context);

    const [boardValues, setBoardValues] = React.useState(random_5_5_value());
    const [strikeValues, setStrikeValues] = React.useState(new Array(25).fill(false)); // ---> Strike Positions
    const [combStrike, setCombStrike] = React.useState(new Array(12).fill(false));
    const [winner, setWinner] = React.useState(-1);
    const [details, setDetails] = React.useState({})
    // const [score, setScore] = React.useState(0);

    const [searchParams, setSearchParams] = useSearchParams();
    const strikesCnt = strikeValues.reduce((p, e, i) => (p + (e ? 1 : 0)), 0);
    

    const roomId = searchParams.get('roomId');
    const p = parseInt(searchParams.get('p')) // p=0 for creator , p=1 for joiner

    const isMyTurn = (strikesCnt %2) == p;

    const getScore = () => {
        return combStrike.reduce((p, e, i) => (p + (e ? 1 : 0)), 0);
    }

    React.useEffect(()=>{
        get(ref(db,`rooms/${roomId}`)).then(snap=>{
            var p_details = snap.val();
            var temp = {
                myName: p_details[p],
                oppName: p_details[1-p]
            }
            setDetails(temp);
        })

        
        onValue(ref(db, `rooms/${roomId}/strikes`),(snap)=>{
            var strikes = JSON.parse(snap.val());
            var l;
            if((l = strikes[strikes.length - 1]-100)>=0){
                setWinner(l);
                off(ref(db, `rooms/${roomId}/strikes`));
                return;
            }
            var newStrikeValues = new Array(25).fill(false);
            strikes.forEach((e,i)=>{
                newStrikeValues[boardValues.indexOf(e)] = true;
            })
            setStrikeValues(newStrikeValues);
        })
    
    },[])

    
    React.useEffect(() => {

        var newCombStrike = [...combStrike];
        var changed = false;
        // var score = 0;

        //check for horizontal strikes

        for (var i = 0; i < 5; i++) {
            if (strikeValues.slice(i * 5, (i + 1) * 5).every(e => e)) {
                // score ++;
                if (!newCombStrike[i]) {
                    console.log('changed')
                    changed = true;
                    newCombStrike[i] = true;
                }
            }
        }

        //check for vertical strikes
        for (var j = 0; j < 5; j++) {
            if (strikeValues.filter((e, i) => i % 5 == j).every(e => e)) {
                // score ++;
                if (!newCombStrike[j + 5]) {
                    changed = true;
                    newCombStrike[j + 5] = true;
                }
            }
        }

        //check for diagonals
        if ([strikeValues[0], strikeValues[6], strikeValues[12], strikeValues[18], strikeValues[24]].every(e => e)) {
            if (!newCombStrike[10]) {
                changed = true;
                newCombStrike[10] = true;
            }
        }

        if ([strikeValues[4], strikeValues[8], strikeValues[12], strikeValues[16], strikeValues[20]].every(e => e)) {
            if (!newCombStrike[11]) {
                changed = true;
                newCombStrike[11] = true;
            }
        }

        if (changed) {
            setCombStrike(newCombStrike);
        }

        var strikes = boardValues.filter((e,i)=>strikeValues[i]).sort();
        if(strikes.length){
            
            set(ref(db, `rooms/${roomId}/strikes`), JSON.stringify(strikes))

        }
        


    }, [strikeValues]);

    React.useEffect(() => {

    }, [combStrike])

    const numberButtonClickHandler = (i) => {
        return () => {
            if (!isMyTurn || strikeValues[i] || winner!=-1) return;
            var newStrikeValues = [...strikeValues];
            newStrikeValues[i] = true;
            setStrikeValues(newStrikeValues);
            
        }
    }

    const bozClick = ()=>{
        set(ref(db, `rooms/${roomId}/strikes`), JSON.stringify([100+p]));
    }

    return (
        <Stack spacing={3} sx={{ maxWidth: '500px', margin: 'auto' }}>
            <Stack direction={'row'} spacing={3}>
                <Grid container justifyContent="center" alignItems="center" spacing={1}>
                    {
                        [0, 1, 2, 3, 4].map((e, i) => (
                            <Grid key={i} container item justifyContent="space-between" alignItems="center" spacing={1}>
                                {
                                    boardValues.slice(i * 5, (i + 1) * 5).map((ei, ii) => (
                                        <Grid key={i * 5 + ii} item xs={2}>
                                            <NumberButton value={ei} strikeValue={strikeValues[i * 5 + ii]} onClick={numberButtonClickHandler(i * 5 + ii)} />
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        ))
                    }
                </Grid>

                <Stack spacing={1}>
                    {[0,1,2,3,4].map((e,i)=>(
                        <Button key={100+i}  sx={{minWidth:0}} variant='contained' color={i >= getScore() ? 'secondary' : 'warning'}>{"BINGO".charAt(i)}</Button>
                    ))                          
                    }
                </Stack>
            </Stack>
            <Button variant={'contained'} disabled={getScore()<5 || winner!=-1} onClick={bozClick}>BOZ</Button>
            <Stack direction={'row'} justifyContent={'space-evenly'}>
                <Paper sx={{p:2, border:(winner==-1)?( isMyTurn?4:2):((winner==p)?4:2), borderColor:(winner==-1)?( isMyTurn?'blue':'black'):((winner==p)?'green':'black')}} variant={'outlined'}>{details.myName}</Paper>
                <Paper sx={{p:2, border:(winner==-1)?( isMyTurn?2:4):((winner==p)?2:4), borderColor:(winner==-1)?( isMyTurn?'black':'blue'):((winner==p)?'black':'green')}} variant={'outlined'}>{details.oppName}</Paper>
            </Stack>
        </Stack>

    )
}


function random_5_5_value() {

    var val = Array.from(new Array(25).keys(), x => x + 1).sort(() => 0.5 - Math.random());
    // var val = [];
    // for(var i = 0; i<5; i++){
    //   val = [...val, x.slice(i*5,(i+1)*5)];
    // }
    return val;
}

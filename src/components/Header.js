import { Paper, Stack } from "@mui/material"
export default () => (
    <Paper  elevation={5} sx={{background:'yellow', fontSize: '2rem', fontWeight: 'bold', width:'fit-content', p:2, m:'auto', border:'2px solid' }}>
        <div style={{border:'2px solid', marginBottom:'1rem', background:'orange'}}>BOZ</div>
        <Stack direction="row" justifyContent={'center'} spacing={1}>
            {'BINGO'.split('').map((e, i) => <span key={i} style={{ color: ['green', 'red', 'blue', 'steelblue', 'magenta'][i], border: '2px solid black  ', minWidth: '2.5rem' }}>{e}</span>)}
        </Stack>

    </Paper>
)
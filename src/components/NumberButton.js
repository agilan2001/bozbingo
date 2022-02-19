import {Button} from '@mui/material'

export default (props) => (
    <Button onClick={props.onClick} sx={{height:'3em', width:'3em', minWidth:0}} fullWidth variant="contained" color={props.strikeValue ? "success": "primary" }>{props.value}</Button>
)
  
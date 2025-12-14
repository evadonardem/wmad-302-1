import { Box, Typography,Checkbox  } from "@mui/material";
import { useState } from "react";
import PropTypes  from "prop-types";

function Order (props : any){

    const [selectedValue, setSelectedValue] = useState(0);
    
    //Was trying to change search filter for this, but I don't know cause I'm dumb
    const handleChange1 = () => {
        // setSelectedValue(selectedValue+ 1);
        // alert('A');
    };

    const handleChange2 = () => {
        setSelectedValue(selectedValue+ 1);
        alert('B');
    };
    if(props.view === 'sb'){
    return(
        <>
        <Box display ="flex" alignItems="center" sx={{ flex: 1, mx: 5 }}>
            <Checkbox
                onChange={handleChange1}
            /> <Typography>{props.name}</Typography>
        </Box>
        </>
    );
    }
    else if(props.view === 'B'){
        return(
        <>
        {alert('test')}
        </>
    );
    }
}
Order.propTypes = {
    name : PropTypes.string,
    view : PropTypes.string
}

export default Order
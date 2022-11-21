import React from 'react';
import {useTheme} from "@mui/material/styles";

function Footer(props) {
    const theme = useTheme();

    return (
        <div style={{backgroundColor: theme.palette.primary.dark}}>
            
        </div>
    );
}

export default Footer;
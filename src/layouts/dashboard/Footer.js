import React from 'react';
import {useTheme} from "@mui/material/styles";

function Footer(props) {
    const theme = useTheme();

    return (
        <div style={{backgroundColor: theme.palette.primary.dark}}>
            Footer WIP
        </div>
    );
}

export default Footer;
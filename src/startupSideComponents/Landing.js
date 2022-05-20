import React from 'react';
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import {Backdrop, CircularProgress} from "@mui/material";

function Landing(props) {

  const [spinner, setSpinner] = React.useState(true)

  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/business/analytics')
  }


  return (
      <div>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={spinner}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Box display='flex' flexGrow={1}>
            <h1 style={{color: "black", marginLeft: '20px'}}>Tryvest for Business</h1>
        </Box>

          <iframe className="airtable-embed airtable-dynamic-height" onLoad={() => setSpinner(false)}
                  src="https://airtable.com/embed/shrTxWeRwlAxyBwQ2?backgroundColor=cyan" frameBorder="0"
                  width="100%" height="1155.005682" style={{background: 'transparent', border: '1px solid #ccc'}}>

          </iframe>
          <Button  sx={{margin: '50px'}} variant='contained' size='large' disableElevation={true}
                   color='secondary' onClick={handleClick}>
            Go to Dashboard
          </Button>

      </div>
  );
}

export default Landing;
import React from 'react'
import Box from "@mui/material/Box";

function Card({title, color}) {

  return (
      <Box>
      <div className='card'>
        <div className='card__info'>
          <h3>{title}</h3>
        </div>
      </div>
      </Box>
  )
}

export default Card;
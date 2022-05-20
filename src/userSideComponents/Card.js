import React from 'react';
import './Card.css'
import {useNavigate} from "react-router-dom";

function Card({ src, title, description, terms, color, funding, founded, id}) {
  const navigate = useNavigate()

  return (
      <div className='card' style={{backgroundColor: color}} onClick={() => {navigate('/companies/' + id)}}>
        <div className="card__info">
          <h1>{title}</h1>
          <h3>{description}</h3>
          <div className='flexbox-container'>
            <h4>Founded in {founded}</h4>
            <h4 className='card__duration'>Capital raised: {funding}</h4>
          </div>
        </div>
      </div>
  )
}

export default Card
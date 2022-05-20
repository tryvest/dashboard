import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import Avatar from "./Avatar";
import LogIn from "./LogIn";

function Header() {
  const navigate = useNavigate()
  const currentUser = false //Placeholder for firebase auth

  return (
      <div className='header'>
        <div className='header__left'>
          <Link to="/" style={{textDecoration: "none"}}>
              <h1 style={{color: "black"}}>Tryvest</h1>
          </Link>
        </div>

        <div className='header__right'>
          {currentUser ?
              <Avatar /> :
              <LogIn/>
          }
        </div>
      </div>
  )
}

export default Header

import React, { useState} from 'react'
//import './LogIn.css'
import Dialog from '@mui/material/Dialog'
import Button from "@mui/material/Button";
import {Alert, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
//import {useAuth} from './contexts/AuthContext'
import {Link, useNavigate} from "react-router-dom";

export default function LogIn() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  //const { signup, login, currentUser } = useAuth()

  const [signUpOpen, setSignUpOpen] = React.useState(false)
  const [logInOpen, setLogInOpen] = React.useState(false)

  const handleClickOpen = () => {
    setEmail('')
    setPassword('')
    setPasswordConfirm('')
    setLogInOpen(true);
  };

  const handleClose = () => {
    setEmail('')
    setPassword('')
    setPasswordConfirm('')
    setLogInOpen(false);
    setSignUpOpen(false)
  };

  const signUpClick = () => {
    setEmail('')
    setPassword('')
    setPasswordConfirm('')
    setLogInOpen(false)
    setSignUpOpen(true)
  }

  const logInClick = () => {
    setEmail('')
    setPassword('')
    setPasswordConfirm('')
    setLogInOpen(true)
    setSignUpOpen(false)
  }

  async function handleSubmitSignUp(e) {
    e.preventDefault()

    if(password !== passwordConfirm) {
      return setError('Passwords do not match')
    }

    if(password.length < 7){
      return setError('Password is under 7 characters')
    }

    try {
      setError('')
      setLoading(true)
      //await signup(email, password)
      navigate('/dashboard')
      setSignUpOpen(false);
    } catch {
      setError('Failed to create an account')
    }

    setLoading(false)
  }

  async function handleSubmitLogIn(e) {
    e.preventDefault()
    try {
      setError('')
      setLoading(true)
      //await login(email, password)
      navigate('/dashboard')
      setLogInOpen(false);
    } catch {
      setError('Failed to log in')
    }

  }



  return (

      <div>
        <Button color='secondary' variant="outlined" onClick={handleClickOpen}>
          Log In
        </Button>


        <Dialog open={logInOpen} onClose={handleClose}>
          {error && <Alert severity="error">{error}</Alert>}
          <DialogTitle>Log In</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter an email and password.
            </DialogContentText>
            <TextField
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                autoFocus
                margin="dense"
                id="nameLogIn"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
            />
            <TextField
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                autoFocus
                margin="dense"
                id="passwordLogIn"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
            />

          </DialogContent>
          <DialogActions>
            <Button variant='contained' onClick={handleClose}>Cancel</Button>
            <Button variant='contained' onClick={handleSubmitLogIn}>Log In</Button>
          </DialogActions>
          <DialogContent>
            <div className="flexbox-container">
              <DialogContentText >
                Don't have an account? <Link to='#' component='button' onClick={signUpClick}>Sign Up</Link>
              </DialogContentText>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={signUpOpen} onClose={handleClose}>
          {error && <Alert severity="error">{error}</Alert>}
          <DialogTitle>Sign Up</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter an email and password.
            </DialogContentText>
            <TextField
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                autoFocus
                margin="dense"
                id="nameSignUp"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
            />
            <TextField
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                autoFocus
                margin="dense"
                id="passwordSignUp"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
            />
            <TextField
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                }}
                autoFocus
                margin="dense"
                id="passwordConfirmSignUp"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
            />

          </DialogContent>
          <DialogActions>
            <Button variant='contained' onClick={handleClose}>Cancel</Button>
            <Button variant='contained' onClick={handleSubmitSignUp}>Sign Up</Button>
          </DialogActions>
          <DialogContent>
            <div className="flexbox-container">
              <DialogContentText >
                Already have an account? <Link to='#' component='button' onClick={logInClick}>Log In</Link>
              </DialogContentText>
            </div>
          </DialogContent>
        </Dialog>

      </div>
  )
}
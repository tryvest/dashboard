import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, Field, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';

// material
import {
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  InputAdornment,
  Typography,
  Button
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
// eslint-disable-next-line import/no-duplicates
import Iconify from '../../../components/Iconify';
import {useAuth} from '../../../contexts/AuthContext'
import {fCurrency} from "../../../utils/formatNumber";

// ----------------------------------------------------------------------


export default function RegisterForm() {

  const { signup, currentUser } = useAuth()
  const theme = useTheme()
  const navigate = useNavigate();

  const [topics, setTopics] = useState([
    {name: 'Artificial Intelligence', chosen: false},
    {name: 'Social Media', chosen: false},
    {name: 'Dating', chosen: false},
    {name: 'OKR', chosen: false},
    {name: 'Fitness', chosen: false},
    {name: 'Gaming', chosen: false}
  ])
  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: ({firstName, lastName, email, password}) => {
      try {
        signup(email, password)

        console.log(currentUser.uid)
        const interests = []

        // eslint-disable-next-line no-plusplus
        for (let t = 0; t < topics.length; t++) {
          if(topics[t].chosen){
            interests.push(topics[t].name)
          }
        }

        const data = {
            uid: currentUser.uid,
            firstName,
            lastName,
            interests,
        }

        fetch('https://tryvest.us/api/tryvestors', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
              console.log('Success:', data);
            })
            .catch((error) => {
              console.error('Error:', error);
            });

      } catch {
        console.error('Error: Signup could not be completed');
      }

      navigate('/dashboard/app', { replace: true });
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />

          </Stack>

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <Typography variant='h5'>
            Which topics interest you?
          </Typography>

          { // <Stack direction="row" alignItems="center" justifyContent="space-between">
          }


            {
              // DISGUSTING CODE, ONLY TEMPORARY

              topics.map((topic, idx) => (
                <Button key={idx} variant='contained' sx={{
                  backgroundColor: topic.chosen ? theme.palette.topics[idx] : theme.palette.grey[300],
                  color: topic.chosen ? theme.palette.common.white : theme.palette.common.black,
                  margin: 1,
                  whiteSpace: 'nowrap',
                  borderRadius: 5,
                  fitContent: '100%',
                  disableRipple: true,
                  disableFocusRipple: true,
                  disableElevation: true,
                }} onClick={() => {setTopics(topics.map((t, i) => {
                  return i === idx ? {name: t.name, chosen: !t.chosen} : {name: t.name, chosen: t.chosen}
                }))}}>
                  {topic.name}
                </Button>
              ))
            }

          {// </Stack>
          }



          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} >
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}

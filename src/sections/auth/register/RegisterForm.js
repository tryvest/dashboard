import * as Yup from 'yup';
import {useEffect, useState} from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';

// material
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';

import { LoadingButton } from '@mui/lab';

import {browserLocalPersistence, createUserWithEmailAndPassword, setPersistence} from "firebase/auth";
import {useDispatch, useSelector} from "react-redux";
import { DayPicker } from "react-day-picker";
// import { format } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import { login } from '../../../features/userSlice';
import Iconify from '../../../components/Iconify';
import {apiTryvestors} from "../../../utils/api/api-tryvestors";
import { auth } from '../../../firebase'
import {TRYVESTOR} from "../../../UserTypes";
import 'react-day-picker/dist/style.css';
// ----------------------------------------------------------------------


const RegisterForm = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [topics, setTopics] = useState([])
  const [selected, setSelected] = useState(null)

  const css = `
  .my-selected:not([disabled]) { 
    font-weight: bold; 
    border: 2px solid currentColor;
  }
  .my-selected:hover:not([disabled]) { 
    border-color: #61D3A2;
    color: #61D3A2;
  }
`;

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
    onSubmit: ({email, password, firstName, lastName}) => {

      signUp({email, password, firstName, lastName, topics});
      navigate('/dashboard/overview', { replace: true });
    },
  });

  // const footer = <p>Please pick a day.</p>;
  /*  if (selected) {
    footer = <p>You picked {format(selected, 'yyyy-MM-dd')}.</p>;
  }
  */

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  const signUp = (creds) => {
    setPersistence(auth, browserLocalPersistence).then(() => {
      createUserWithEmailAndPassword(auth, creds.email, creds.password)
          .then(async (res) => {
            const userData = {
              UID: res.user.uid,
              firstName: creds.firstName,
              lastName: creds.lastName,
              username: creds.email,
              DOB: dayjs(selected.toString()).format('YYYY-MM-DD'), // Add dob field
            };

            await apiTryvestors.post(userData);
            console.log(userData)
            const payload = {
              userType: TRYVESTOR,
              uid: res.user.uid,
              data: userData,
            }
            dispatch(login(payload));
          })
          .catch((err) => {
            console.log('error signing up: ', err);
          });
    })
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
        <Typography variant="h6">
          Date of Birth
        </Typography>
        <style>{css}</style>
        <DatePicker dateFormat={"YYYY-MM-DD"} views={['day']} onChange={setSelected} value={selected} renderInput={props => <TextField {...props}/>}/>
        {/*
        <DayPicker
            mode="single"
            captionLayout="dropdown"
            fromYear={1970}
            toYear={2025}
            selected={selected}
            onSelect={setSelected}
            modifiersClassNames={{
              selected: 'my-selected',
            }}
            // footer={footer}
        />
        */}
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} >
          Register
        </LoadingButton>
      </Stack>
    </Form>
  </FormikProvider>
    </LocalizationProvider>
  );
}


export default (RegisterForm);

import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';

// material
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Autocomplete, Chip
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import {createUserWithEmailAndPassword} from "firebase/auth";
import {useDispatch, useSelector} from "react-redux";
import { useAppDispatch, useAppSelector } from '../../../hooks.ts';
import { login } from '../../../features/userSlice';
import Iconify from '../../../components/Iconify';
import {apiTryvestors} from "../../../utils/api/api-tryvestors";
import { auth } from '../../../firebase'
import {TRYVESTOR} from "../../../UserTypes";
// ----------------------------------------------------------------------


const RegisterForm = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [topics, setTopics] = useState([])

  const possibleTopics = [
    "Apparel and Cosmetics", "Consumer Electronics", "Content, Food and Beverage",
    "Gaming", "Home and Personal", "Job and Career Services", "Social",
    "Transportation Services", "Travel", "Leisure and Tourism",
    "Virtual and Augmented Reality", "Education", "FinTech", "Health", "Pets and Animals"
  ]

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

      navigate('/dashboard/app', { replace: true });
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  const signUp = (creds) => {
    createUserWithEmailAndPassword(auth, creds.email, creds.password)
        .then(async (res) => {
          const userData = {
            UID: res.user.uid,
            firstName: creds.firstName,
            lastName: creds.lastName,
            username: creds.email,
            DOB: "", // Add dob field
          };

          await apiTryvestors.post(userData);

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
  }
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

              <Autocomplete
                  multiple
                  value={topics}
                  onChange={(event, newValue) => {
                    setTopics([
                      ...newValue,
                    ]);
                  }}
                  options={possibleTopics}
                  renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option, index) => (
                          <Chip
                              key={index}
                              label={option.toString()}
                              {...getTagProps(index)}
                          />
                      ))
                  }
                  style={{ width: 500 }}
                  renderInput={(params) => (
                      <TextField {...params} placeholder="Favorites" />
                  )}
              />


          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} >
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}


export default (RegisterForm);

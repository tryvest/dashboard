import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Typography, Collapse, Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import {signInWithEmailAndPassword} from "firebase/auth";
import { useDispatch } from 'react-redux';
import Iconify from '../../../components/Iconify';
import {api} from "../../../utils/api/api";
import {TRYVESTOR} from "../../../UserTypes";
import {apiTryvestors} from "../../../utils/api/api-tryvestors";
import { login } from "../../../features/userSlice";
import {handleError} from "../../../utils/api/response";
import { auth } from '../../../firebase'

// ----------------------------------------------------------------------

export default function LoginForm() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [openUserNotExist, setOpenUserNotExist] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: ({email, password}) => {
      signIn({email, password});
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const signIn = (creds) => {
    signInWithEmailAndPassword(auth, creds.email, creds.password)
        .then(async (data) => {
          api.getUserType(data.user.uid)
              .then(userType => {
                if (userType !== TRYVESTOR) {
                  navigate('/business/login');
                }
                apiTryvestors.getSingle(data.user.uid).then((user) => {
                  const payload = {
                    userType: TRYVESTOR,
                    uid: data.user.uid,
                    data: user
                  };
                  dispatch(login(payload));
                  navigate('/dashboard/overview');
                });
              })
              .catch(handleError);
        })
        .catch((err) => {
          switch(err.code) {
            case 'auth/user-not-found':
              console.log('user not found bish');
              setOpenUserNotExist(true)
              formik.resetForm();
              break;
            default:
              console.log('error logging in: ', err);
          }
        });
  }
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
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
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to="#" underline="hover">
            Forgot password?
          </Link>
        </Stack>

        <Collapse in={openUserNotExist} sx={{pb: 3}}>
          <Alert severity="error" variant='filled'>
            User does not exist!
          </Alert>
        </Collapse>
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}

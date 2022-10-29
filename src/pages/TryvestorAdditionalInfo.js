import React from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import {
  Alert, Card,
  Checkbox,
  Collapse,
  FormControlLabel, Grid,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import Iconify from '../components/Iconify';
import { apiTryvestors } from '../utils/api/api-tryvestors';

function TryvestorAdditionalInfo() {
  const { uid } = useSelector((state) => state.user.user.uid);
  const navigate = useNavigate();

  const patchUserAdditionalInfo = async (formData) => {
    const patchData = {
      SSN: formData.SSN,
      address: {
        streetAddress: formData.streetAddress,
        unit: formData.unit,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
      },
    };
    await apiTryvestors.patchSingleUser(uid, patchData).then(() => {
      window.location.reload();
      navigate('/dashboard/overview', { replace: true });
    });
  };

  const additionalInfoSchema = Yup.object().shape({
    SSN: Yup.string()
      .required('SSN is required')
      .matches(/^\d{9}$/, 'Invalid SSN, enter only digits'),
    streetAddress: Yup.string()
      .required('Email is required')
      .matches(/^\\s*\\S+(?:\\s+\\S+){2}/, 'Invalid street address'),
    unit: Yup.string(),
    city: Yup.string()
      .required('City is required')
      .matches(/^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/, 'Invalid city name'),
    state: Yup.string()
      .required('State is required')
      .matches(
        /^((A[LKSZR])|(C[AOT])|(D[EC])|(F[ML])|(G[AU])|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EHDAINSOT])|(N[EVHJMYCD])|(MP)|(O[HKR])|(P[WAR])|(RI)|(S[CD])|(T[NX])|(UT)|(V[TIA])|(W[AVIY]))$/,
        'Invalid state abbreviation'
      ),
    postalCode: Yup.string()
      .required('Postal Code is required')
      .matches(/^(?!0{3})\d{5}(?:-?\d{4})?$/, 'Invalid postal code'),
  });

  const formik = useFormik({
    initialValues: {
      SSN: null,
      streetAddress: '',
      unit: null,
      city: '',
      state: '',
      postalCode: null,
    },
    validationSchema: additionalInfoSchema,
    onSubmit: ({ SSN, streetAddress, unit, city, state, postalCode }) => {
      patchUserAdditionalInfo({ SSN, streetAddress, unit, city, state, postalCode });
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <Card style={{padding: "15px"}}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                  type="email"
                  label="Email address"
                  {...getFieldProps('email')}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                  type={'text'}
                  label="Password"
                  {...getFieldProps('password')}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
              />
            </Grid>
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              Submit Information
            </LoadingButton>
          </Grid>

          {/*
                      InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPassword} edge="end">
                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                       */}
        </Form>
      </FormikProvider>
    </Card>
  );
}

// todo finish the text-fields
export default TryvestorAdditionalInfo;

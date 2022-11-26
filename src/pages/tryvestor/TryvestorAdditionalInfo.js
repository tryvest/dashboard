import React from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import {
  Alert,
  Card,
  Checkbox,
  Collapse, FormControl,
  FormControlLabel, FormHelperText,
  Grid,
  IconButton,
  InputAdornment, InputLabel,
  Link, MenuItem, Select,
  Stack,
  TextField, Typography,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import {makeStyles, withStyles} from "@mui/styles";
import Iconify from '../../components/Iconify';
import { apiTryvestors } from '../../utils/api/api-tryvestors';
import {DarkLogo, LightLogo} from "../../components/Logo";

function TryvestorAdditionalInfo(props) {
  const uid = useSelector((state) => state.user.user.uid);
  const navigate = useNavigate();
  const { classes } = props

  const patchUserAdditionalInfo = async (formData) => {
    const patchData = {
      employment: formData.employment,
      address: {
        streetAddress: formData.streetAddress,
        unit: formData.unit,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
      },
    };
    console.log(uid)
    await apiTryvestors.patchSingleUser(uid, patchData).then(() => {
      navigate('/dashboard/overview', { replace: true });
      window.location.reload();
    });
  };

  const additionalInfoSchema = Yup.object().shape({
/*    ssn: Yup.string()
      .required('SSN is required')
      .matches(/^\d{9}$/, 'Invalid SSN, enter only digits'), */
    employment: Yup.string()
        .required('Employment is required'),
    streetAddress: Yup.string()
      .required('Street address is required')
      .matches(/^\s*\S+(?:\s+\S+){2}/, 'Invalid street address'),
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
      .required('Postal code is required')
      .matches(/^(?!0{3})\d{5}(?:-?\d{4})?$/, 'Invalid postal code'),
  });

  const formik = useFormik({
    initialValues: {
      employment: '',
      streetAddress: '',
      unit: '',
      city: '',
      state: '',
      postalCode: '',
    },
    validationSchema: additionalInfoSchema,
    onSubmit: ({ employment, streetAddress, unit, city, state, postalCode}) => {
      patchUserAdditionalInfo({ employment, streetAddress, unit, city, state, postalCode }).then(
          r => navigate("/", {replace: true})
      );
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Card style={{ padding: '30px', borderRadius: 0 }}>
            <DarkLogo/>
            <Typography fontSize={"33px"} fontWeight={"800"}>
              Enter some additional information
            </Typography>
            <Typography color={"rgba(37,39,51,0.87)"} fontWeight={500} fontSize={"17px"} fontStyle={"italic"}>
              This information will verify your identity and allow you to receive shares. Your information is safe and secure at all times.
            </Typography>
          </Card>
          <Card style={{ padding: '25px', borderRadius: 0 }}>
            <Typography fontSize={"20px"} fontWeight={"800"} marginBottom={"15px"}>
              Your Address
            </Typography>
            <Grid container spacing={3} width={"500px"} justifyContent={"space-between"}>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  type="text"
                  label="STREET ADDRESS"
                  {...getFieldProps('streetAddress')}
                  error={Boolean(touched.streetAddress && errors.streetAddress)}
                  helperText={touched.streetAddress && errors.streetAddress}
                  style={{width: "500px"}}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  type={'text'}
                  label="APT, SUITE, FLOOR, ETC. (OPTIONAL)"
                  {...getFieldProps('unit')}
                  error={Boolean(touched.unit && errors.unit)}
                  helperText={touched.unit && errors.unit}
                  style={{width: "500px"}}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                    type="text"
                    label="CITY"
                    {...getFieldProps('city')}
                    error={Boolean(touched.city && errors.city)}
                    helperText={touched.city && errors.city}
                    style={{width: "245px"}}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                    type={'text'}
                    label="STATE"
                    {...getFieldProps('state')}
                    error={Boolean(touched.state && errors.state)}
                    helperText={touched.state && errors.state}
                    style={{width: "245px"}}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                    type={'text'}
                    label="POSTAL/ZIP CODE"
                    {...getFieldProps('postalCode')}
                    error={Boolean(touched.postalCode && errors.postalCode)}
                    helperText={touched.postalCode && errors.postalCode}
                    style={{width: "500px"}}
                />
              </Grid>
            </Grid>
          </Card>
          <Card style={{ padding: '25px', borderRadius: 0 }}>
            <Typography fontSize={"20px"} fontWeight={"800"} marginBottom={"15px"}>
              Additional Information
            </Typography>
            <Grid container spacing={3} width={"500px"} justifyContent={"space-between"}>
              <Grid item xs={12} sm={12} md={12}>
                <FormControl>
                  <InputLabel>EMPLOYMENT STATUS</InputLabel>
                  <Select
                      label={"EMPLOYMENT STATUS"}
                      {...getFieldProps('employment')}
                      error={Boolean(touched.employment && errors.employment)}
                      // helperText={touched.employment && errors.employment}
                      style={{width: "500px", color: "black"}}

                  >
                    <MenuItem style={{color: "white"}} value={"fulltime"}>Full-Time</MenuItem>
                    <MenuItem style={{color: "white"}} value={"parttime"}>Part-Time</MenuItem>
                    <MenuItem style={{color: "white"}} value={"contract"}>Contractor</MenuItem>
                    <MenuItem style={{color: "white"}} value={"self"}>Self-Employed</MenuItem>
                    <MenuItem style={{color: "white"}} value={"student"}>Student</MenuItem>
                    <MenuItem style={{color: "white"}} value={"unemployed"}>Unemployed</MenuItem>
                  </Select>
                  <FormHelperText style={{color: "red"}}>{touched.employment && errors.employment}</FormHelperText>
                </FormControl>
              </Grid>
{/*              <Grid item xs={12} sm={12} md={12}>
                <TextField
                    type={'text'}
                    label="SOCIAL SECURITY NUMBER"
                    {...getFieldProps('ssn')}
                    error={Boolean(touched.ssn && errors.ssn)}
                    helperText={touched.ssn && errors.ssn}
                    style={{width: "500px"}}
                />
              </Grid> Getting Rid of SSN on our end */}
            </Grid>
          </Card>
          <LoadingButton
            style={{ width: '100px', padding: '8px', fontWeight: '200', borderRadius: '35px' }}
            size="medium"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Confirm
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}

// todo finish the text-fields
export default TryvestorAdditionalInfo;

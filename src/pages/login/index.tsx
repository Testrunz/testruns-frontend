import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import google from '../../assets/images/common/google.svg';
import microsoft from '../../assets/images/common/micro.svg';
import linkedin from '../../assets/images/common/linkedin.svg';
import authbg from '../../assets/images/auth-bg.svg';
import { Card, Link } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { navigate } from 'gatsby';
import { withCardLayout } from '../../components/auth';
import '../../assets/styles/App.scss';

const validUser = {
  email: 'admin@testrunz.com',
  password: 'Test@123',
};
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Invalid email').matches(emailRegex, "In-correct email"),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Wrong password'),
});

const Login = () => {  
  let isLoggedIn = null;

  if (typeof window !== 'undefined') {
    isLoggedIn = sessionStorage.getItem('isLoggedIn');
  }
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const onSubmit = (values: any) => {
    const isMatch = checkCredentials(values.email, values.password);

    if (isMatch) {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('isLoggedIn', 'true');
        navigate('/mypage');
      }
    } else {
      formik.setFieldError('email', 'Invalid email');
      formik.setFieldError('password', 'Invalid password');
    }
  };

  const checkCredentials = (email: any, password: any) => {
    if (email === validUser.email && password === validUser.password) {
      return true;
    } else {
      return false;
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });


  if (isLoggedIn === 'true') {
    console.log("false");
    
    navigate('/mypage');
    return null;
  }

  return (
    <>
      <Typography variant="h5" className="title-text">
        Log in to your Test Runs account
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ mt: 4 }} className="auth-inner">
          <Box style={{ position: 'relative' }}>
            <InputLabel htmlFor="email"> E-mail </InputLabel>
            <TextField
              margin="normal"
              fullWidth
              name="email"
              id="email"
              InputLabelProps={{ shrink: false }}
              placeholder="E-mail"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
            />
            {formik.touched.email && formik.errors.email && (
              <Typography className="error-field">
                {formik.errors.email}
              </Typography>
            )}
          </Box>

          <Box style={{ position: 'relative' }}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <TextField
              type={showPassword ? 'text' : 'password'}
              fullWidth
              inputProps={{ maxLength: 24 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ mr: 0 }}
                    >
                      {!showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              name="password"
              id="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              variant="outlined"
              error={formik.touched.password && Boolean(formik.errors.password)}
              placeholder="Password"
            />
            {formik.touched.password && formik.errors.password && (
              <Typography className="error-field">
                {formik.errors.password}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              display: { xs: 'block', sm: 'flex' },
              alignItems: 'center',
              bottom: '20px',
              position: 'relative',
              justifyContent: 'space-between',
              textAlign: 'center',
            }}
          >
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    sx={{
                      color: '#9F9F9F',
                      '&.Mui-checked': {
                        color: '#FFC60B',
                      },
                    }}
                  />
                }
                label="Remember me"
                className="remember-me"
                style={{ marginBottom: '0rem' }}
              />
            </Box>
            <Box sx={{ marginTop: { xs: '1rem', sm: '0rem' } }}>
              <Typography
                className="forgot-pass"
                onClick={() => navigate('/forgot-password')}
              >
                Forget your password?
              </Typography>
            </Box>
          </Box>
          <Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 0,
                mb: 0,
                // background: "#FFC60B",
              }}
              className="signup-btn"
            >
              Log in
            </Button>
          </Box>
        </Box>
      </form>

      <Box sx={{ mt: 5 }}>
        <Typography className="read-text">
          Don't have an account yet?{' '}
          <span
            style={{ color: '#FF8400', cursor: 'pointer' }}
            onClick={() => navigate('/signup')}
          >
            Click here to Sign up!
          </span>
        </Typography>
      </Box>
    </>
  );
};
// if (isLoggedIn === 'true') {
const EnhancedLoginPage = withCardLayout(Login);

export default EnhancedLoginPage;

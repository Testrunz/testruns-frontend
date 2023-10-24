// 6LdP4FEoAAAAAJY7gdN16SvmrpcjH0lfSkULEqRS

// 6LdP4FEoAAAAACydDyxF7AQukwFdqtF9WUCEgE9h

import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import google from "../../assets/images/common/google.svg";
import microsoft from "../../assets/images/common/micro.svg";
import linkedin from "../../assets/images/common/linkedin.svg";
import authbg from "../../assets/images/auth-bg.svg";
import { Card, Link } from "@mui/material";
import { withCardLayout } from "../../components/auth";
import { navigate } from "gatsby";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../assets/styles/App.scss";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Invalid email").matches(emailRegex, "In-correct email"),
  captcha: Yup.string().required("Captcha is required"),
});

const generateRandomText = () => {
  // Generate a random string for the CAPTCHA (you can customize this)
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 6; // Adjust the length as needed
  let captchaText = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    captchaText += characters.charAt(randomIndex);
  }
  return captchaText;
};

const ForgotPassword = () => {
  const [captchaText, setCaptchaText] = React.useState(generateRandomText());

  const onSubmit = (values: any) => {
    const isMatch = checkCredentials(values.email, values.captcha);

    if (isMatch) {
      alert("An OTP is sent to your registered email-ID");
    } else {
      // formik.setFieldError("email", "Invalid email");
      formik.setFieldError("captcha", "Invalid captcha");
    }
  };

  const checkCredentials = (email: any, captcha: any) => {
    if (email!=="" && captcha === captchaText) {
      return true;
    } else {
      return false;
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      captcha: "",
    },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  return (
    <>
      <Typography variant="h5" className="title-text">
        Forgot Password
      </Typography>
      <Box sx={{ pt: 3 }}>
        <Typography className="reg-text">
          We will send you an OTP on your registered email-ID.
        </Typography>
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ mt: 4 }} className="auth-inner">
          <Box style={{ position: "relative" }}>
            <InputLabel>Registered email-id</InputLabel>
            <TextField
              margin="normal"
              fullWidth
              name="email"
              id="email"
              InputLabelProps={{ shrink: false }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              placeholder="E-Mail"
            />
            {formik.touched.email && formik.errors.email && (
              <Typography className="error-field">
                {formik.errors.email}
              </Typography>
            )}
          </Box>
          <Box style={{ position: "relative" }}>
            <Box >
              <InputLabel>Enter captcha</InputLabel>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Box className="captiontext"
                  sx={{
                    width: "100%",
                    background: "#FFE3C5",
                    height: "45px",
                    mt: 1.5,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: 600,
                    letterSpacing: "10px",
                    fontSize: "28px",
                    textDecorationLine: "line-through",
                  }}
                >
                  {captchaText}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  margin="normal"
                  fullWidth
                  name="captcha"
                  id="captcha"
                  InputLabelProps={{ shrink: false }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.captcha}
                  variant="outlined"
                  error={
                    formik.touched.captcha && Boolean(formik.errors.captcha)
                  }
                  placeholder="Captcha"
                />
                {formik.touched.captcha && formik.errors.captcha && (
                  <Typography className="error-field">
                    {formik.errors.captcha}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 0, mb: 0 }}
              className="signup-btn"
            >
              Next
            </Button>
          </Box>
        </Box>
      </form>
      <Box sx={{ mt: 5 }}>
        <Typography className="read-text">
          Back to{" "}
          <span
            style={{ color: "#FF8400", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            log in!
          </span>
        </Typography>
      </Box>
    </>
  );
};

const EnhancedForgotPage = withCardLayout(ForgotPassword);

export default EnhancedForgotPage;

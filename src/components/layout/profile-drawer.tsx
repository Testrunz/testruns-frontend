import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {
  Box, Drawer, Toolbar, Typography, Checkbox,
  Autocomplete, Button, Select, MenuItem, CircularProgress
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import logout from '../../assets/images/profile/logout.svg';
import camera from '../../assets/images/profile/camera.svg';
import profile from '../../assets/images/profile/profile.svg';
import organisation from '../../assets/images/profile/organisation.svg';
import document from '../../assets/images/profile/document.svg';
import profile2 from '../../assets/images/profile/profile2.svg';
import '../../assets/styles/profile.scss';
import { navigate } from 'gatsby';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartmentById, fetchDepartmentData } from '../../api/departmentAPI';
import { fetchLabById, fetchLabData } from '../../api/labAPI';
import { OrganizationList } from '../../utils/data';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { fetchOrganizationById, fetchOrganizationData } from '../../api/organizationAPI';
import { fetchSingleUserData, fetchUpdateUserData, fetchUserData } from '../../api/userAPI';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { fetchSingleRoleData } from '../../api/roleApi';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase.config';
import AWS from 'aws-sdk';
import LogoutConfirmationpopup from '../LogoutConfirmatiomPopup';


const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required").max(20, 'Must be 20 characters'),
  lastName: Yup.string().required("Last name is required").max(20, 'Must be 20 characters'),
  email: Yup.string().required("Email is required").email("Invalid email").matches(emailRegex, "In-correct email"),
  phoneNumber: Yup.string().matches(/^\d{10}$/, 'Phone number have 10 digits'),
  // .matches(phoneRegExp, 'Phone number is not valid')
  //   .min(10, "Enter valid number")
  //   .max(10, "too long").required("Mobile number is required"),
  organisationId: Yup.string().required("Organistation is required"),
  // institution: Yup.string().required("Institution is required"),
  departmentId: Yup.array().min(1, 'Please select at least one Department').required('Department is required'),
  // laboratoryId: Yup.array().min(1, 'Please select at least one Laboratory').required('Laboratory is required'),
  // user_id: Yup.string().required(),
  role: Yup.string().required("Role is required"),
});

export default function AppProfileDrawer({
  openDrawer,
  toggleProfileDrawer,
}: any) {
  const [departmentData, setDepartmentData] = React.useState([]);
  const [edit, setEdit] = React.useState(false)
  const [organizationData, setOrganizationData] = React.useState([]);
  const [userDetail, setUserDetail] = React.useState([]);
  const [labData, setLabData] = React.useState([]);
  const [departments, setDepartments] = React.useState([])
  const [laboratory, setLaboratory] = React.useState([])
  const [roleData, setRoleData] = React.useState([]);
  const fileUploadField = React.useRef<any>(null);
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [loader, setLoader]=React.useState(false)
  const triggerFileUploadField = () => {
    fileUploadField.current?.click();
  };
  const confirmationPopupRef: any = React.useRef(null);
  const dispatch: any = useDispatch();
  const departmentSliceData = useSelector(
    (state: any) => state.department.data?.get_all_departments,
  );
  const labSliceData = useSelector(
    (state: any) => state.lab.data?.get_all_labs,
  );
  const organizationSliceData = useSelector(
    (state: any) => state.organization.data?.get_all_organisations,
  );
  const userSliceData = useSelector(
    (state: any) => state.user.data?.get_user,
  );
  const roleSliceData = useSelector(
    (state: any) => state.role.data?.find_roles,
  );
  console.log("roleSliceData",userSliceData);
  
  React.useEffect(() => {
    setDepartmentData(departmentSliceData?.map((item: any) => ({
      label: item.name,
      value: item.name,
      id: item._id,
    })))
    setLabData(labSliceData?.map((item: any) => ({
      label: item.name,
      value: item._id,
      id: item._id,
    })))
    setOrganizationData(
      organizationSliceData?.map((item: any) => ({
        label: item.name,
        value: item.name,
        id: item._id,
      })),
    );
    setRoleData(
      roleSliceData?.map((item: any) => ({
        label: item.name,
        value: item._id,
      })),
    );
    setUserDetail(userSliceData)

  }, [departmentSliceData, labSliceData, organizationSliceData, userSliceData, roleSliceData])

  console.log(roleData);

  const Placeholder = ({ children }: any) => {
    return <div>{children}</div>;
  };
  // console.log(departmentData);

  // console.log(DepartmentList);
  const loginUserSliceData=  useSelector(
    (state: any) => state.userLogin?.data?.verifyToken, 
  );
  var payload2={
    instituteId:loginUserSliceData?.instituteId
  }
  const credencial =  loginUserSliceData?.role[0]

  React.useEffect(() => {
    if (openDrawer) {
      
      let payload = {
        _id: loginUserSliceData?._id
      };

      dispatch(fetchSingleRoleData(payload2));
      dispatch(fetchSingleUserData(payload));
      dispatch(fetchOrganizationById({"instituteId":loginUserSliceData?.instituteId}))
      dispatch(fetchDepartmentById({ "organisationId":loginUserSliceData?.organisationId}))
      dispatch(fetchLabById({"departmentId":loginUserSliceData?.departmentId}))
      // Other logic specific to the profile drawer
      setEdit(true);
    }
  }, [openDrawer, loginUserSliceData]);
  
  React.useEffect(()=>{
    let temp = { '_id': loginUserSliceData?._id}
    // if (row?._id) {
    
    dispatch(fetchSingleUserData(temp)).then((isSucess: { get_user: { firstName: any; lastName: any; email: any; phoneNumber: any; organisationId: any; departmentId: any[]; role: any; }; }) => {
      if (isSucess.get_user) {
        console.log("isSucess",isSucess.get_user);
        formik.setFieldValue('firstName', isSucess.get_user.firstName || '');
        formik.setFieldValue('lastName', isSucess.get_user.lastName || '');
        formik.setFieldValue('email', isSucess.get_user.email || '');
        formik.setFieldValue('phoneNumber', isSucess.get_user.phoneNumber || '');
        formik.setFieldValue('organisationId', isSucess.get_user.organisationId || '');
        formik.setFieldValue('departmentId', isSucess.get_user?.departmentId?.map((item: any) => (departmentData?.find(obj => (obj.id == item)))) || []);
        formik.setFieldValue('laboratoryId', isSucess.get_user?.laboratoryId?.map((item: any) => (labData?.find(obj => (obj.id == item) ))) || []);
        formik.setFieldValue('role', isSucess.get_user.role || '');
        formik.setFieldValue('institution', isSucess.get_user.instituteId || "");
        setUploadedFile(isSucess.get_user.imageUrl)
      }
    })
      .catch((err: any) => {
        console.log(err);
      });
    // }    
  }, [departmentData, labData, loginUserSliceData,roleSliceData])

  const handleConfirmationDone = (state: any) => {
    if (state === 1) {
      handleLogout()
    }
    confirmationPopupRef.current.open(false);
  };
  const checkCredentialsProfile = (
    firstName: any,
  ) => {
    return true
  };
  const onSubmitProfile = async(values: any) => {
    const isMatch = checkCredentialsProfile(
      values.firstName,
      // values.lastName,
      // values.email,
      // values.mobile,
      // values.organisation,
      // values.lab,
      // values.password,
      // values.designation,
      // values.reqstId
    );

    if (isMatch) {
      var deptArray: any = []
      formik.values.departmentId?.map((item: any) => (deptArray.push(item?.id)))
      var labArray: any = []
      formik.values.laboratoryId?.map((item: any) => (labArray.push(item?.id)))
      let userValues: any = {
        // uid:"",
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber.toString(),
        organisationId: values.organisationId,
        imageUrl:uploadedFile,
        instituteId: process.env.INSTITUTION_ID,
        departmentId: deptArray,
        laboratoryId: labArray,
        role: values.role,
        _id:loginUserSliceData?._id
      }
      // debugger
      // userValues['_id'] = userData?._id
      console.log(userValues);
      
      await dispatch(fetchUpdateUserData(userValues))
      window.localStorage.setItem("userProfileDetails",JSON.stringify(userValues))
     await toggleProfileDrawer()
     await setEdit(true) 
      await toast(`User Details updated successful !`, {
        style: {
          background: '#00bf70', color: '#fff'
        }
      });
      // setUploadedFile(null)
      // alert("User Details updated successful!");

    }
    // window.location.reload()
  }
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      organisationId: '',
      institution:  '',
      departmentId: [],
      laboratoryId: [],
      role: '',
    },
    validationSchema: validationSchema,
    onSubmit: onSubmitProfile,
  });
  console.log(formik);
  
  const handleLogout=()=>{
    signOut(auth).then(() => {
      // dispatch(fetchLogoutUser())
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('isLoggedIn', 'false');
          toast(`User logout successfully !`, {
            style: {
              background: '#00bf70',
              color: '#fff',
            },
          });
          setTimeout(() => {
            navigate('/login');
          }, 1000);
         
        }

    }).catch((error) => {
     console.log(error);
     
    });
  }
  const handleImageUpload = async () => {
    const selectedFile = fileUploadField.current.files[0];
    // const formData = new FormData();
    // formData.append('file', selectedFile);
    // const payload = {
    //   file: formData,
    //   type: 'profile'
    // }
    // dispatch(fileUploadData(payload));

    const s3 = new AWS.S3({
      // params: { Bucket: S3_BUCKET, folderName: "profile" },
      region: 'us-east-1',
      accessKeyId: process.env.ACCESSKEYID,
      secretAccessKey: process.env.SECRETACCESSKEYID,
    });
    const keyPath = `profile/${Date.now()}`;
    const params = {
      Bucket: 'test-run-v2',
      Key: keyPath,
      Body: selectedFile,
      ACL: 'public-read',
      // ContentType: selectedFile.type
    };
    setLoader(true)
    const result = s3.upload(params).promise();
    await result.then((res: any) => {
      setUploadedFile(res.Location);
      toast(`Image uploaded successfully !`, {
        style: {
          background: '#00bf70',
          color: '#fff',
        },
      });
    });
    await result.catch((err) => {
      console.error('Failed to upload');
      toast(`Failed to upload !`, {
        style: {
          background: '#e2445c',
          color: '#fff',
        },
      });
    });
    setLoader(false)
  };
  
  return (
    <>
    {/* <Toolbar sx={{position:"absolute",right:"0px",zIndex:"9999999 !important"}}/> */}
    <Drawer
      className="profile-head"
      variant="temporary"
      anchor="right"
      open={openDrawer}
      sx={{
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 600,
          boxSizing: 'border-box',
        },
        boxShadow: '-12px 4px 19px 0px #0000001A',
      }}
      onClose={() => { toggleProfileDrawer(), setEdit(true) }}
      disableScrollLock={ true }
    >
      
      <Box sx={{ overflow: 'auto' }}>
        <Box className="profile-page" sx={{ py: 2 }}>
          <Box className="profile-section1">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <CloseOutlinedIcon
                sx={{ cursor: 'pointer' }}
                onClick={() => { toggleProfileDrawer(), setEdit(true) }}
              />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                // onClick={handleLogout}
                onClick={() => {
                  confirmationPopupRef.current.open(true);
                }}
              >
                <Typography className="logout-text">Logout</Typography>
                <img src={logout} alt="logout" />
              </Box>
            </Box>
            <Box className="profile-camera">
             {!loader?<img src={(uploadedFile == null || uploadedFile == "") ? profile : uploadedFile} alt="profile" className="profile-user" style={{width:"200px", height:"200px",objectFit:"cover",padding: uploadedFile == null ? '0px' : '16px',}} />
             :<CircularProgress color="inherit" style={{width:"200px", height:"200px", padding:"79px"}} className="profile-user"/>}<img src={camera} alt="camera" className="upload-img" onClick={triggerFileUploadField} />
              <input
            style={{ display: 'none' }}
            type="file"
            disabled={edit}
            ref={fileUploadField}
            accept="image/jpg, image/jpeg, image/png"
            onChange={handleImageUpload}
          />
            </Box>
          </Box>
          <Box className="edit-profile-btn">
            <Button onClick={() => setEdit(false)}>Edit profile</Button>
          </Box>
          <form onSubmit={formik.handleSubmit} autoComplete="off">

            <Box className="profile-section2">
              <Grid container spacing={2} className="profile-inner">
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  sx={{
                    paddingRight: {
                      xs: '0rem !important',
                      sm: '1rem !important',
                    },
                  }}
                >
                  <Box style={{ position: 'relative' }}>
                    <label>
                      First name<span style={{ color: '#E2445C' }}>*</span>
                    </label>
                    <TextField
                      className={edit ? "bg-gray-input" : ""}
                      margin="none"
                      fullWidth
                      id="firstName"
                      name="firstName"
                      autoComplete="off"
                      InputLabelProps={{ shrink: false }}
                      placeholder="First name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.firstName}
                      size="small"
                      error={
                        formik.touched.firstName &&
                        Boolean(formik.errors.firstName)
                      }
                      disabled={edit?true:credencial?.profile_management?.editUserName==true?false:true}
                    />
                    {formik.touched.firstName &&
                      formik.errors.firstName && (
                        <Typography className="error-field">
                          {formik.errors.firstName}
                        </Typography>
                       )} 
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  sx={{
                    paddingLeft: { xs: '0rem !important', sm: '1rem !important' },
                  }}
                >
                  <Box style={{ position: 'relative' }}>
                    <label>
                      Last name<span style={{ color: '#E2445C' }}>*</span>
                    </label>
                    <TextField
                      className={edit ? "bg-gray-input" : ""}
                      // disabled={edit}
                      margin="normal"
                      fullWidth
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="off"
                      InputLabelProps={{ shrink: false }}
                      placeholder="Last name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lastName}
                      size="small"
                      error={
                        formik.touched.lastName &&
                        Boolean(formik.errors.lastName)
                      }
                      disabled={edit?true:credencial?.profile_management?.editUserName==true?false:true}
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <Typography className="error-field">
                        {formik.errors.lastName}
                      </Typography>
                     )} 

                  </Box>
                </Grid>
              </Grid>
              <Grid container spacing={2} className="profile-inner">
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  sx={{
                    paddingRight: {
                      xs: '0rem !important',
                      sm: '1rem !important',
                    },
                  }}
                >
                  <Box style={{ position: 'relative' }}>
                    <label>
                      Email<span style={{ color: '#E2445C' }}>*</span>
                    </label>
                    <TextField
                      className={"bg-gray-input"}
                      disabled={true}
                      inputProps={{ maxLength: 50 }}
                      margin="normal"
                      fullWidth
                      id="email"
                      name="email"
                      autoComplete="off"
                      InputLabelProps={{ shrink: false }}
                      placeholder="Email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      size="small"
                      error={
                        formik.touched.email &&
                        Boolean(formik.errors.email)
                      }
                    />
                    {formik.touched.email && formik.errors.email && (
                      <Typography className="error-field">
                        {formik.errors.email}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  sx={{
                    paddingLeft: { xs: '0rem !important', sm: '1rem !important' },
                  }}
                >
                  <Box style={{ position: 'relative' }}>
                    <label>Mobile</label>
                    <TextField
                      onInput={(e: any) => {
                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                      }}
                      className={edit ? "bg-gray-input" : ""}
                      inputProps={{ maxLength: 10 }}
                      // disabled={edit}
                      margin="none"
                      fullWidth
                      id="phoneNumber"
                      name="phoneNumber"
                      type="number"
                      InputLabelProps={{ shrink: false }}
                      placeholder="Mobile number"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.phoneNumber}
                      size="small"
                      // error={
                      //   formik.touched.phoneNumber &&
                      //   Boolean(formik.errors.phoneNumber)
                      // }
                      disabled={edit?true:credencial?.profile_management?.editContact==true?false:true}

                      // disabled={!credencial?.profile_management?.editContact}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment sx={{ mx: 2 }} position="start">
                            +91{' '}
                          </InputAdornment>
                        ),
                      }}
                    />
                    {formik.touched.phoneNumber &&
                      formik.errors.phoneNumber && (
                        <Typography className="error-field">
                          {formik.errors.phoneNumber}
                        </Typography>
                      )}
                  </Box>
                </Grid>
              </Grid>
              <Grid container spacing={2} className="profile-inner multi-selection">
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Box style={{ position: 'relative' }}>
                    <label>Organisation</label>
                    <Select
                    MenuProps={{                   
                      disableScrollLock: true,                   
                      marginThreshold: null
                    }}
                      className={edit ? "bg-gray-input" : ""}
                      // disabled={edit}
                      style={{ color: "black", backgroundColor: edit ? '#f3f3f3' : 'white' }}
                      displayEmpty
                      IconComponent={ExpandMoreOutlinedIcon}
                      renderValue={
                        formik.values.organisationId !== ''
                          ? undefined
                          : () => (
                            <Placeholder>
                              Select Organization
                            </Placeholder>
                          )
                      }
                      margin="none"
                      fullWidth
                      id="organisationId"
                      name="organisationId"
                      autoComplete="off"
                      placeholder="Organization"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.organisationId}
                      size="small"
                      error={
                        formik.touched.organisationId &&
                        Boolean(formik.errors.organisationId)
                      }
                      disabled={edit?true:credencial?.profile_management?.editOrganisation==true?false:true}

                      // disabled= {!credencial?.profile_management?.editOrganisation}
                    >
                      {organizationData?.map((item: any, index) => (
                        <MenuItem key={index} value={item.id}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.organisationId &&
                      formik.errors.organisationId && (
                        <Typography className="error-field">
                          {formik.errors.organisationId}
                        </Typography>
                      )}
                  </Box>
                </Grid>
              </Grid>
              <Grid container spacing={2} className="profile-inner multi-selection">
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Box style={{ position: 'relative' }}>
                    <label>Department</label>
                    <Autocomplete
                      multiple
                      id="department"
                      className={edit ? "bg-gray-input" : ""}
                      disableCloseOnSelect
                      value={formik.values.departmentId}
                      options={
                        (departmentData !== undefined && departmentData?.length!==0)
                          ? departmentData
                          : []
                      }
                      getOptionLabel={(option: any) => option?.label}
                      isOptionEqualToValue={(option: any, value: any) =>
                        value?.id == option?.id
                      }
                      renderInput={(params) => (
                        <TextField {...params} placeholder={formik.values.departmentId?.length==0?"Department/s" :""}/>
                      )}
                      fullWidth
                      size="medium"
                      disabled={edit?true:credencial?.profile_management?.editDepartment==true?false:true}

                      // disabled= {!credencial?.profile_management?.editDepartment}
                      renderOption={(
                        props,
                        option: any,

                        { selected },

                      ) => (
                        <React.Fragment>
                          <li {...props}>
                            <Checkbox
                              style={{ marginRight: 0 }}
                              checked={selected}
                            />
                            {option.value}
                          </li>
                        </React.Fragment>
                      )}
                      onChange={(_, selectedOptions: any) => {
                        setDepartments(selectedOptions); formik.setValues({ ...formik.values, 'departmentId': selectedOptions })
                      }
                      }
                    />
                    {formik.touched.departmentId && formik.errors.departmentId && (
                    <Typography className="error-field">
                        {formik.errors.departmentId}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
              <Grid container spacing={2} className="profile-inner">
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  sx={{
                    paddingRight: {
                      xs: '0rem !important',
                      sm: '1rem !important',
                    },
                  }}
                >
                  <Box style={{ position: 'relative' }}>
                    <label>Role</label>
                    <Select
                      MenuProps={{                   
                        disableScrollLock: true,                   
                        marginThreshold: null
                      }}
                      style={{ color: "black", backgroundColor: edit ? '#f3f3f3' : 'white', marginTop: "10px" }}
                      displayEmpty
                      IconComponent={ExpandMoreOutlinedIcon}
                      renderValue={
                        formik.values.role !== ''
                          ? undefined
                          : () => <Placeholder>Select Role</Placeholder>
                      }
                      margin="none"
                      className={edit ? "bg-gray-input" : ""}
                      disabled={edit?true:credencial?.profile_management?.editRole==true?false:true}
                      fullWidth
                      id="role"
                      name="role"
                      autoComplete="off"
                      placeholder="Role"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.role}
                      size="small"
                      error={
                        formik.touched.role && Boolean(formik.errors.role)
                      }
                    >  {roleData?.length!==0 &&
                      roleData?.map((item: any) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}</Select>
                    {formik.touched.role && formik.errors.role && (
                      <Typography className="error-field">
                        {formik.errors.role}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  sx={{
                    paddingLeft: { xs: '0rem !important', sm: '1rem !important' },
                  }}
                >
                  <Box style={{ position: 'relative' }}>
                    <label>Requestor ID/Tester ID</label>
                    <TextField
                      margin="normal"
                      // required
                      fullWidth
                      id="Organisation"
                      inputProps={{ maxLength: 20 }}
                      className={"bg-gray-input"}
                      disabled={true}
                      name="Organisation"
                      autoComplete="off"
                      InputLabelProps={{ shrink: false }}
                      placeholder="Requestor ID/Tester ID"
                    // InputProps={{
                    //   startAdornment: (
                    //     <InputAdornment position="start">
                    //       <img src={profile2} />
                    //     </InputAdornment>
                    //   ),
                    // }}
                    />
                  </Box>
                </Grid>
              </Grid>
              {/* <Box  >
              <Box style={{ height: "150px" }}>

              </Box> */}
              {/* </Box> */}
              {/* <Box>
              <label>Labs assigned</label>
              <Box className="lab-list">
                <span>Mechanical</span>
                <span>Electronics</span>
                <span>Chemical</span>
                <span>Zoology</span>
                <span>Biotechnology</span>
                <span>Botany</span>
              </Box>
            </Box> */}
            </Box>
            <Box className="edit-details-profile" sx={{padding: '15px 32px'}}>
              <Button  variant="contained" onClick={() => { toggleProfileDrawer()}}  className="cancel-btn" >
                Cancel
              </Button>
              <Button type="submit" disabled={edit} variant="contained" className="add-btn">
                Save
              </Button>
            </Box>
          </form>
        </Box>
        <LogoutConfirmationpopup
        ref={confirmationPopupRef}
        confirmationDone={handleConfirmationDone}
      />
      </Box>
    </Drawer>
    </>
  );
}
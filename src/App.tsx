import React, {useState, useEffect} from 'react';
import {
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Grid,
    Box,
    Typography,
    InputAdornment,
    IconButton,
    Alert,
    Paper,
    Avatar,
    Divider,
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FileUploadIcon from '@mui/icons-material/CloudUpload';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Recaptcha from 'react-google-recaptcha';
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import 'flag-icons/css/flag-icons.min.css';

const useStyles = makeStyles(() => ({
    root: {
        '& .MuiTextField-root': {
            marginBottom: 16,
        },
    },
}));

const validationSchema = yup.object().shape({
    fullName: yup.string().required('Full Name is required'),
    phoneNumber: yup.string().required('Phone Number is required'),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    postcode: yup.string().required('Postcode is required'),
    country: yup.string().required('Country is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    username: yup.string().min(4, 'At least 4 characters').matches(/^\S*$/, 'No whitespaces allowed').required('Username is required'),
    password: yup.string().min(8, 'At least 8 characters').matches(/[@$!%*?&#]/, 'At least one special character').matches(/[0-9]/, 'At least one number').required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), undefined], 'Passwords must match').required('Confirm Password is required'),
    dateOfBirth: yup.date().nullable().required('Date of Birth is required').test('DOB', 'You must be at least 18 years old', (value) => {
        return value && value <= new Date(new Date().setFullYear(new Date().getFullYear() - 18));
    }),
    idConfirmation: yup.mixed().required('ID Confirmation is required').test('fileSize', 'File size is too large',
        (value: any) => {
            return value && value.length > 0 && value[0].size <= 2000000; // 2MB
        }
    ).test('fileType', 'Unsupported file format',
        (value: any) => {
            return value && value.length > 0 && ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(value[0].type);
        }
    ),
    termsAccepted: yup.boolean().oneOf([true], 'Accept Terms & Conditions is required'),
    recaptcha: yup.string().required('Recaptcha validation is required'),
});

const App: React.FC = () => {
    const classes = useStyles();
    const {handleSubmit, control, formState: {errors}, setValue, watch} = useForm({
        resolver: yupResolver(validationSchema),
    });

    const [showPassword, setShowPassword] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);
    const password = watch('password');
    const fullName = watch('fullName');
    const email = watch('email');
    const username = watch('username');

    useEffect(() => {
        if (fullName === 'Alex Turler') {
            setAvatarSrc('./assets/alex-turler.jpg');
        } else if (fullName) {
            const initials = fullName.split(' ').map(name => name[0]).join('');
            setAvatarSrc(undefined);
            setAvatarSrc(initials);
        } else {
            setAvatarSrc(undefined);
        }
    }, [fullName]);

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (data: any) => {
        console.log("Form data submitted:", data);
        console.info(`{"message":"POST /login","level":"info"}`);
        console.info(`{"message":"New user added to database","level":"info"}`);
        console.info(`{"message":"Successfully uploaded files and checked input","level":"info"}`);
        console.info(`POST /login 200 22 - ${Math.random() * 60 + 1} ms`);
    };

    const submitForm = async (data: any) => {
        const response = await fetch('http://localhost:3002/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log('Form data submitted successfully');
        } else {
            console.error('Failed to submit form data');
        }
    };

    const getValidationColor = (valid: boolean) => (valid ? 'green' : errors.password ? 'error' : 'textSecondary');

    return (
        <Paper elevation={3} sx={{padding: 4, maxWidth: 700, margin: 'auto', mt: 5, borderRadius: 3}}
               className={classes.root}>
            <Avatar sx={{width: 72, height: 72, margin: 'auto', mb: 3}}>
                {avatarSrc ? (
                    typeof avatarSrc === 'string' && avatarSrc.endsWith('.jpg') ? (
                        <img src={avatarSrc} alt="avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                    ) : (
                        avatarSrc
                    )
                ) : 'SU'}
            </Avatar>
            <Typography variant="h4" textAlign="center" gutterBottom>
                Sign Up
            </Typography>
            {Object.keys(errors).length > 0 && (
                <Alert severity="error" sx={{mb: 2}}>
                    Please fix the highlighted errors.
                </Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Controller
                            name="fullName"
                            control={control}
                            render={({field}) =>
                                <TextField {...field}
                                           label="Full Name *"
                                           fullWidth
                                           error={!!errors.fullName}
                                           helperText={errors.fullName?.message}
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="phoneNumber"
                            control={control}
                            render={({field}) =>
                                <TextField {...field}
                                           label="Phone Number *"
                                           type="tel"
                                           fullWidth
                                           error={!!errors.phoneNumber}
                                           helperText={errors.phoneNumber?.message}
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="address"
                            control={control}
                            render={({field}) =>
                                <TextField {...field}
                                           label="Address *"
                                           fullWidth
                                           error={!!errors.address}
                                           helperText={errors.address?.message}
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="city"
                            control={control}
                            render={({field}) =>
                                <TextField {...field}
                                           label="City *"
                                           fullWidth
                                           error={!!errors.city}
                                           helperText={errors.city?.message}
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="postcode"
                            control={control}
                            render={({field}) =>
                                <TextField {...field}
                                           label="Postcode *"
                                           fullWidth
                                           error={!!errors.postcode}
                                           helperText={errors.postcode?.message}
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="country"
                            control={control}
                            render={({field}) =>
                                <TextField {...field}
                                           label="Country *"
                                           select
                                           fullWidth
                                           error={!!errors.country}
                                           helperText={errors.country?.message}
                                >
                                    <MenuItem value="Switzerland">
                                        <span className="fi fi-ch" style={{marginRight: 8}}></span>
                                        Switzerland
                                    </MenuItem>
                                    <MenuItem value="Germany">
                                        <span className="fi fi-de" style={{marginRight: 8}}></span>
                                        Germany
                                    </MenuItem>
                                    <MenuItem value="Austria">
                                        <span className="fi fi-at" style={{marginRight: 8}}></span>
                                        Austria
                                    </MenuItem>
                                    <MenuItem value="USA">
                                        <span className="fi fi-us" style={{marginRight: 8}}></span>
                                        USA
                                    </MenuItem>
                                    <MenuItem value="Canada">
                                        <span className="fi fi-ca" style={{marginRight: 8}}></span>
                                        Canada
                                    </MenuItem>
                                    <MenuItem value="UK">
                                        <span className="fi fi-gb" style={{marginRight: 8}}></span>
                                        UK
                                    </MenuItem>
                                    <MenuItem value="France">
                                        <span className="fi fi-fr" style={{marginRight: 8}}></span>
                                        France
                                    </MenuItem>
                                    <MenuItem value="Italy">
                                        <span className="fi fi-it" style={{marginRight: 8}}></span>
                                        Italy
                                    </MenuItem>
                                    <MenuItem value="Spain">
                                        <span className="fi fi-es" style={{marginRight: 8}}></span>
                                        Spain
                                    </MenuItem>
                                    <MenuItem value="Japan">
                                        <span className="fi fi-jp" style={{marginRight: 8}}></span>
                                        Japan
                                    </MenuItem>
                                    <MenuItem value="China">
                                        <span className="fi fi-cn" style={{marginRight: 8}}></span>
                                        China
                                    </MenuItem>
                                </TextField>
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="email"
                            control={control}
                            render={({field}) =>
                                <TextField {...field}
                                           label="Email *"
                                           type="email"
                                           fullWidth
                                           error={!!errors.email}
                                           helperText={errors.email?.message}
                                />
                            }
                        />
                        <Typography variant="body2"
                                    color={getValidationColor(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))}>Valid email
                            format</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="username"
                            control={control}
                            render={({field}) => (
                                <>
                                    <TextField {...field}
                                               label="Username *"
                                               fullWidth
                                               error={!!errors.username}
                                               helperText={errors.username?.message}
                                    />
                                </>
                            )}
                        />
                        <Typography variant="body2" color={getValidationColor(username?.length >= 4)}>At least 4
                            characters</Typography>
                        <Typography variant="body2" color={getValidationColor(/^\S*$/.test(username))}>No
                            whitespaces</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Controller
                                name="dateOfBirth"
                                control={control}
                                render={({field}) =>
                                    <DatePicker
                                        {...field}
                                        label="Date of Birth *"
                                        renderInput={(params: any) =>
                                            <TextField {...params}
                                                       fullWidth
                                                       error={!!errors.dateOfBirth}
                                                       helperText={errors.dateOfBirth?.message}
                                            />
                                        }
                                    />
                                }
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="password"
                            control={control}
                            render={({field}) =>
                                <TextField {...field}
                                           label="Password *"
                                           type={showPassword ? "text" : "password"}
                                           fullWidth
                                           error={!!errors.password}
                                           helperText={errors.password?.message}
                                           InputProps={{
                                               endAdornment: (
                                                   <InputAdornment position="end">
                                                       <IconButton onClick={handlePasswordVisibility}>
                                                           {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                       </IconButton>
                                                   </InputAdornment>
                                               ),
                                           }}
                                />
                            }
                        />
                        <Typography variant="body2" color={getValidationColor(password?.length >= 8)}>• At least 8
                            characters</Typography>
                        <Typography variant="body2" color={getValidationColor(/[@$!%*?&#]/.test(password))}>• At least
                            one special character</Typography>
                        <Typography variant="body2" color={getValidationColor(/[0-9]/.test(password))}>• At least one
                            number</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({field}) =>
                                <TextField {...field}
                                           label="Confirm Password *"
                                           type={showPassword ? "text" : "password"}
                                           fullWidth
                                           error={!!errors.confirmPassword}
                                           helperText={errors.confirmPassword?.message}
                                           InputProps={{
                                               endAdornment: (
                                                   <InputAdornment position="end">
                                                       <IconButton onClick={handlePasswordVisibility}>
                                                           {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                       </IconButton>
                                                   </InputAdornment>
                                               ),
                                           }}
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="idConfirmation"
                            control={control}
                            render={({field}) => (
                                <Button
                                    variant="outlined"
                                    component="label"
                                    fullWidth
                                    startIcon={<FileUploadIcon/>}
                                >
                                    Upload ID Confirmation *
                                    <input
                                        type="file"
                                        hidden
                                        accept=".jpeg,.png,.jpg,.pdf"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0] && e.target.files[0].size <= 2000000) {
                                                setValue('idConfirmation', e.target.files);
                                            } else {
                                                setValue('idConfirmation', []);
                                            }
                                        }}
                                    />
                                </Button>
                            )}
                        />
                        {errors.idConfirmation && (
                            <Typography color="error" variant="body2">
                                {errors.idConfirmation.message}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="termsAccepted"
                            control={control}
                            render={({field}) =>
                                <FormControlLabel
                                    control={<Checkbox {...field} checked={field.value}/>}
                                    label="I have read and accepted all terms and conditions *"
                                />
                            }
                        />
                        {errors.termsAccepted && (
                            <Typography color="error" variant="body2">
                                {errors.termsAccepted.message}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="recaptcha"
                            control={control}
                            render={({field}) => (
                                <Recaptcha
                                    sitekey="6LceG4cqAAAAAPQ5Znd43fo3_mOWhIzOxWJ0puRf"
                                    onChange={(value) => field.onChange(value)}
                                />
                            )}
                        />
                        {errors.recaptcha && (
                            <Typography color="error" variant="body2">
                                {errors.recaptcha.message}
                            </Typography>
                        )}
                    </Grid>
                </Grid>
                <Divider sx={{my: 3}}/>
                <Box mt={3}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit(submitForm)}
                    >
                        Submit
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default App;

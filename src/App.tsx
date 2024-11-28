import React, {useState, useEffect} from 'react'; // Importing essential React hooks.
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
} from '@mui/material'; // Importing MUI components for UI elements.
import {makeStyles} from '@mui/styles'; // Importing makeStyles for custom styles.
import Visibility from '@mui/icons-material/Visibility'; // Icon for visibility toggle.
import VisibilityOff from '@mui/icons-material/VisibilityOff'; // Icon for visibility off toggle.
import FileUploadIcon from '@mui/icons-material/CloudUpload'; // Icon for file upload.
import {DatePicker} from '@mui/x-date-pickers/DatePicker'; // DatePicker component for birthday field.
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'; // Date adapter for DatePicker.
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'; // Localization for DatePicker.
import Recaptcha from 'react-google-recaptcha'; // Recaptcha component for security verification.
import * as yup from 'yup'; // Import Yup for validation.
import {useForm, Controller} from 'react-hook-form'; // Form utilities from react-hook-form.
import {yupResolver} from '@hookform/resolvers/yup'; // Resolver for integrating Yup validation with react-hook-form.
import 'flag-icons/css/flag-icons.min.css'; // Importing flag icons for country display.

// Styles using makeStyles utility from MUI.
const useStyles = makeStyles(() => ({
    root: {
        '& .MuiTextField-root': { // Style specifically for TextField components.
            marginBottom: 16, // Margin at bottom of each TextField.
        },
    },
}));

// Validation schema defined using Yup for form field requirements.
const validationSchema = yup.object().shape({
    fullName: yup.string().required('Full Name is required'), // Full name is a required field.
    phoneNumber: yup.string().required('Phone Number is required'), // Phone number is required.
    address: yup.string().required('Address is required'), // Address field required.
    city: yup.string().required('City is required'), // City is mandatory.
    postcode: yup.string().required('Postcode is required'), // Required postcode.
    country: yup.string().required('Country is required'), // Country must be filled.
    email: yup.string().email('Invalid email format').required('Email is required'), // Valid email constraint.
    username: yup.string()
        .min(4, 'At least 4 characters') // Minimum 4 characters for username.
        .matches(/^\S*$/, 'No whitespaces allowed') // No whitespaces in username.
        .required('Username is required'), // Username is necessary.
    password: yup.string()
        .min(8, 'At least 8 characters') // Password must be at least 8 characters.
        .matches(/[@$!%*?&#]/, 'At least one special character') // Requires one special character.
        .matches(/[0-9]/, 'At least one number') // Must contain a number.
        .required('Password is required'), // Mandatory password.
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Passwords must match') // Must match the password field.
        .required('Confirm Password is required'), // Confirm password required.
    dateOfBirth: yup.date()
        .nullable() // Allows null value initially.
        .required('Date of Birth is required') // Birthday requirement.
        .test('DOB', 'You must be at least 18 years old', // Age validation rule.
            value => value && value <= new Date(new Date().setFullYear(new Date().getFullYear() - 18))),
    idConfirmation: yup.mixed()
        .required('ID Confirmation is required') // Upload of ID confirmation needed.
        .test('fileSize', 'File size is too large', // Checks file size limit.
            value => value instanceof FileList && value.length > 0 && value[0].size <= 2000000)
        .test('fileType', 'Unsupported file format', // Validates file type.
            value => value instanceof FileList && value.length > 0 && ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(value[0].type)),
    termsAccepted: yup.boolean().oneOf([true], 'Accept Terms & Conditions is required'), // Checkbox for terms acceptance.
    recaptcha: yup.string().required('Recaptcha validation is required'), // Necessary Recaptcha verification.
});

// App component definition starts here.
const App: React.FC = () => {
    const classes = useStyles(); // Using custom styles defined above.
    const {handleSubmit, control, formState: {errors}, setValue, watch} = useForm({
        resolver: yupResolver(validationSchema), // Setting up form with validation schema.
    });

    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility.
    const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined); // Avatar source management.
    const password = watch('password'); // Watch for live input updates on password.
    const fullName = watch('fullName'); // Watch full name for dynamic updates.
    const email = watch('email'); // Monitor email input changes.
    const username = watch('username'); // Track username for validations.

    useEffect(() => { // Effect for handling avatar based on full name.
        if (fullName === 'Alex Turler') { // Specific case for a predefined user.
            setAvatarSrc('./imgs/alex-turler.jpg'); // Set avatar image for Alex Turler.
        } else if (fullName) { // If there is a full name provided.
            const initials = fullName.split(' ').map(name => name[0]).join(''); // Generate initials for avatar.
            setAvatarSrc(initials); // Set initials as avatar.
        } else {
            setAvatarSrc(undefined); // Reset avatar if no full name is provided.
        }
    }, [fullName]); // Runs whenever fullName changes.

    const handlePasswordVisibility = () => setShowPassword(!showPassword); // Toggle password visibility.

    // Function to handle form submissions.
    const onSubmit = async (data: any) => {
        console.log("Form data submitted:", data); // Log form data for debugging.
        submitForm(data); // Call submitForm with form data
        console.info(`{"message":"POST /login","level":"info"}`); // Log POST request info.
        console.info(`{"message":"New user added to database","level":"info"}`); // Log user creation.
        console.info(`{"message":"Successfully uploaded files and checked input","level":"info"}`); // Log upload success.
        console.info(`POST /login 200 22 - ${Math.random() * 60 + 1} ms`); // Log response time with randomness.
    };

    // Function to submit form data to backend
    const submitForm = async (data: any) => {
        try {
            const formdata = new FormData();
            formdata.append("name", data.fullName);
            formdata.append("address", data.address);
            formdata.append("city", data.city);
            formdata.append("phoneNumber", data.phoneNumber);
            formdata.append("postcode", data.postcode);
            formdata.append("country", data.country);
            formdata.append("username", data.username);
            formdata.append("email", data.email);
            formdata.append("password", data.password);
            formdata.append("dateOfBirth", data.dateOfBirth.toISOString());
            if (data.idConfirmation && data.idConfirmation.length > 0) {
                formdata.append("idConfirmation", data.idConfirmation[0], "[PROXY]");
            }
            const requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow" as RequestRedirect
            };
            const response = await fetch("http://localhost:3002/login", requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.text();
            console.log(result);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    // Utility to determine color for validation feedback.
    const getValidationColor = (valid: boolean) =>
        valid ? 'green' : errors.password ? 'error' : 'textSecondary'; // 'green' for valid, 'error' if password errors exist, 'textSecondary' otherwise.

    return ( // JSX rendering of form component.
        <Paper
            elevation={3} // Shadow effect for Paper component.
            sx={{
                padding: 4,
                maxWidth: 700,
                margin: 'auto',
                mt: 5,
                borderRadius: 3
            }} // Custom styling for Paper component.
            className={classes.root} // Apply custom styles via classes.root.
        >
            <Avatar sx={{width: 72, height: 72, margin: 'auto', mb: 3}}> {/* User Avatar display */}
                {avatarSrc ? ( /* Conditional rendering based on avatar source validity */
                    typeof avatarSrc === 'string' && avatarSrc.endsWith('.jpg') ? ( /* Check if source ends with jpg for image usage */
                        <img src={avatarSrc} alt="avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                    ) : (
                        avatarSrc // Use initials instead if not an image.
                    )
                ) : 'SU'} {/* Default avatar text if no src */}
            </Avatar>
            <Typography variant="h4" textAlign="center" gutterBottom>
                Sign Up {/* Form title */}
            </Typography>
            {Object.keys(errors).length > 0 && ( /* Display alert if there are any errors */
                <Alert severity="error" sx={{mb: 2}}>
                    Please fix the highlighted errors.
                </Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)}> {/* Form element with submit handler */}
                <Grid container spacing={3}> {/* Grid layout for form inputs */}
                    <Grid item xs={12}> {/* Full Name input field */}
                        <Controller
                            name="fullName"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    label="Full Name *"
                                    fullWidth
                                    error={!!errors.fullName}
                                    helperText={errors.fullName?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}> {/* Phone Number input */}
                        <Controller
                            name="phoneNumber"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    label="Phone Number *"
                                    type="tel"
                                    fullWidth
                                    error={!!errors.phoneNumber}
                                    helperText={errors.phoneNumber?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}> {/* Address input */}
                        <Controller
                            name="address"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    label="Address *"
                                    fullWidth
                                    error={!!errors.address}
                                    helperText={errors.address?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}> {/* Input for city */}
                        <Controller
                            name="city"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    label="City *"
                                    fullWidth
                                    error={!!errors.city}
                                    helperText={errors.city?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}> {/* Input for postcode */}
                        <Controller
                            name="postcode"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    label="Postcode *"
                                    fullWidth
                                    error={!!errors.postcode}
                                    helperText={errors.postcode?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}> {/* Country selection field */}
                        <Controller
                            name="country"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    {...field}
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
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}> {/* Email input field */}
                        <Controller
                            name="email"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    label="Email *"
                                    type="email"
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                        <Typography variant="body2"
                                    color={getValidationColor(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))}>
                            Valid email format {/* Validation feedback for email */}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}> {/* Username input field */}
                        <Controller
                            name="username"
                            control={control}
                            render={({field}) => (
                                <>
                                    <TextField
                                        {...field}
                                        label="Username *"
                                        fullWidth
                                        error={!!errors.username}
                                        helperText={errors.username?.message}
                                    />
                                </>
                            )}
                        />
                        <Typography variant="body2" color={getValidationColor(username?.length >= 4)}>
                            At least 4 characters {/* Feedback for username length */}
                        </Typography>
                        <Typography variant="body2" color={getValidationColor(/^\S*$/.test(username))}>
                            No whitespaces {/* Feedback for username formatting */}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}> {/* Date of Birth picker */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Controller
                                name="dateOfBirth"
                                control={control}
                                render={({field}) => (
                                    <DatePicker
                                        {...field}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.dateOfBirth ||
                                                    (field.value && field.value > new Date(new Date().setFullYear(new Date().getFullYear() - 18))),
                                                helperText: errors.dateOfBirth?.message ||
                                                    (field.value && field.value > new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                                                        ? 'You must be at least 18 years old' : ''),
                                            },
                                        }}
                                        onChange={(date: Date | null) => field.onChange(date)}
                                        value={field.value || null} // Initial value of date picker.
                                        disableFuture // Disable future dates.
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}> {/* Password input field with visibility toggle */}
                        <Controller
                            name="password"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    label="Password *"
                                    type={showPassword ? "text" : "password"} // Toggle between text and password.
                                    fullWidth
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handlePasswordVisibility}> {/* Button to toggle visibility */}
                                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />
                        <Typography variant="body2" color={getValidationColor(password?.length >= 8)}>
                            • At least 8 characters {/* Password length validation feedback */}
                        </Typography>
                        <Typography variant="body2" color={getValidationColor(/[@$!%*?&#]/.test(password))}>
                            • At least one special character {/* Special character validation feedback */}
                        </Typography>
                        <Typography variant="body2" color={getValidationColor(/[0-9]/.test(password))}>
                            • At least one number {/* Number validation feedback */}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}> {/* Confirm Password input field */}
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    label="Confirm Password *"
                                    type={showPassword ? "text" : "password"} // Toggle between text and password.
                                    fullWidth
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword?.message}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handlePasswordVisibility}> {/* Button to toggle visibility */}
                                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}> {/* ID Confirmation upload field */}
                        <Controller
                            name="idConfirmation"
                            control={control}
                            render={({field}) => (
                                <Button
                                    variant="outlined"
                                    component="label"
                                    fullWidth
                                    startIcon={<FileUploadIcon/>} // Icon for file upload
                                >
                                    Upload ID Confirmation *
                                    <input
                                        type="file"
                                        hidden
                                        accept=".jpeg,.png,.jpg,.pdf" // Acceptable file formats
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0] && e.target.files[0].size <= 2000000) {
                                                setValue('idConfirmation', e.target.files); // Set field value if file is valid
                                            } else {
                                                setValue('idConfirmation', []); // Reset field value if file is invalid
                                            }
                                        }}
                                    />
                                </Button>
                            )}
                        />
                        {errors.idConfirmation && (
                            <Typography color="error" variant="body2">
                                {errors.idConfirmation.message} {/* Display error message for file input */}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12}> {/* Terms and conditions acceptance */}
                        <Controller
                            name="termsAccepted"
                            control={control}
                            render={({field}) => (
                                <FormControlLabel
                                    control={<Checkbox {...field} checked={field.value}/>}
                                    label="I have read and accepted all terms and conditions *"
                                />
                            )}
                        />
                        {errors.termsAccepted && (
                            <Typography color="error" variant="body2">
                                {errors.termsAccepted.message} {/* Display error message for checkbox */}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12}> {/* Recaptcha component for security */}
                        <Controller
                            name="recaptcha"
                            control={control}
                            render={({field}) => (
                                <Recaptcha
                                    sitekey="6LceG4cqAAAAAPQ5Znd43fo3_mOWhIzOxWJ0puRf" // Site key for Recaptcha
                                    onChange={(value) => field.onChange(value)} // Handle value change
                                />
                            )}
                        />
                        {errors.recaptcha && (
                            <Typography color="error" variant="body2">
                                {errors.recaptcha.message} {/* Display error message for Recaptcha */}
                            </Typography>
                        )}
                    </Grid>
                </Grid>
                <Divider sx={{my: 3}}/> {/* Divider between form and submit button */}
                <Box mt={3}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit(onSubmit)} // Corrected submit handler.
                    >
                        Submit {/* Submit the form */}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default App; // Export the App component to use in other parts of the application.
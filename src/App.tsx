import React, {useState} from "react";
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
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FileUploadIcon from "@mui/icons-material/CloudUpload";
import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Recaptcha from "react-google-recaptcha";

const App: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        address: "",
        city: "",
        postcode: "",
        country: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        dateOfBirth: null as Date | null,
        idConfirmation: null as File | null,
        termsAccepted: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type, checked} = event.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFormData({...formData, idConfirmation: event.target.files[0]});
        }
    };

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Perform form submission logic
        console.log("Form data submitted:", formData);
    };

    return (
            <Box sx={{maxWidth: 500, mx: "auto", p: 3, boxShadow: 3, borderRadius: 2}}>
                <Typography variant="h5" textAlign="center" gutterBottom>
                    Sign Up
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Full Name"
                                name="fullName"
                                fullWidth
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Phone Number"
                                name="phoneNumber"
                                type="tel"
                                fullWidth
                                required
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Address"
                                name="address"
                                fullWidth
                                required
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="City"
                                name="city"
                                fullWidth
                                required
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Postcode"
                                name="postcode"
                                fullWidth
                                required
                                value={formData.postcode}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Country"
                                name="country"
                                select
                                fullWidth
                                required
                                value={formData.country}
                                onChange={handleChange}
                            >
                                {/* Add country options here */}
                                <MenuItem value="USA">USA</MenuItem>
                                <MenuItem value="Canada">Canada</MenuItem>
                                <MenuItem value="UK">UK</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                fullWidth
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Username"
                                name="username"
                                fullWidth
                                required
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                required
                                value={formData.password}
                                onChange={handleChange}
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
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Confirm Password"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
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
                        </Grid>
                        <Grid item xs={12}>
                            <DatePicker
                                label="Date of Birth"
                                value={formData.dateOfBirth}
                                onChange={(date: Date | null) => setFormData({...formData, dateOfBirth: date})}
                                renderInput={(params: any) => <TextField fullWidth required {...params} />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                startIcon={<FileUploadIcon/>}
                            >
                                Upload ID Confirmation
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileUpload}
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Recaptcha
                                sitekey="YOUR_RECAPTCHA_SITE_KEY"
                                onChange={(value) => console.log("Captcha value:", value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="termsAccepted"
                                        checked={formData.termsAccepted}
                                        onChange={handleChange}
                                    />
                                }
                                label="I have read and accepted all terms and conditions"
                            />
                        </Grid>
                    </Grid>
                    <Box mt={2}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Submit
                        </Button>
                    </Box>
                </form>
            </Box>

    );
};

export default App;

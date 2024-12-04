# 🚀 Crypto Signup App

## 1. 📝 Preface

### 1.1 🎯 Purpose  
This document outlines the development of a crypto market registration form as part of LB2 for Module 294. The project involves creating an interactive front-end webpage using **React**, **TypeScript**, and **Material-UI (MUI)**, with a focus on proper validation, security, and interactivity.

### 1.2 Prerequisites
To run and develop the application, the following tools are required:
- **Node.js** (LTS version recommended)
- A React app initialized with:  

  npx create-react-app --template typescript

Crypto Market Registration Form

## 1.3 LB2 Details

- **Auxiliary Means:** Open Book  
- **Weight:** 70%  
- **Group Size:** Individual  
- **Duration:**  
  - 1-2 hours for installation  
  - 13 hours for programming work  
- **Assessment:** Linear  
- **Points:** 70  

---

## 2. The Project: Crypto Market Registration Form

### 2.1 General Description
The goal of this project is to implement a user registration form for a crypto marketplace. Users can fill in their details, and upon submission, the data is sent to a backend server after validating all inputs.

---

### 2.2 Technology Stack

- **React** (with TypeScript)  
- **React Hook Forms** for form handling and validation  
- **Material-UI (MUI)** for styling  
- **Docker** for server management  

---

### 2.3 Project Specifications

#### Required Fields:

1. **Name**: Required  
2. **Phone Number**: Required  
3. **Address**: Required  
4. **City**: Required  
5. **Country**:  
   - Dropdown selection from a predefined list  
   - Required  
6. **Postcode**: Required  
7. **Email**:  
   - Required  
   - Must follow proper email format  
8. **Username**:  
   - Required  
   - Unique (server rejects duplicates)  
   - Reasonable restrictions (e.g., length, characters)  
9. **Password**:  
   - Required  
   - Must meet security restrictions  
   - Confirm password field to match  
10. **Date of Birth**:  
    - Required  
    - Users must be 18+ years old  
11. **ID Confirmation**:  
    - Upload an official document in **JPEG**, **PNG**, or **PDF** format  
    - File size restriction applies  

#### Additional Features:

- **Submit Button**:  
  - Validates all fields  
  - Sends data to the backend on success  
  - Displays errors for invalid inputs  

---

### 2.4 Bonus Objectives

1. **Terms and Conditions**:  
   - A checkbox to confirm acceptance.  
2. **Captcha**:  
   - Google Captcha to verify user authenticity.  
3. **Flags for Country Dropdown**:  
   - Show flags alongside country names (e.g., Switzerland, Germany, Austria).  

---

### 2.5 Design Guidelines

- Use **Material-UI** for form styling.  
- Indicate invalid inputs through visual feedback (e.g., red borders or error messages).  
- Redirect users to a confirmation page upon successful submission.  

---

### 2.6 Functionality

- **Validation**: Ensure all fields are correctly filled before submission.  
- **Feedback**: Show interactive error messages for invalid inputs.  
- **Server Communication**:  
  - Send data via a `POST` request to the backend.  
  - Handle server responses (e.g., display a message if the username is already taken).  

#### Backend Example:


{
  "name": "Hans Fritz",
  "address": "Bachweg 23",
  "city": "Zurich",
  "phoneNumber": "+41712345678",
  "postcode": "8001",
  "country": "Switzerland",
  "username": "lol32",
  "email": "hans.fritz@example.com",
  "password": "qwerty123",
  "dateOfBirth": "1986-12-18T15:28:00.000Z"
}

```json
Server listens on port 3002.

## Server Information

- **Server Port:** 3002  
- **File Format Restrictions for `idConfirmation` Files:**  
  - `image/png`  
  - `image/jpeg`  
  - `image/jpg`  
  - `application/pdf`  

---

## 3. Evaluation Criteria

### 3.1 Form Implementation (50%):

- Clean, modular code  
- Effective use of TypeScript and React features  
- Asynchronous communication with the backend  

### 3.2 Validation & Security (30%):

- Proper validation for all fields  
- Secure password and file handling  

### 3.3 Completeness (20%):

- All required fields implemented  
- Valid countries dropdown  
- Error handling on submit  

### 3.4 Bonus (12% max):

- Terms & Conditions checkbox  
- Captcha implementation  
- Country flags  

---

## 4. Additional Exercises

### Date Format:

- Adjust date input to German format (e.g., **DD.MM.YYYY**).  

### Country Flags:

- Display flags alongside specific countries.  
- Prioritize **Switzerland**, **Germany**, and **Austria**.  

---

## Submission

1. **Exclude `node_modules`:** Ensure the `node_modules` folder is excluded, for example, using `.gitignore`.  
2. **Submit Options:**  
   - Push your solution to the designated Git repository.  
   - Alternatively, upload the project as a **ZIP file**.  

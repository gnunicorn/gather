
import React from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import AccessForm from '../components/forms/AccessForm';
import * as userService from '../services/userService';


const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email("Please use a valid email")
        .required('Required'),
    password: Yup.string()
        .min(6, "Password too short")
        .max(22, "Password too long")
        .required(),
  });

export default function SignupContainer (props) {
    return (
        <Formik
            initialValues={{ 
                email: '', 
                password: '',
            }}
            
            validationSchema={LoginSchema}

            onSubmit={(values, { setSubmitting }) => {
                console.log("Signup success");
                userService.signup(values.email, values.password);
            }}
        >
             {(props) => (
                <AccessForm newUser={true} {...props}></AccessForm>
            )}
        </Formik>
    )
}
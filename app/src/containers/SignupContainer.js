
import React from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import AccessForm from '../components/forms/AccessForm';
import * as userService from '../services/userService';
import useReactRouter from 'use-react-router';

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
    const { history } = useReactRouter();
    return (
        <Formik
            initialValues={{ 
                email: '', 
                password: '',
            }}
            
            validationSchema={LoginSchema}

            onSubmit={(values, { setSubmitting }) => {
                console.log("Signup success");
                userService.signup(values.email, values.password).then((res) => {
                    if(res) {
                        history.push("/login/");
                    }
                });
            }}
        >
             {(props) => (
                <AccessForm newUser={true} {...props}></AccessForm>
            )}
        </Formik>
    )
}
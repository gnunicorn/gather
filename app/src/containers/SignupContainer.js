
import React from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import AccessForm from '../components/forms/AccessForm';

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .required('Required'),
    password: Yup.string()
        .required(),
  });

export default function SignupContainer (props) {
    const {
        onSubmit
    } = props;

    return (
        <Formik
            initialValues={{ 
                email: '', 
                password: '',
            }}
            
            validationSchema={LoginSchema}

            onSubmit={(values, { setSubmitting }) => {
                onSubmit(values)
            }}
        >
             {(props) => (
                <AccessForm newUser="true" {...props}></AccessForm>
            )}
        </Formik>
    )
}
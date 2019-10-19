
import React from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import EventForm from '../components/forms/EventForm';

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .required('Required'),
    password: Yup.string()
        .required(),
  });

export default function LoginContainer (props) {
    const {
        onSubmit
    } = props;

    return (
        <Formik
            initialValues={{ 
                title: '', 
                groupId: groupId,
                startDate: new Date(),
                endDate: new Date()
            }}
            
            validationSchema={EventSchema}

            onSubmit={(values, { setSubmitting }) => {
                onSubmit(values)
            }}
        >
             {(props) => (
                <EventForm {...props}></EventForm>
            )}
        </Formik>
    )
}
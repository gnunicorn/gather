
import React from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import CreateGroup from '../components/forms/CreateGroup';

const GroupSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    tagline: Yup.string()
        .min(3, 'Too Short!')
        .max(50, 'Too Long!'),
  });

export default function CreateGroupContainer (props) {
    const {
        onSubmit,
    } = props;

    return (
        <Formik
            initialValues={{ 
                title: '', 
                tagline: '',
            }}
            
            validationSchema={GroupSchema}

            onSubmit={(values, { setSubmitting }) => {
                onSubmit(values)
            }}
        >
             {(props) => (
                <CreateGroup {...props}></CreateGroup>
            )}
        </Formik>
    )
}
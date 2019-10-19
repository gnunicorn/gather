
import React from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import GroupForm from '../components/forms/GroupForm';

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
    return (
        <Formik
            initialValues={{ 
                title: '', 
                tagline: '',
            }}
            
            validationSchema={GroupSchema}

            onSubmit={(values, { setSubmitting }) => {
                console.log("Create group success", values)
            }}
        >
             {(props) => (
                <GroupForm newGroup={true} {...props}></GroupForm>
            )}
        </Formik>
    )
}

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

export default function EditGroupContainer (props) {
    // TODO: check user permission level, redirect if not appropriate
    const {
        onSubmit,
        groupData
    } = props;

    return (
        <Formik
            initialValues={{ 
                id: groupdData.id,
                title: groupData.title, 
                tagline: groupdData.tagline,
            }}
            
            validationSchema={GroupSchema}

            onSubmit={(values, { setSubmitting }) => {
                onSubmit(values)
            }}
        >
             {(props) => (
                <GroupForm {...props}></GroupForm>
            )}
        </Formik>
    )
}
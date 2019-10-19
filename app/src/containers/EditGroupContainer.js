
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
        match:{
            param:{
                groupId
            }
        }
    } = props;

    let groupData = {

    }

    // TODO Effect to get data
    return (
        <Formik
            initialValues={{ 
                id: groupId,
                title: groupData.title, 
                tagline: groupData.tagline,
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
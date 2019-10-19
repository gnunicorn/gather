
import React from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import GroupForm from '../components/forms/GroupForm';
import useReactRouter from 'use-react-router';

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
        match:{
            params:{
                groupId
            }
        }
    } = props;

    let groupData = {

    }
    const { history } = useReactRouter();

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
                console.log("Edit group success", values)
                history.push(`/groups/${values.id}`)
            }}
        >
             {(props) => (
                <GroupForm newGroup={false} {...props}></GroupForm>
            )}
        </Formik>
    )
}

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

export default function CreateGroupContainer (props) {
    const { history } = useReactRouter();
    return (
        <Formik
            initialValues={{ 
                title: '', 
                tagline: '',
            }}
            
            validationSchema={GroupSchema}

            onSubmit={(values, { setSubmitting }) => {
                console.log("Create group success", values)
                // TODO: wire up to chain
                const newGroupId = false;
                if(newGroupId) {
                    history.push(`/groups/${newGroupId}`)
                }
            }}
        >
             {(props) => (
                <GroupForm newGroup={true} {...props}></GroupForm>
            )}
        </Formik>
    )
}
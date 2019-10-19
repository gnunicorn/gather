import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import GroupForm from '../components/forms/GroupForm';
import useReactRouter from 'use-react-router';
import * as gatherService from '../services/gatherService';

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
                gatherService.createGroup(values).then((res) => {
                    if(res) {
                        history.push(`/groups/${res}`)
                    }
                })                
            }}
        >
             {(props) => (
                <GroupForm newGroup={true} {...props}></GroupForm>
            )}
        </Formik>
    )
}
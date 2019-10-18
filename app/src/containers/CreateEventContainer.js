
import React from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import CreateEvent from '../components/forms/CreateEvent';

const EventSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    tagline: Yup.string()
        .min(3, 'Too Short!')
        .max(50, 'Too Long!'),
    groupId: Yup.string()
        .required(),
    startDate: Yup.date()
        .required(),
    endDate: Yup.date()
        .when(
          'startDate',
          (startDate, schema) => (startDate && schema.min(startDate, "End date must be after the start date"))
          
        )
        .required(),
  });

export default function CreateEventContainer (props) {
    const {
        onSubmit,
        groupId
    } = props;

    return (
        <Formik
            initialValues={{ 
                title: '', 
                tagline: '',
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
                <CreateEvent {...props}></CreateEvent>
            )}
        </Formik>
    )
}
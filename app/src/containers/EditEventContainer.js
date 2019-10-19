
import React from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import EventForm from '../components/forms/EventForm';

const EventSchema = Yup.object().shape({
    id: Yup.string()
        .required(),
    title: Yup.string()
        .min(3, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
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

export default function EditEventContainer (props) {
    const {
        onSubmit,
        eventData
    } = props;

    return (
        <Formik
            initialValues={{ 
                id: eventData.id,
                title: eventData.title, 
                groupId: eventData.groupId,
                startDate: eventData.startDate,
                endDate: eventData.endDate
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
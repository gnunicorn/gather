
import React from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import EventForm from '../components/forms/EventForm';
import useReactRouter from 'use-react-router';

const EventSchema = Yup.object().shape({
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

export default function CreateEventContainer (props) {
    const {
        match:{
            params:{
                groupId
            }
        } 
    } = props;
    const { history } = useReactRouter();
    // TODO: check user permission level of group, redirect if not appropriate
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
                console.log("Create event success", values)
                // TODO: wire up to chain
                const newEventId = false;
                if(newEventId) {
                    history.push(`/events/${newEventId}`)
                }
            }}
        >
             {(props) => (
                <EventForm newEvent={true} {...props}></EventForm>
            )}
        </Formik>
    )
}
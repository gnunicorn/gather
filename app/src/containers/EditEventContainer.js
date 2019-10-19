
import React from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import EventForm from '../components/forms/EventForm';
import useReactRouter from 'use-react-router';

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
    // TODO: check user permission level, redirect if not appropriate
    const {
        match:{
            params:{
                eventId
            }
        } 
    } = props;

    let eventData = {
        
    }
    // TODO: effect to get the data 

    const { history } = useReactRouter();

    return (
        <Formik
            initialValues={{ 
                id: eventId,
                title: eventData.title, 
                groupId: eventData.groupId,
                startDate: eventData.startDate,
                endDate: eventData.endDate
            }}
            
            validationSchema={EventSchema}

            onSubmit={(values, { setSubmitting }) => {
                console.log("Edit event success", values)
                history.push(`/events/${values.id}`)
            }}
        >
             {(props) => (
                <EventForm newEvent={false} {...props}></EventForm>
            )}
        </Formik>
    )
}
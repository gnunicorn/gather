
import React, { useState } from 'react';
import { EventCardDummyData, MembersDummyData } from '../dummyData';
import ViewEvent from '../components/pages/ViewEvent';
import * as gatherService from '../services/gatherService';

export default function ViewEventContainer (props) {
    const {  
        match:{
            params:{
                eventId
            }
        } 
    } = props;

    // TODO Resolve event Data via event ID
    const event = EventCardDummyData ? EventCardDummyData.filter(item => item.id === parseInt(eventId))[0] : null;
    let data = {
        meta: {
            title: event ? event.title : "",
            subtitle: event ? event.subtitle : "",
            id: eventId
        },
        members: MembersDummyData,
    }
    const [loading, setLoading] = useState(false);

    return (
        <ViewEvent 
            loading={loading}
            rsvp={async () => {
                console.log("RSVP Action triggered");
                setLoading(true);
                await gatherService.rsvp(eventId);
                setLoading(true);
            }} 
            {...data}
        ></ViewEvent>

    )
}
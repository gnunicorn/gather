
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
    let data = {
        meta: {
            title: EventCardDummyData[0].title,
            subtitle: EventCardDummyData[0].subtitle,
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
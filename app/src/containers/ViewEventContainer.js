
import React from 'react';
import { EventCardDummyData, MembersDummyData } from '../dummyData';
import ViewEvent from '../components/pages/ViewEvent';

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

    return (
        <ViewEvent {...data}></ViewEvent>

    )
}
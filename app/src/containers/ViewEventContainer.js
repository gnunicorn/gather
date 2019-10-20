
import React, { useState } from 'react';
import { EventCardDummyData, MembersDummyData } from '../dummyData';
import ViewEvent from '../components/pages/ViewEvent';
import * as gatherService from '../services/gatherService';
import { USER_TYPE } from "../Constants"

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
                const newMember = {
                    id: "asdasd123123",
                    accountAddress: "5HmWeDzF7ito4GLmfSioS6DX9dgQvx2YUki2ZprzsUwe2YuS",
                    name: "Ben",
                    email: "ben@gnunicorn.org",
                    role: USER_TYPE.MEMBER,
                };
                setLoading(true);
                const result = await gatherService.rsvp(eventId);
                if(result) {
                    data.members.push(newMember);
                }
                setLoading(false);
            }} 
            {...data}
        ></ViewEvent>

    )
}
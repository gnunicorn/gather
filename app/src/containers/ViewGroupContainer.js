
import React from 'react';
import ViewGroup from '../components/pages/ViewGroup';
import { GroupCardDummyData, EventCardDummyData, MembersDummyData } from '../dummyData';

export default function ViewGroupContainer (props) {
    const {
        match:{
            params:{
                groupId
            }
        } 
    } = props;

    // TODO Resolve group Data via group ID
    let data = {
        meta: {
            title: GroupCardDummyData[0].title,
            subtitle: GroupCardDummyData[0].subtitle,
        },
        members: MembersDummyData,
        events: EventCardDummyData
    }

    return (
        <ViewGroup {...data}></ViewGroup>
    )
}
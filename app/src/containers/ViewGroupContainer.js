
import React, {useEffect} from 'react';
import ViewGroup from '../components/pages/ViewGroup';
import { GroupCardDummyData, EventCardDummyData, MembersDummyData } from '../dummyData';
import * as gatherService from '../services/gatherService';

export default function ViewGroupContainer (props) {
    const {
        match:{
            params:{
                groupId
            }
        } 
    } = props;

    useEffect(() => {
        let unsubscribeAll = null;
        gatherService.getGroupDetails(groupId)
        .then((data) => console.log(data.toString()));
        return () => unsubscribeAll && unsubscribeAll();
      },[groupId]);

    // TODO Resolve group Data via group ID
    let data = {
        meta: {
            title: GroupCardDummyData[0].title,
            subtitle: GroupCardDummyData[0].subtitle,
            id: groupId
        },
        members: MembersDummyData,
        events: EventCardDummyData
    }

    return (
        <ViewGroup {...data}></ViewGroup>
    )
}
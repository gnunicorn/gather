
import React, {useEffect, useState} from 'react';
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

    // useEffect(() => {
    //     let unsubscribeAll = null;
    //     gatherService.getGroupDetails(groupId)
    //     .then((data) => console.log(data.toString()));
    //     return () => unsubscribeAll && unsubscribeAll();
    //   },[groupId]);

    // TODO Resolve group Data via group ID
    const group = GroupCardDummyData ? GroupCardDummyData.filter(item => item.id === parseInt(groupId))[0] : null;
    let data = {
        meta: {
            title: group ? group.title : null,
            subtitle: group ? group.subtitle : null,
            id: groupId
        },
        members: MembersDummyData,
        events: EventCardDummyData
    }
    const [loading, setLoading] = useState(false);
    return (
        <ViewGroup 
            loading={loading}
            joinGroup={async () => {
                console.log("Join group Action triggered");
                setLoading(true);
                await gatherService.joinGroup(groupId);
                setLoading(false);
            }} 
            {...data}></ViewGroup>
    )
}
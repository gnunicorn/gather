
import React from 'react';

export default function ViewGroupContainer (props) {
    const {
        match:{
            params:{
                groupId
            }
        } 
    } = props;

    return (
    <div >
       ViewGroupContainer {groupId}
    </div>
    )
}
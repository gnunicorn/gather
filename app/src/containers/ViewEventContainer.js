
import React from 'react';

export default function ViewEventContainer (props) {
    const {  
        match:{
            params:{
                eventId
            }
        } 
    } = props;
    //
    
    return (
    <div>
       ViewEventContainer {eventId}
    </div>
    )
}
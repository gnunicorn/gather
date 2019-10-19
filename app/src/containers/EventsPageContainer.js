import React from 'react';
import { Typography } from '@material-ui/core';
import CardGrid from '../components/cards/CardGrid';
import CardBase from '../components/cards/CardBase';

const EventCardDummyData = [
    {
        id: "1234567io",
        title: "Diffusion 2019",
        subTitle: "19 Oct 2019 - 20 Oct 2019",
        type: "Event",
        link: "/events/diffusion-2019",
        image: null
    },
    {
        id: "1234567ip",
        title: "Devcon 2020",
        subTitle: "?? ?? 2019 - ? ? 2020",
        type: "Event",
        link: "/events/devcon-2020",
        image: null
    }
]

export default function EventsPageContainer (props) {
    // TODO: use effect to fetch data
    return (
        <section>
            <Typography variant="h3" component="h3">
                Events
            </Typography>
            <CardGrid>
                {
                    EventCardDummyData.map(card => 
                        (<CardBase key={card.id} {...card}></CardBase>)
                    )
                }
            </CardGrid>
        </section>
    )
}
import { USER_TYPE } from "./Constants"

export const EventCardDummyData = [
    {
        id: "1234567io",
        title: "Diffusion 2019",
        subtitle: "19 Oct 2019 - 20 Oct 2019",
        type: "Event",
        link: "/events/diffusion-2019",
        bannerImage: null
    },
    {
        id: "1234567ip",
        title: "Devcon 2020",
        subtitle: "?? ?? 2019 - ? ? 2020",
        type: "Event",
        link: "/events/devcon-2020",
        bannerImage: null
    }
]


export const GroupCardDummyData = [
    {
        id: "1234567i234234",
        title: "Department of Decentralisation",
        subtitle: "Additional meta",
        type: "Group",
        link: "/groups/department-of-decentralisation",
        image: null
    },
]

export const MembersDummyData = [
    {
        id: "asdasd123123",
        name: "Sophia",
        email: "nah@nope.com",
        role: USER_TYPE.MEMBER,
    },
    {
        id: "a2127293389247",
        name: "Greg",
        email: "meh@eish.com",
        role: USER_TYPE.ORGANIZER,
    },
    {
        id: "a2127293389248",
        name: "Not Greg",
        email: "hmm@bah.com",
        role: USER_TYPE.ADMIN,
    }
]
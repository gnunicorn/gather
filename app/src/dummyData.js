import { USER_TYPE } from "./Constants"

export const EventCardDummyData = [
    {
        id: "6",
        title: "Diffusion 2019",
        subtitle: "19 Oct 2019 - 20 Oct 2019",
        type: "Event",
        link: "/events/6",
        bannerImage: null
    },
    {
        id: "7",
        title: "Devcon 2020",
        subtitle: "Some cool text.",
        type: "Event",
        link: "/events/7",
        bannerImage: null
    },
    {
        id: "8",
        title: "Substrate Hack 'n Chill.",
        subtitle: "Some cool text.",
        type: "Event",
        link: "/events/8",
        bannerImage: null
    },
    {
        id: "9",
        title: "Blockchain Summit Latam",
        subtitle: "Some cool text.",
        type: "Event",
        link: "/events/9",
        bannerImage: null
    }
]


export const GroupCardDummyData = [
    {
        id: "3",
        title: "Department of Decentralisation",
        subtitle: "Additional meta",
        type: "Group",
        link: "/groups/department-of-decentralisation",
        image: null
    },
    {
        id: "4",
        title: "Factory",
        subtitle: "Additional meta",
        type: "Group",
        link: "/groups/factory",
        image: null
    },
    {
        id: "5",
        title: "Substrate Rocks",
        subtitle: "Additional meta",
        type: "Group",
        link: "/groups/substrate-rocks",
        image: null
    },
]

export const MembersDummyData = [
    {
        id: "asdasd123123",
        accountAddress: "DmPcLNKzCknkC9v9uG4insNqQeLLKxLxfKHwTECMm8w5uKH",
        name: "Sophia",
        email: "nah@nope.com",
        role: USER_TYPE.MEMBER,
    },
    {
        id: "a2127293389247",
        accountAddress: "oStrithcesARentliKeleMONSlikeGRapES",
        name: "Greg",
        email: "meh@eish.com",
        role: USER_TYPE.ORGANIZER,
    },
    {
        id: "a2127293389248",
        accountAddress: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        name: "Not Greg",
        email: "hmm@bah.com",
        role: USER_TYPE.ADMIN,
    }
]
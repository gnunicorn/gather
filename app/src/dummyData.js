import { USER_TYPE } from "./Constants"

export const EventCardDummyData = [
    {
        id: 6,
        title: "Diffusion 2019",
        subtitle: "19 Oct 2019 - 20 Oct 2019",
        type: "Event",
        link: "/events/6",
        groupId: 3,
        bannerImage: null
    },
    {
        id: 7,
        title: "Devcon 2020",
        subtitle: "Some cool text.",
        type: "Event",
        link: "/events/7",
        groupId: 3,
        bannerImage: null
    },
    {
        id: 8,
        title: "Substrate Hack 'n Chill.",
        subtitle: "Some cool text.",
        type: "Event",
        link: "/events/8",
        groupId: 5,
        bannerImage: null
    },
    {
        id: 9,
        title: "Blockchain Summit Latam",
        subtitle: "Some cool text.",
        type: "Event",
        link: "/events/9",
        groupId: 5,
        bannerImage: null
    }
]


export const GroupCardDummyData = [
    {
        id: 3,
        title: "Department of Decentralisation",
        subtitle: "Additional meta",
        type: "Group",
        link: "/groups/3",
        image: null
    },
    {
        id: 5,
        title: "Substrate Rocks",
        subtitle: "Additional meta",
        type: "Group",
        link: "/groups/5",
        image: null
    }
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
        accountAddress: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        name: "Greg",
        email: "meh@eish.com",
        role: USER_TYPE.ORGANIZER,
    },
    {
        id: "a2127293389248",
        accountAddress: "5FA9nQDVg267DEd8m1ZypXLBnvN7SFxYwV7ndqSYGiN9TTpu",
        name: "Not Greg",
        email: "hmm@bah.com",
        role: USER_TYPE.ADMIN,
    }
]
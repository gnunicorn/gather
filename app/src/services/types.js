export const customTypes = {
    "Reference": "u64",
    "CommunityId": "Reference",
    "GroupId": "Reference",
    "GatheringId": "Reference",
    "ExternalData": "Vec<u8>",
    "LatLong": "(u64, u64)",
    "Timezone": "u8",
    "Timestamp": "u64",
    "Location": {
        "_enum": {
            "Global": null,
            "Remote": "Option<Timezone>",
            "Local": "LatLong"
          }
    },
    "Role": {
        "_enum": ["Member", "Moderator", "Organiser", "Admin"]
    },
    "RSVPStates": {
        "_enum": ["Yes", "No", "Maybe", "Waitinglist"]
    },
    "Community": {
        "metadata": "ExternalData",
        "created_at": "Timestamp",
        "updated_at": "Timestamp"
    },
    "Group": {
        "belongs_to": "CommunityId",
        "location": "Location",
        "metadata": "ExternalData",
        "created_at": "Timestamp",
        "updated_at": "Timestamp"
    },
    "Gathering": {
        "belongs_to": "Vec<GroupId>",
        "location": "Location",
        "rsvp_opens": "Timestamp",
        "rsvp_closes": "Timestamp",
        "starts_at": "Timestamp",
        "ends_at": "Timestamp",
        "max_rsvps": "u32",
        "metadata": "ExternalData",
        "created_at": "Timestamp",
        "updated_at": "Timestamp"
    },
    "GatheringInput": {
        "location": "Location",
        "rsvp_opens": "Timestamp",
        "rsvp_closes": "Timestamp",
        "max_rsvps": "u32",
        "metadata": "ExternalData"
    },
    "Membership": {
        "role": "Role",
        "created_at": "Timestamp",
        "updated_at": "Timestamp"
    },
    "RSVP": {
        "state": "RSVPStates",
        "created_at": "Timestamp",
        "updated_at": "Timestamp"
    }
}
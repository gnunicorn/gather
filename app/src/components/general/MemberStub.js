import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { mixins } from '../../theme';
import { grey } from '@material-ui/core/colors';
import { Typography } from '@material-ui/core';
import Avatar from 'avataaars'
import { AVATAR_PROPS } from '../../Constants';

const avatarSize = 40;
const avatarMargin = 20;

const useStyles = makeStyles(theme => ({
    root:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: "300px",
        margin: "10px auto",
        borderRadius: "0 10px 0 10px",
        backgroundColor: grey.A200,
        alignItems: "center",
        cursor: "pointer"
    },
    avatar:{
        marginRight: 20,
        overflow: "hidden",
        position: "relative",
        height: avatarSize,
        width: avatarSize,
        borderRadius: "10px",
        "& > *":{
            height: "100% !important",
            width: "100% !important",
        }
    },
    metaArea:{
        maxWidth: `calc(100% - ${avatarSize + avatarMargin}px)`,

        "& > *":{
            maxWidth: "100%",
            ...mixins.ellipsisOverflow
        }
    }
  }));


export default function MemberStub(props) {
    const classes = useStyles();

    const {
        accountAddress,
        role
    } = props;

    let attribute = (index, options) => {
        return options[accountAddress.charCodeAt(index) % (options.length -1)]
    };
    

    return (
    <section className={classes.root}>
       <div className={classes.avatar}>

            <Avatar
                className={classes.chipImage}
                avatarStyle='Circle'
                topType={attribute(1, AVATAR_PROPS.HAIRS)}
                accessoriesType='Prescription02'
                hairColor={attribute(5, AVATAR_PROPS.HAIR_COLORS)}
                facialHairType={attribute(7, AVATAR_PROPS.FACIAL_HAIRS)}
                clotheType={attribute(3, AVATAR_PROPS.CLOTHS)}
                clotheColor={attribute(4, AVATAR_PROPS.CLOTH_COLORS)}
                eyeType='Default'
                eyebrowType='DefaultNatural'
                mouthType={attribute(2, AVATAR_PROPS.MOUTHS)}
                skinColor={attribute(6, AVATAR_PROPS.SKINS)}
            />
       </div>
       <div className={classes.metaArea}>
           <Typography>
               {accountAddress}
           </Typography>
           <Typography>
               {
                   role === 0 ? "Member" : ""
               }
               {
                   role === 1 ? "Organizer" : ""
               }
               {
                   role === 2 ? "Admin" : ""
               }
           </Typography>
       </div>
    </section>)
}
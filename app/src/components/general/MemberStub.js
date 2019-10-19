import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { constants, mixins } from '../../theme';
import Blockies from 'react-blockies';
import { grey } from '@material-ui/core/colors';
import { Typography } from '@material-ui/core';

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

    return (
    <section className={classes.root}>
       <div className={classes.avatar}>
            <Blockies
                seed={accountAddress}
                size={13}
                scale={2}
                color={constants.colors.purple}
                bgColor={grey.A100}
                spotColor={constants.colors.blue}
                className={classes.chipImage}
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
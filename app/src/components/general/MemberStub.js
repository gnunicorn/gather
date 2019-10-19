import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { constants, mixins } from '../../theme';
import { grey } from '@material-ui/core/colors';
import { Typography } from '@material-ui/core';
import Avatar from 'avataaars'

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

function GatherAvatar(props) {

    const {
        accountAddress
    } = props;


    return 
}

const HAIRS = ["NoHair", "Eyepatch", "Hat", "Hijab", "Turban", "WinterHat1", "WinterHat2", "WinterHat3", "WinterHat4", "LongHairBigHair", "LongHairBob", "LongHairBun", "LongHairCurly", "LongHairCurvy", "LongHairDreads", "LongHairFrida", "LongHairFro", "LongHairFroBand", "LongHairNotTooLong", "LongHairShavedSides", "LongHairMiaWallace", "LongHairStraight", "LongHairStraight2", "LongHairStraightStrand", "ShortHairDreads01", "ShortHairDreads02", "ShortHairFrizzle", "ShortHairShaggy", "ShortHairShaggyMullet", "ShortHairShortCurly", "ShortHairShortFlat", "ShortHairShortRound", "ShortHairShortWaved", "ShortHairSides", "ShortHairTheCaesar", "ShortHairTheCaesarSidePart", ]
const HAIR_COLORS = ["Auburn", "Black", "Blonde", "BlondeGolden", "Brown", "BrownDark", "PastelPink", "Platinum", "Red", "SilverGray"];
const MOUTHS = ["Concerned", "Default", "Disbelief", "Eating", "Grimace", "Sad", "ScreamOpen", "Serious", "Smile", "Tongue", "Twinkle", "Vomit"];
const SKINS = ["Tanned",  "Yellow",  "Pale",  "Light",  "Brown",  "DarkBrown",  "Black"];
const CLOTHS = ["BlazerShirt", "BlazerSweater", "CollarSweater", "GraphicShirt", "Hoodie", "Overall", "ShirtCrewNeck", "ShirtScoopNeck", "ShirtVNeck"];
const CLOTH_COLORS = ["Black", "Blue01", "Blue02", "Blue03", "Gray01", "Gray02", "Heather", "PastelBlue", "PastelGreen", "PastelOrange", "PastelRed", "PastelYellow", "Pink", "Red", "White"];
const FACIAL_HAIRS = ["Blank", "Blank", "BeardMedium",  "BeardLight", "Blank", "Black", "BeardMajestic", "MoustacheFancy", "MoustacheMagnum"];



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
                topType={attribute(1, HAIRS)}
                accessoriesType='Prescription02'
                hairColor={attribute(5, HAIR_COLORS)}
                facialHairType={attribute(7, FACIAL_HAIRS)}
                clotheType={attribute(3, CLOTHS)}
                clotheColor={attribute(4, CLOTH_COLORS)}
                eyeType='Default'
                eyebrowType='DefaultNatural'
                mouthType={attribute(2, MOUTHS)}
                skinColor={attribute(6, SKINS)}
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
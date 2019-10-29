import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TopBanner from '../general/TopBanner';
import { Typography, Container } from '@material-ui/core';
import StandardGrid from '../general/StandardGrid';
import MemberStub from '../general/MemberStub';
import { mixins, constants } from '../../theme';
import LoadingModal from '../general/LoadingModal';
import CheckIcon from '@material-ui/icons/Check';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
const useStyles = makeStyles(theme => ({
    root:{
        paddingBottom: "20px"
    },
    headings:{
        padding: "10px 15px",
        textAlign: "center"
    },
    memberSection:{
        padding: "10px 15px",
    },
    floatingCta:{
        ...mixins.floatingCta,
        bottom: constants.footerArea + 35
    },
    buttonArea:{
        display:"flex",
        justifyContent: "center",
        flexWrap: "wrap",
        flexDirection: "row",
        "& > *":{
            margin: "10px 5px"
        }
    }
  }));
  
export default function AboutPage(props) {
    const classes = useStyles();
    const {
        meta,
        members,
        rsvp,
        loading
    } = props;


    return (
    <article className={classes.root}>
        <Container>
            <div className={classes.headings}>
                <Typography variant="h1" component="h1">
                    Gather
                </Typography>
                <Typography variant="h3" component="h3">
                    a proof of concept consortium blockchain to replace meetup.com
                </Typography>
            </div>
            <section className={classes.memberSection}>
                <p>Most important Links</p>
                <ul>
                    <li><a href="https://github.com/gnunicorn/gather" target="_blank">Github Repository</a></li>
                    <li><a href="https://github.com/gnunicorn/gather" target="_blank">Open Issues</a></li>
                    <li><a href="https://github.com/gnunicorn/gather" target="_blank">Blog Post</a></li>
                    <li><a href="https://substrate.dev" target="_blank">Substrate Developer Hub</a></li>
                </ul>
            </section>
            <section className={classes.memberSection}>
                <Typography variant="h5" component="h5">
                    Common questions answered
                </Typography>

                <Typography variant="h4" component="h4">
                    What is this?
                </Typography>
                <p>
                    This is a proof of concept blockchain for a global community event registry. Practically providing the key features
                    centralised plattforms offer, with their global overview of the entire state, combining a web2.5-ish look and feel
                    with email notifications and all while offering the same pseudonomys privacy guarantees. This project intended to
                    proof we could replace something like meetup.com with a more democratic and decentralised solution without having to
                    sacrifice the key value proposition.
                </p>
                <Typography variant="h4" component="h4">
                    How is it built?
                </Typography>
                <p>
                    This project uses blockchain technology to allow for multiple consortium nodes to stay in sync. In particular, this
                    is built using <a href="https://substrate.dev">Substrate</a>, a Rust Blockchain development kit by Parity, which offers
                    two additional key features this consortium proof of concept relies upon: offchain workers allow us to store
                    email-addresses offchain and inform users about important updates and the runtime forkless-update mechanism allows for
                    smooth transitions when the consortium wants to upgrade the software.
                </p>
                <p>
                    All data not relevant for the core functionality of the registry is stored via IPFS and only its cid is kept on chain.
                    Further more, this is using lettre, React and Material UI. The cute Avatars are generated with avataaaaar. 
                </p>
                <Typography variant="h4" component="h4">
                    Is this live/production?
                </Typography>
                <p>
                    This is a proof of concept. While what you see here, is fetching the registry from the publicly running node, and you
                    can create accounts, login, join groups and rsvp to events - all internally create transactions and issue updates of
                    the chain-state - the node is running in development-mode, does not actually send emails and is reset every hour.
                </p>

                <Typography variant="h4" component="h4">
                    How can I join?
                </Typography>
                <p>
                    <strong>As a regular user</strong>,  you can just click sign up on the top right.
                </p>
                <p>
                    <strong>As a full node</strong>, you currently can't connect to this node, as it is running in development mode and reset every hour.
                </p>
                <p>
                    <strong>As a community/consortium member</strong>, easiest is to <a href="https://github.com/gnunicorn/gather/issues/29">just comment on this ticket</a> or contact us directly (see below).
                </p>
                <Typography variant="h4" component="h4">
                    How can I contact you?
                </Typography>
                <p>
                    Interested to move this further? You can connect with <a href="https://matrix.to/#/@ben:matrix.parity.io">ben on matrix/riot</a> or via any of the contact details <a href="https://gnunicorn.org">on his homepage</a>.
                </p>
            </section>
        </Container>

    </article>
    )
};
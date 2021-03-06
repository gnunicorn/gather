import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Form, Field } from 'formik';
import { Button, Paper, FormControl, Typography } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import LoadingModal from '../general/LoadingModal';


const useStyles = makeStyles(theme => ({
  paperRoot:{
    maxWidth: 450,
    width:"100%",
    margin: "20px auto 0",
    padding: 20
  },
  root: {
    display: "flex",
    flexDirection: "column"
  },
  dateFields:{
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    "& > *":{
      width: "calc(50% - 10px)",
      display: "flex",
      flexDirection: "column"
    }
  },
  inputWrapper:{
    margin: "5px 0"
  },
  button:{
    marginTop: theme.spacing(3),
  }
}));

export default function AccessForm(props) {
  const {
    newUser,
    loading
  } = props;
  const classes = useStyles();

  return (
    <Paper square={true} className={classes.paperRoot} elevation={0}>
      <LoadingModal loading={loading}></LoadingModal>
      <Typography variant="h1" component="h1">
        { newUser ? "Please register to continue" : "Login" }
      </Typography>
      <Form className={classes.root}>
        <FormControl className={classes.inputWrapper} fullWidth>
          <Field label="Email" name="email" type="email" component={TextField} fullWidth />
        </FormControl>
        <FormControl className={classes.inputWrapper} fullWidth>
          <Field label="Password" name="password" type="password" component={TextField} fullWidth />
        </FormControl>
        <Button variant="contained" color="primary" className={classes.button} type="submit">
          { newUser ? "Register" : "Login" }
        </Button>
      </Form>
    </Paper>
  );
}
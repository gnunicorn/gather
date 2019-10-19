import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Form, Field } from 'formik';
import { Button, Paper, FormControl, Typography } from '@material-ui/core';
import { TextField } from 'formik-material-ui';

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
  inputWrapper:{
    margin: "5px 0"
  },
  button:{
    marginTop: theme.spacing(3),
  }
}));

export default function GroupForm(props) {
  const {
    newGroup
  } = props;
  const classes = useStyles();

  return (
    <Paper square={true} className={classes.paperRoot} elevation={0}>
       <Typography variant="h1" component="h1">
          { newGroup ? "Create Group Form" : "Edit Group"}
      </Typography>
      <Form className={classes.root}>
        <Field name="id" type="hidden"></Field>
        <FormControl className={classes.inputWrapper} fullWidth>
          <Field label="Title" name="title" component={TextField} fullWidth />
        </FormControl>
        <FormControl className={classes.inputWrapper} fullWidth>
          <Field label="Tagline" name="tagline" component={TextField} fullWidth/>
        </FormControl>
        <Button variant="contained" color="primary" className={classes.button} type="submit">Submit</Button>
      </Form>
    </Paper>
  );
}
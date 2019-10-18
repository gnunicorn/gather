import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Form, Field } from 'formik';
import { Button, Paper, FormControl } from '@material-ui/core';
import DateTimePickerCustom from './datetimepicker';
import { TextField } from 'formik-material-ui';

const useStyles = makeStyles(theme => ({
  paperRoot:{
    maxWidth: 450,
    width:"100%"
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

export default function CreateEvent(props) {
  const {
    errors,
    touched,
  } = props;
  const classes = useStyles();

  return (
    <Paper square={true} className={classes.paperRoot} elevation={0}>
      <Form className={classes.root}>
        <Field name="groupId" type="hidden"></Field>
        <FormControl className={classes.inputWrapper} fullWidth>
          <Field label="Title" name="title" component={TextField} fullWidth />
        </FormControl>
        <FormControl className={classes.inputWrapper} fullWidth>
          <Field label="Tagline" name="tagline" component={TextField} fullWidth/>
        </FormControl>
        <div className={classes.dateFields}>
          <div>
            <Field name="startDate"  label="Start date" component={DateTimePickerCustom} initDate  />
            {errors.startDate && touched.startDate ? <div>{errors.startDate}</div> : null}
          </div>
          <div>
            <Field name="endDate" label="End date" component={DateTimePickerCustom} />
            {errors.endDate && touched.endDate ? <div>{errors.endDate}</div> : null}
          </div>
        </div>
        <Button variant="contained" color="primary" className={classes.button} type="submit">Submit</Button>
      </Form>
    </Paper>
  );
}
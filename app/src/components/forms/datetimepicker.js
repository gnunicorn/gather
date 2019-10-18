import React from 'react';
import { DateTimePicker } from "@material-ui/pickers";

export default function DateTimePickerCustom(props) {
  const{
    label,
    field,
    form: { 
      setFieldValue, 
      setTouched 
    }, 
    disabled
  } = props;

  return (
    <DateTimePicker
        label={label}
        inputVariant="outlined"
        // disablePast
        ampm={false}
        value={field.value}
        onChange={(data)=>{
          setFieldValue(field.name, data);
          setTouched({[field.name]: true });
        }}
        disabled={disabled}
      />
  );
}
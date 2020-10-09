import { useState } from 'react';

export default function useForm(defaults) {
  const [values, setValues] = useState(defaults);

  function updateValue(e) {
    // check if it's a number and convert
    let { value } = e.target;
    if (e.target.type === 'number') {
      value = Number.parseInt(e.target.value);
    }
    setValues({
      // copy the existing values into it
      ...values,
      // update the new value that changed
      // take the name attribute of the input and set the value of that to be the value
      [e.target.name]: value,
    });
  }

  return { values, updateValue };
}

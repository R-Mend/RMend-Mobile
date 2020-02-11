const validate = values => {
    const errors = {}
    if (values.photos && values.photos.length < 1) {
        errors.photos = 'One Photo is Required'
    }
    if (!values.firstName) {
      errors.firstName = 'Required'
    }
    if (!values.lastName) {
      errors.lastName = 'Required'
    }
    if (!values.email) {
      errors.email = 'Required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address'
    }
    if (!values.sex) {
      errors.sex = 'Required'
    }
    return errors
  }  

  export default validate
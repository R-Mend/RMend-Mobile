export interface IValidationErrors {
  photos?: string,
  location?: string,
  type?: string,
  authority?: string,
  name?: string,
  email?: string
}

const validate = (values) => {
  const errors: IValidationErrors = {};
  if (values.images && values.images.length < 1) {
    errors.photos = 'One Photo is Required';
  }
  if (!values.location) {
    errors.location = 'Required';
  }
  if (!values.details.type) {
    errors.type = 'Required';
  }
  if (values.authority.authCode == '') {
    errors.authority = 'Required';
  }
  if (!values.senderInfo.name) {
    errors.name = 'Required';
  }
  if (!values.senderInfo.email) {
    errors.email = 'Required';
  }
  return errors;
};

export default validate;

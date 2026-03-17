import { ReportReducerState } from "./features/reportSlice";

export interface IValidationErrors {
  photos?: string,
  location?: string,
  type?: string,
  authority?: string,
}

const validate = (values: ReportReducerState) => {
  const errors: IValidationErrors = {};
  if (values.images && values.images.length < 1) {
    errors.photos = 'At least one photo is required to submit report.';
  }
  if (!values.location) {
    errors.location = 'Required';
  }
  if (!values.details.type) {
    errors.type = 'Required';
  }
  if (!values.authorityId) {
    errors.authority = 'Required';
  }
  return errors;
};

export default validate;

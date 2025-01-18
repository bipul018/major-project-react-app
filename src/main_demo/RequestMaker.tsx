import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { RequestInputType, RequestUnitType } from './taskItems';

export function sendPostRequest(
  requestInputs: RequestInputType[],
  fieldValues: { [field_name: string]: any },
  url: string
): Promise<any> {
  // Filter fields to include, checking for missing non-nullable fields
  const fieldsToInclude = requestInputs.filter(input => {
    if (input.nullable) {
      return input.field_name in fieldValues;
    } else {
      if (!(input.field_name in fieldValues)) {
        throw new Error(`Field '${input.field_name}' is not nullable and is missing.`);
      }
      return true;
    }
  });

  // Check if any field is of type 'video' to determine data type
  const hasFiles = fieldsToInclude.some(input => input.type === RequestUnitType.Video);

  // Prepare data based on whether files are included
  let data: any;
  if (hasFiles) {
    data = new FormData();
    fieldsToInclude.forEach(input => {
      const value = fieldValues[input.field_name];
      if (input.type === RequestUnitType.Video) {
        // Append file for 'video' type
        if (value instanceof File) {
          data.append(input.field_name, value);
        } else {
          throw new Error(`Field '${input.field_name}' expects a File but received ${typeof value}.`);
        }
      } else {
        // Append other types as strings
        data.append(input.field_name, String(value));
      }
    });
  } else {
    // Prepare JSON data
    data = Object.fromEntries(
      fieldsToInclude.map(input => [input.field_name, fieldValues[input.field_name]])
    );
  }

  // Send POST request with appropriate headers and body
  return fetch(url, {
    method: 'POST',
    headers: hasFiles ? {} : { 'Content-Type': 'application/json' },
    body: hasFiles ? data : JSON.stringify(data),
  })
    .then(response => response.json())
    .catch(error => {
      console.error(`Error: ${error}`);
      throw error;
    });
}

export type FormFieldProps = {
  field: RequestInputType;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string;
};

export const RequestFormField: React.FC<FormFieldProps> =
  ({ field, value, onChange, onBlur, error }) => {

    const [v, setV] = useState(value);

    const wrap_on_change = (val_getter: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const final_value = val_getter(e.target.value);
      setV(final_value);
      onChange(final_value);
      //console.log(`Hello, you changed the value to ${typeof(v)} as value ${final_value}`);
    };

    const input_fields = {
      id: field.field_name,
      required: !field.nullable,
      value: v || "",
      onBlur: onBlur,
    };

    switch (field.type) {
      case RequestUnitType.String:
        return (
          <Box mb={2}>
            <TextField
              label={field.field_name}
              type="text"
              fullWidth
              {...input_fields}
              onChange={wrap_on_change((v: any) => v)}
              error={!!error}
              helperText={error}
            />
          </Box>
        );
      case RequestUnitType.Integer:
        return (
          <Box mb={2}>
            <TextField
              label={field.field_name}
              type="number"
              fullWidth
              {...input_fields}
              onChange={wrap_on_change(Number)}
              error={!!error}
              helperText={error}
            />
          </Box>
        );
      case RequestUnitType.Decimal:
        return (
          <Box mb={2}>
            <TextField
              label={field.field_name}
              type="number"
              fullWidth
              {...input_fields}
              onChange={wrap_on_change(Number)}
              error={!!error}
              helperText={error}
            />
          </Box>
        );
      case RequestUnitType.Video:
	return (
	  <Box mb={2}>
	    {/* Hidden file input */}
	    <input
              type="file"
              accept="video/*"
              id={field.field_name}
              required={!field.nullable}
              onBlur={onBlur}
              onChange={(e) => {
		const final_value = e.target.files ? e.target.files[0] : null;
		setV(final_value);
		onChange(final_value);
              }}
              style={{ display: 'none' }}
	    />
	    {/* Upload and Clear buttons */}
	    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
		variant="outlined"
		component="label"
		htmlFor={field.field_name}
              >
		Upload {field.field_name}
              </Button>
              {field.nullable && (
		<Button
		  variant="outlined"
		  onClick={() => {
		    setV(null);
		    onChange(null);
		  }}
		>
		  Clear
		</Button>
              )}
	    </Box>
	    {/* Display file name */}
	    {v && (
              <Typography variant="body2" sx={{ mt: 1 }}>
		Selected file: <strong>{v.name}</strong>
              </Typography>
	    )}
	    {error && <Typography color="error">{error}</Typography>}
	  </Box>
	);
      default:
        throw new Error("Tried to make RequestFormField for unsupported input type");
    }
  };

export const FormComponent: React.FC<{
  fields: RequestInputType[];
  endpoint: string;
  onResponse: (response: { status: 'Success' | 'Error'; value: any }) => void;
  overrides?: {
    [key: string]: any | (() => any); // Key can be field names or 'url'
  };
}> = ({ fields, endpoint, onResponse, overrides = {} }) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [url, setUrl] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionMessage, setSubmissionMessage] = useState<string>('');

  // Helper function to get the value of an overridden field
  const getOverriddenValue = (fieldName: string) => {
    if (overrides[fieldName]) {
      return typeof overrides[fieldName] === 'function'
        ? overrides[fieldName]()
        : overrides[fieldName];
    }
    return undefined;
  };

  // Handle input changes for non-overridden fields
  const handleInputChange = (fieldName: string) => (value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  // Handle URL changes if it's not overridden
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value.trim());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionMessage('');

    // Use overridden URL if provided, otherwise use the user input
    const finalUrl = getOverriddenValue('url') || url;

    // Validate fields
    const validationErrors: { [key: string]: string } = {};
    fields.forEach(field => {
      const fieldValue = getOverriddenValue(field.field_name) || formData[field.field_name];
      if (!field.nullable && !fieldValue) {
        validationErrors[field.field_name] = `${field.field_name} is required.`;
      }
    });

    // Validate URL
    if (!finalUrl) {
      validationErrors.url = 'URL is required.';
    } else if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      validationErrors.url = 'URL must start with http:// or https://';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    // Construct the data object, using overridden values where available
    let data: any = {};
    fields.forEach(field => {
      const fieldValue = getOverriddenValue(field.field_name) || formData[field.field_name];
      if (fieldValue) {
        data[field.field_name] = fieldValue;
      }
    });

    try {
      const response = await sendPostRequest(fields, data, finalUrl + endpoint);
      // Handle the response based on the status
      if (response.status === 'Success') {
        setSubmissionMessage('Form submitted successfully.');
        onResponse({ status: 'Success', value: response.value });
      } else if (response.status === 'Error') {
        setSubmissionMessage('Error submitting form.');
        onResponse({ status: 'Error', value: response.value });
      }
    } catch (error) {
      setSubmissionMessage('Error submitting form.');
      onResponse({ status: 'Error', value: error });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Render URL input only if it's not overridden */}
      {!overrides.url && (
        <Box mb={2}>
          <TextField
            label="URL"
            type="text"
            fullWidth
            value={url}
            onChange={handleUrlChange}
            required
            error={!!errors.url}
            helperText={errors.url}
          />
        </Box>
      )}

      {/* Render fields that are not overridden */}
      {fields
        .filter(field => !overrides[field.field_name])
        .map(field => (
          <RequestFormField
            key={field.field_name}
            field={field}
            value={formData[field.field_name]}
            onChange={handleInputChange(field.field_name)}
            onBlur={() => {}}
            error={errors[field.field_name]}
          />
        ))}

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        fullWidth
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
      {submissionMessage && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          {submissionMessage}
        </Typography>
      )}
    </Box>
  );
};

export default sendPostRequest;

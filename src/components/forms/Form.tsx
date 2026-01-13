import React, { useState, useEffect, useMemo } from 'react';
import {
  TextField, Button, Select, MenuItem,
  FormControl, InputLabel, Switch, FormControlLabel, Rating,
  Box, Grid, Typography
} from '@mui/material';
import { FormProps } from "./types";
import { validationRules } from './validation';

export const GenericForm: React.FC<FormProps> = ({
  fields,
  onSubmit,
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
  onCancel,
  customButtons = [],
  initialValues = {}
}) => {
  // Memoize initialValues based on content, not reference
  const memoizedInitialValues = useMemo(() => initialValues, [JSON.stringify(initialValues)]);

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    return fields.reduce((acc, field) => {
      acc[field.name] =
        memoizedInitialValues[field.name] ??
        field.defaultValue ??
        (field.type === "switch" ? false : field.type === "multiselect" ? [] : "");
      return acc;
    }, {} as Record<string, any>);
  });

  useEffect(() => {
    const newFormData = fields.reduce((acc, field) => {
      acc[field.name] =
        memoizedInitialValues[field.name] ??
        field.defaultValue ??
        (field.type === "switch" ? false : field.type === "multiselect" ? [] : "");
      return acc;
    }, {} as Record<string, any>);

    // Only update if the data has actually changed
    setFormData((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(newFormData)) {
        return newFormData;
      }
      return prev;
    });
  }, [memoizedInitialValues]);

  // ✅ Fetch dynamic select/multiselect options and apply default values
  useEffect(() => {
    const fetchSelectOptions = async () => {
      for (const field of fields) {
        if (field.apiEndpoint) {
          try {
            const response = await fetch(field.apiEndpoint);
            const data = await response.json();

            const options = data.map((item: any) => ({
              value: item[field.optionValueKey || "_id"],
              label:
                item[field.optionLabelKey || ""] ||
                item.name ||
                item.title ||
                "Unnamed",
            }));

            field.options = options;

            // ✅ Apply default value only if current value is empty
            if (field.defaultValue !== undefined) {
              setFormData((prev) => {
                const currentValue = prev[field.name];
                const isEmpty = currentValue === "" || (Array.isArray(currentValue) && currentValue.length === 0);
                if (isEmpty) {
                  return { ...prev, [field.name]: field.defaultValue };
                }
                return prev;
              });
            }
          } catch (error) {
            console.error(`Failed to fetch options for ${field.name}:`, error);
          }
        } else if (field.defaultValue !== undefined) {
          // ✅ Static options default assignment
          setFormData((prev) => {
            const currentValue = prev[field.name];
            const isEmpty = currentValue === "" || (Array.isArray(currentValue) && currentValue.length === 0);
            if (isEmpty) {
              return { ...prev, [field.name]: field.defaultValue };
            }
            return prev;
          });
        }
      }
    };

    fetchSelectOptions();
  }, [fields]);

  const validateField = (name: string, value: any) => {
    const field = fields.find((f) => f.name === name);
    if (!field) return null;

    const rules = field.validations || [];
    for (const validation of rules) {
      const { rule, args = [] } = validation;
      const validator = validationRules[rule];
      if (validator) {
        const error = validator(value, ...args);
        if (error) return error;
      }
    }

    if (field.required && (value === "" || value === null || value === undefined)) {
      return "This field is required.";
    }

    return null;
  };

  const handleChange = (name: string, value: any, customOnChange?: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    if (customOnChange) customOnChange(value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <Box
      component="form"
      onSubmit={onSubmit ? handleSubmit : undefined}
      sx={{ width: "100%" }}
      data-testid="generic-form"
      role="form"
      aria-label="Form"
    >
      <Grid container spacing={2}>
        {fields.map((field) => {
          const gridSize = field.width === "half" ? 6 : 12;

          switch (field.type) {
            case "text":
            case "email":
            case "password":
            case "number":
            case "date":
            case "datetime":
            case "textarea":
              return (
                <Grid size={gridSize} key={field.name}>
                  <TextField
                    fullWidth
                    label={field.label}
                    required={field.required}
                    type={field.type === "textarea" ? "text" : field.type}
                    multiline={field.type === "textarea"}
                    rows={field.type === "textarea" ? 4 : undefined}
                    value={formData[field.name] ?? ""}
                    disabled={field.disabled}
                    placeholder={field.placeholder}
                    error={Boolean(errors[field.name])}
                    helperText={errors[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value, field.onChange)}
                    size="small"
                    data-testid={`form-field-${field.name}`}
                    inputProps={{
                      'data-testid': `form-input-${field.name}`,
                      'aria-label': field.label,
                      'aria-required': field.required,
                      'aria-invalid': Boolean(errors[field.name]),
                      'aria-describedby': errors[field.name] ? `${field.name}-error` : undefined,
                    }}
                    FormHelperTextProps={{
                      id: `${field.name}-error`,
                      role: 'alert',
                    }}
                  />
                </Grid>
              );

            case "select":
              return (
                <Grid size={gridSize} key={field.name}>
                  <FormControl fullWidth size="small" data-testid={`form-control-${field.name}`}>
                    <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                    <Select
                      required={field.required}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value, field.onChange)}
                      disabled={field.disabled}
                      error={Boolean(errors[field.name])}
                      data-testid={`form-select-${field.name}`}
                      labelId={`${field.name}-label`}
                      inputProps={{
                        'aria-label': field.label,
                        'aria-required': field.required,
                        'aria-invalid': Boolean(errors[field.name]),
                      }}
                    >
                      {field.options?.map((option, index) => (
                        <MenuItem
                          key={index}
                          value={option.value}
                          data-testid={`form-option-${field.name}-${option.value}`}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              );

            case "multiselect":
              return (
                <Grid size={gridSize} key={field.name}>
                  <FormControl fullWidth size="small" data-testid={`form-control-${field.name}`}>
                    <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                    <Select
                      multiple
                      required={field.required}
                      value={formData[field.name] || []}
                      onChange={(e) => handleChange(field.name, e.target.value, field.onChange)}
                      disabled={field.disabled}
                      error={Boolean(errors[field.name])}
                      data-testid={`form-multiselect-${field.name}`}
                      labelId={`${field.name}-label`}
                      inputProps={{
                        'aria-label': field.label,
                        'aria-required': field.required,
                        'aria-invalid': Boolean(errors[field.name]),
                        'aria-multiselectable': true,
                      }}
                      renderValue={(selected: string[]) =>
                        selected
                          .map((val) => {
                            const opt = field.options?.find((o) => o.value === val);
                            return opt ? opt.label : val;
                          })
                          .join(", ")
                      }
                    >
                      {field.options?.map((option, index) => (
                        <MenuItem
                          key={index}
                          value={option.value}
                          data-testid={`form-option-${field.name}-${option.value}`}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              );

            case "switch":
              return (
                <Grid size={gridSize} key={field.name}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData[field.name] || false}
                        onChange={(e) =>
                          handleChange(field.name, e.target.checked, field.onChange)
                        }
                        data-testid={`form-switch-${field.name}`}
                        inputProps={{
                          'aria-label': field.label,
                          'aria-checked': formData[field.name] || false,
                          role: 'switch',
                        }}
                      />
                    }
                    label={field.label}
                    data-testid={`form-switch-label-${field.name}`}
                  />
                </Grid>
              );

            case "rating":
              return (
                <Grid size={gridSize} key={field.name}>
                  <Box data-testid={`form-rating-container-${field.name}`}>
                    <Typography component="legend" id={`${field.name}-rating-label`}>
                      {field.label}
                    </Typography>
                    <Rating
                      value={formData[field.name] ?? 0}
                      onChange={(_, v) => handleChange(field.name, v, field.onChange)}
                      data-testid={`form-rating-${field.name}`}
                      aria-labelledby={`${field.name}-rating-label`}
                    />
                  </Box>
                </Grid>
              );

            default:
              return <Grid size={gridSize} key={field.name}> </Grid>;
          }
        })}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }} data-testid="form-actions">
        {onCancel && (
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            data-testid="form-cancel-button"
            aria-label="Cancel form"
          >
            {cancelButtonText}
          </Button>
        )}
        {onSubmit && (
          <Button
            type="submit"
            variant="contained"
            data-testid="form-submit-button"
            aria-label="Submit form"
          >
            {submitButtonText}
          </Button>
        )}
        {customButtons.map((btn, i) => (
          <Button
            key={i}
            {...btn}
            data-testid={`form-custom-button-${i}`}
            aria-label={btn.text || `Custom button ${i + 1}`}
          >
            {btn.text}
          </Button>
        ))}
      </Box>
    </Box>
  );
};


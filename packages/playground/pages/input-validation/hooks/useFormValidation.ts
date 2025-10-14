import { ref, computed, reactive } from "vue";
import type { FieldConfig, FormState, FieldState } from "../types";
import { validateField } from "../utils/validators";

export function useFormValidation(fields: FieldConfig[]) {
  // Initialize form state
  const formState = reactive<FormState>(
    fields.reduce((acc, field) => {
      acc[field.name] = {
        value: "",
        error: "",
        touched: false,
        dirty: false,
      };
      return acc;
    }, {} as FormState),
  );

  // Track if form is currently validating
  const isValidating = ref(false);

  // Track if form has been submitted
  const isSubmitted = ref(false);

  /**
   * Get field state
   */
  const getFieldState = (fieldName: string): FieldState | undefined => {
    if (!formState[fieldName]) {
      console.warn(`Field "${fieldName}" does not exist in form state`);
      return undefined;
    }
    return formState[fieldName];
  };

  /**
   * Update field value
   */
  const setFieldValue = (fieldName: string, value: string) => {
    if (!formState[fieldName]) {
      console.warn(`Field "${fieldName}" does not exist in form state`);
      return;
    }

    formState[fieldName].value = value;
    formState[fieldName].dirty = true;

    // Validate on change if field has been touched or form submitted
    if (formState[fieldName].touched || isSubmitted.value) {
      validateFieldByName(fieldName);
    }
  };

  /**
   * Mark field as touched (user has interacted)
   */
  const setFieldTouched = (fieldName: string) => {
    if (!formState[fieldName]) {
      console.warn(`Field "${fieldName}" does not exist in form state`);
      return;
    }

    formState[fieldName].touched = true;

    // Validate on blur
    validateFieldByName(fieldName);
  };

  /**
   * Validate a specific field
   */
  const validateFieldByName = (fieldName: string) => {
    const field = fields.find((f) => f.name === fieldName);
    if (!field || !formState[fieldName]) return;

    const error = validateField(formState[fieldName].value, field.rules);
    formState[fieldName].error = error;
  };

  /**
   * Validate all fields
   */
  const validateForm = (): boolean => {
    isValidating.value = true;

    let isValid = true;

    fields.forEach((field) => {
      const error = validateField(formState[field.name].value, field.rules);
      formState[field.name].error = error;
      formState[field.name].touched = true;

      if (error) {
        isValid = false;
      }
    });

    isValidating.value = false;
    return isValid;
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    fields.forEach((field) => {
      formState[field.name] = {
        value: "",
        error: "",
        touched: false,
        dirty: false,
      };
    });
    isSubmitted.value = false;
  };

  /**
   * Reset field errors
   */
  const resetFieldErrors = () => {
    fields.forEach((field) => {
      formState[field.name].error = "";
    });
  };

  /**
   * Set form as submitted
   */
  const setSubmitted = () => {
    isSubmitted.value = true;
  };

  /**
   * Get form values
   */
  const getFormValues = () => {
    return fields.reduce(
      (acc, field) => {
        acc[field.name] = formState[field.name].value;
        return acc;
      },
      {} as Record<string, string>,
    );
  };

  /**
   * Check if form is valid (computed)
   */
  const isFormValid = computed(() => {
    return fields.every((field) => {
      const fieldState = formState[field.name];
      return fieldState.error === "";
    });
  });

  /**
   * Check if form has any dirty fields
   */
  const isFormDirty = computed(() => {
    return fields.some((field) => formState[field.name].dirty);
  });

  /**
   * Check if form has any touched fields
   */
  const isFormTouched = computed(() => {
    return fields.some((field) => formState[field.name].touched);
  });

  /**
   * Handle form submission
   */
  const handleSubmit = (onSubmit: (values: Record<string, string>) => void) => {
    return (event: Event) => {
      event.preventDefault();
      setSubmitted();

      const isValid = validateForm();

      if (isValid) {
        onSubmit(getFormValues());
      }
    };
  };

  return {
    formState,
    isValidating,
    isSubmitted,
    isFormValid,
    isFormDirty,
    isFormTouched,
    getFieldState,
    setFieldValue,
    setFieldTouched,
    validateFieldByName,
    validateForm,
    resetForm,
    resetFieldErrors,
    setSubmitted,
    getFormValues,
    handleSubmit,
  };
}

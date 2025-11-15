// src/components/FormValidation.jsx
import React from "react";
import { FaExclamationCircle } from "react-icons/fa";

/**
 * Component hiển thị lỗi validation cho field
 */
export const FieldError = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="flex items-center space-x-1 text-red-400 text-sm mt-1 animate-fadeIn">
      <FaExclamationCircle className="text-xs" />
      <span>{error}</span>
    </div>
  );
};

/**
 * Component hiển thị tất cả lỗi validation
 */
export const ValidationErrors = ({ errors }) => {
  if (!errors || Object.keys(errors).length === 0) return null;
  
  return (
    <div className="bg-red-600/20 border border-red-500 rounded-lg p-4 mb-4 animate-fadeIn">
      <div className="flex items-start space-x-2">
        <FaExclamationCircle className="text-red-400 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-red-400 font-semibold mb-2">
            Vui lòng kiểm tra lại thông tin:
          </h4>
          <ul className="space-y-1 text-red-300 text-sm">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>• {message}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

/**
 * Hook để quản lý validation
 */
export const useFormValidation = (initialValues) => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    
    // Clear error khi user nhập
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const setFieldError = (field, error) => {
    setErrors({ ...errors, [field]: error });
  };

  const setFieldsErrors = (newErrors) => {
    setErrors(newErrors);
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldError,
    setFieldsErrors,
    resetForm,
    setValues
  };
};

/**
 * Higher Order Component để wrap form với validation
 */
export const withValidation = (WrappedComponent) => {
  return (props) => {
    const validation = useFormValidation(props.initialValues || {});
    return <WrappedComponent {...props} validation={validation} />;
  };
};

export default {
  FieldError,
  ValidationErrors,
  useFormValidation,
  withValidation
};
import React, { useState } from "react";
import { formFields } from "./Fields";

export default function SmartForm() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateField = (field, value) => {
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.label} is required`;
    }
    if (field.minLength && value.length < field.minLength) {
      return `${field.label} must be at least ${field.minLength} characters`;
    }
    if (field.maxLength && value.length > field.maxLength) {
      return `${field.label} cannot exceed ${field.maxLength} characters`;
    }
    if (field.min !== undefined && Number(value) < field.min) {
      return `${field.label} must be at least ${field.min}`;
    }
    if (field.max !== undefined && Number(value) > field.max) {
      return `${field.label} cannot be more than ${field.max}`;
    }
    if (field.pattern && !field.pattern.test(value)) {
      return field.errorMsg || `${field.label} is not valid`;
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const field = formFields.find((f) => f.name === name);

    setFormData((prevData) => ({ ...prevData, [name]: fieldValue }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validateField(field, fieldValue)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const field = formFields.find((f) => f.name === name);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(field, value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const newErrors = {};
    let isValid = true;

    formFields.forEach((field) => {
      const value = formData[field.name] ||
        (field.type === "checkbox" ? false : "");

      const error = validateField(field, value);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      console.log("Form submitted:", formData);
      alert("Form submitted successfully!");

    }
  };

  const getInputClassName = (fieldName) => {
    return `w-full px-4 py-3 rounded-lg border ${errors[fieldName]
      ? "border-red-500 focus:ring-red-100"
      : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
      } text-gray-700 focus:ring-2 focus:outline-none transition duration-200 ${isSubmitted && !errors[fieldName] && !formData[fieldName] && "bg-gray-50"
      }`;
  };

  const renderInputField = (field) => {
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            id={field.name}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={4}
            className={`${getInputClassName(field.name)} min-h-[100px]`}
            placeholder={field.placeholder || ""}
          ></textarea>
        );

      case "select":
        return (
          <select
            id={field.name}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClassName(field.name)}
          >
            <option value="">Select an option</option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              id={field.name}
              name={field.name}
              type="checkbox"
              checked={formData[field.name] || false}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        );

      default:
        return (
          <input
            id={field.name}
            name={field.name}
            type={field.type || "text"}
            value={formData[field.name] || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClassName(field.name)}
            placeholder={field.placeholder || ""}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-100 to-indigo-700 px-8 py-12 text-center text-white">
            <h1 className="text-3xl font-extrabold tracking-tight">Smart Form</h1>
            <p className="mt-2 opacity-90">Please fill in your details below</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-6"
            noValidate
          >
            {formFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                    {field.required && (
                      <span className="text-red-600 ml-1">*</span>
                    )}
                  </label>
                  {field.type === "tel" && (
                    <span className="text-xs text-gray-500">
                      {field.format || "Format: (123) 456-7890"}
                    </span>
                  )}
                </div>

                {renderInputField(field)}

                {field.description && !errors[field.name] && (
                  <span className="text-xs text-gray-500">
                    {field.description}
                  </span>
                )}

                {errors[field.name] && (
                  <div className="text-red-600 text-sm flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors[field.name]}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Submit Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
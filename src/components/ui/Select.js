'use client';

export default function Select({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder,
  required = false,
  disabled = false,
  error,
  className = ''
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* REMOVED the wrapper div and FiChevronDown icon */}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`select-field ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {Array.isArray(options) ? (
          options.map((option, index) => (
            typeof option === 'string' ? (
              <option key={index} value={option}>
                {option}
              </option>
            ) : (
              <option key={option.value || index} value={option.value}>
                {option.label}
              </option>
            )
          ))
        ) : null}
      </select>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
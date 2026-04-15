import { HelpIcon } from './HelpIcon';
import './FormField.css';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  helpText?: string;
  required?: boolean;
  helpPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export function FormField({
  label,
  children,
  error,
  helpText,
  required = false,
  helpPosition = 'top',
}: FormFieldProps) {
  return (
    <div className={`form-field ${error ? 'form-field-error' : ''}`}>
      <label className="form-field-label">
        {label}
        {required && <span className="form-field-required">*</span>}
        {helpText && <HelpIcon text={helpText} position={helpPosition} />}
      </label>
      <div className="form-field-input">
        {children}
      </div>
      {error && <div className="form-field-error-message">{error}</div>}
    </div>
  );
}

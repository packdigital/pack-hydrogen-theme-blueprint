import clsx from 'clsx';

import {CountryField} from './CountryField';

export function FormField({field}: Record<string, any>) {
  const {
    _template: type,
    column,
    direction,
    halfWidth,
    hideLabel,
    infoMessage,
    label,
    link,
    name,
    options,
    placeholder,
    required,
  } = field;

  const isTextarea = type === 'textArea';
  const isRadio = type === 'radio';
  const isSelect = type === 'select';
  const isCountry = type === 'country';

  // Non inputs
  const isLabel = type === 'label';
  const hasLabel = !isLabel;

  // Uses <checkbox>
  const isCheckbox = type === 'checkbox';
  const isMultiCheckbox = type === 'multipleCheckbox';
  const isCheckboxType = isCheckbox || isMultiCheckbox;

  // Uses <input type="file">
  const isFile = type === 'file';
  const isFileType = isFile;

  // Uses <input>
  const isText = type === 'text';
  const isEmail = type === 'email';
  const isPhone = type === 'phone';
  const isDate = type === 'date';
  const isNumber = type === 'number';
  const isUrl = type === 'url';
  const isTime = type === 'time';
  const isAddress = type === 'address';
  const isInput =
    isText ||
    isEmail ||
    isPhone ||
    isDate ||
    isNumber ||
    isUrl ||
    isTime ||
    isAddress;

  const isNotFullWidth = isCheckbox || isRadio || isFileType || isCheckboxType;

  const inputClass = 'input-text';
  const labelClass = 'input-label p-0';
  const selectClass = `appearance-none bg-[url('/svgs/chevron-down.svg')] bg-[length:1rem_1rem] bg-[calc(100%-0.75rem)] bg-no-repeat ${inputClass}`;
  const halfWidthSpan =
    column === 1 ? 'col-span-2 xs:col-[1]' : 'col-span-2 xs:col-[2]';

  return (
    <div
      className={clsx(
        'flex flex-col gap-4',
        'md:flex-row md:gap-8',
        'lg:gap-12',
        halfWidth ? halfWidthSpan : 'col-[1_/_span_2]',
        isNotFullWidth ? 'items-start' : 'items-stretch',
      )}
      key={name}
    >
      <label
        className={clsx(
          'flex gap-x-1 gap-y-1.5',
          isCheckbox || isRadio || isFileType
            ? 'justify-self-start'
            : 'justify-self-stretch',
          isCheckbox || isLabel ? 'py-1' : '',
          isCheckbox ? 'flex-row' : 'flex-col-reverse',
          isNotFullWidth ? 'w-auto' : 'w-full',
        )}
        htmlFor={name}
      >
        {isLabel && <span className={clsx(labelClass)}>{label}</span>}

        {isFileType && (
          <input
            className="py-2"
            id={name}
            name={name}
            required={required}
            type="file"
          />
        )}

        {isInput && (
          <input
            className={clsx(inputClass)}
            id={name}
            name={name}
            placeholder={placeholder}
            required={required}
            type={isPhone ? 'tel' : type}
          />
        )}

        {isTextarea && (
          <textarea
            className={clsx('resize-none', inputClass)}
            id={name}
            name={name}
            placeholder={placeholder}
            required={required}
          />
        )}

        {isCheckbox && (
          <input
            id={name}
            name={name}
            required={required}
            type="checkbox"
            value="yes"
          />
        )}

        {isMultiCheckbox && (
          <div
            className={clsx(
              'flex flex-wrap justify-start gap-x-4 gap-y-2 self-start',
              direction === 'vertical' ? 'flex-col' : 'flex-row',
            )}
          >
            {options?.map((value) => (
              <label
                key={`${name}.${value}`}
                className="flex gap-1"
                htmlFor={`${name}.${value}`}
              >
                <input
                  id={`${name}.${value}`}
                  name={value}
                  type="checkbox"
                  value="yes"
                />
                {value}
              </label>
            ))}
          </div>
        )}

        {isRadio && (
          <div
            className={clsx(
              'flex flex-wrap justify-start gap-x-4 gap-y-2 self-start',
              direction === 'vertical' ? 'flex-col' : 'flex-row',
            )}
          >
            {options?.map((value) => (
              <label
                className="flex gap-1"
                htmlFor={`${name}.${value}`}
                key={`${name}.${value}`}
              >
                <input
                  id={`${name}.${value}`}
                  name={name}
                  type="radio"
                  value={value}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        )}

        {isSelect && (
          <select
            className={clsx(selectClass)}
            id={name}
            name={name}
            required={required}
          >
            {['', ...(options || [])].map((value, index) => (
              <option
                disabled={index === 0}
                key={`${name}.${index}}`}
                selected={index === 0}
                value={value}
              >
                {value || placeholder}
              </option>
            ))}
          </select>
        )}

        {isCountry && (
          <CountryField
            name={name}
            placeholder={placeholder}
            required={required}
            selectClass={selectClass}
          />
        )}

        {hasLabel && !hideLabel && (
          <span
            dangerouslySetInnerHTML={{
              __html: `${label}${
                link?.text
                  ? `&nbsp;<a to="${link.url}" onclick="event.preventDefault" target="_blank" style"position:inline;">${link.text}</a>`
                  : ''
              }${required ? ' *' : ''}`,
            }}
            className={clsx('[&_a]:underline', labelClass)}
          />
        )}
      </label>

      {infoMessage && (
        <p className="mt-2 text-xs text-neutralMedium xs:text-sm">
          {infoMessage}
        </p>
      )}
    </div>
  );
}

FormField.displayName = 'FormField';

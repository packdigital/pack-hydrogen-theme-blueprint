import {Fragment} from 'react';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Transition,
} from '@headlessui/react';

import {Svg} from '~/components';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  children?: React.ReactNode;
  className?: string;
  name?: string;
  onSelect?: (option: Option) => void;
  openFrom?: 'top' | 'bottom';
  options?: Option[];
  placeholder?: string;
  placeholderClass?: string;
  selectedOption?: Option;
  textClassName?: string;
}

export function Select({
  children, // pass span to customize the selected option label
  className = '',
  name = 'select',
  onSelect = () => null,
  openFrom = 'bottom',
  options = [], // [{ label: 'label', value: 'value' }]
  placeholder,
  placeholderClass,
  selectedOption, // { label: 'label', value: 'value' }
  textClassName = 'text-sm',
}: SelectProps) {
  return (
    <Listbox
      as="div"
      className={`relative z-10 w-full ${className}`}
      value={JSON.stringify(selectedOption)}
      onChange={(value) => {
        try {
          onSelect(JSON.parse(value));
        } catch (error) {}
      }}
    >
      <ListboxButton
        aria-label="Open account menu"
        className={`btn-pill w-full justify-between gap-2 ${textClassName}`}
      >
        {children || (
          <p
            className={`truncate ${
              selectedOption?.label
                ? 'text-text'
                : placeholderClass || 'text-mediumDarkGray'
            }`}
          >
            {selectedOption?.label || placeholder}
          </p>
        )}

        <Svg
          className="w-4 text-current ui-open:rotate-180"
          src="/svgs/chevron-down.svg#chevron-down"
          title="Chevron"
          viewBox="0 0 24 24"
        />
      </ListboxButton>

      <Transition
        as={Fragment}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-50 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <ListboxOptions
          className={`absolute left-1/2 z-10 flex max-h-72 w-full -translate-x-1/2 flex-col gap-0 overflow-hidden overflow-y-auto rounded-lg border border-gray bg-background py-2 text-base ${
            openFrom === 'top'
              ? 'bottom-[calc(100%+0.5rem)]'
              : 'top-[calc(100%+0.5rem)]'
          }`}
        >
          {options.map((option, index) => {
            if (!option.label) return null;
            return (
              <ListboxOption
                key={index}
                className={`w-full text-left text-text ${textClassName}`}
                value={JSON.stringify(option)}
              >
                {({selected}) => (
                  <div
                    className={`cursor-pointer px-5 py-1.5 transition md:hover:bg-offWhite ${
                      selected ? 'bg-lightGray' : ''
                    }`}
                  >
                    {option.label}
                  </div>
                )}
              </ListboxOption>
            );
          })}
        </ListboxOptions>
      </Transition>

      <input type="hidden" name={name} value={selectedOption?.value} />
    </Listbox>
  );
}

Select.displayname = 'Select';

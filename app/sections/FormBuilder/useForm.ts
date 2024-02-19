import {useMemo} from 'react';

export const useForm = ({fields}: {fields: Record<string, any>[]}) => {
  const parsedFields = useMemo(() => {
    if (!fields?.length) return [];
    // Determine the intended column number for the form field
    let columnCounter = 0;
    return fields.map((field) => {
      const isHalfWidth = !!field.halfWidth;
      let column = 1;
      if (columnCounter % 2 !== 0 && !isHalfWidth) {
        columnCounter = 0;
        column = 1;
      } else if (columnCounter % 2 === 0 && !isHalfWidth) {
        columnCounter += 2;
        column = 2;
      } else if (columnCounter % 2 !== 0 && isHalfWidth) {
        columnCounter += 1;
        column = 2;
      } else if (columnCounter % 2 === 0 && isHalfWidth) {
        columnCounter += 1;
        column = 1;
      }
      return {
        ...field,
        column,
      };
    });
  }, [fields]);

  return {parsedFields};
};

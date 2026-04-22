import {z} from 'zod';

z.config({
  customError: (error) => {
    let message = error.message || '';

    switch (error.code) {
      case 'invalid_type':
        message = `La valeur doit être un ${type[error.expected]}.`;
        break;
      case 'too_big':
        if (error.origin == 'number') message = `Maximum ${error.maximum}.`;
        if (error.origin == 'string')
          message = `Maximum ${error.maximum} ${type[error.origin]}.`;
        if (error.origin == 'array')
          message = `Maximum ${error.maximum} éléments.`;
        break;
      case 'too_small':
        if (error.origin == 'number') message = `Minimum ${error.minimum}.`;
        if (error.origin == 'string')
          message = `Minimum ${error.minimum} ${type[error.origin]}.`;
        if (error.origin == 'array')
          message = `Minimum ${error.minimum} éléments.`;
        break;
      case 'invalid_format':
        message = `Le format doit être un ${format[error.format]}.`;
        break;
    }

    return {message};
  },
});

const format: {[key: string]: string} = {
  date: 'date',
  email: 'email',
  datetime: 'date',
};

const type: {[key: string]: string} = {
  string: 'chaine de caractères',
  number: 'de nombre',
  array: 'un élément valide',
};

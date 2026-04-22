import {v4} from 'uuid';

export const safeAddUuid = (payload: {[key: string]: any}) => {
  const clonedPayload = {...payload};
  if (!payload['id'] || payload['id'].length === 0) {
    clonedPayload['id'] = v4();
  }

  return clonedPayload;
};

export const newId = () => v4();

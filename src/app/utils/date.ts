import {formatDate} from '@angular/common';

export const formatDatetime = (date: string) => {
  return formatDate(new Date(date), 'yyyy-MM-dd HH:mm', 'en-US');
};

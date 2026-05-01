export interface Partner {
  id?: string;
  name: string;
  email: string;
  phone: string;
  reason: string;
  website?: string;
  status?: Partner.StatusEnum | string;
  address?: string;
}

export namespace Partner {
  export enum StatusEnum {
    Waiting = 'WAITING',
    Validated = 'VALIDATED',
    Rejected = 'REJECTED',
  }
}

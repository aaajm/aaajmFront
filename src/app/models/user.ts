export enum Role {
  Admin = 'ADMIN',
  SuperAdmin = 'SUPER_ADMIN',
}

export interface User {
  id?: number;
  email: string;
  role?: Role | 'ADMIN' | 'SUPER_ADMIN';
  name?: string;
  firstname?: string;
  lastname?: string;
  profile?: string;
  postOffice?: string;
  phone?: string;
}

export interface Signin {
  email: string;
  password?: string;
}

export interface Whoami {
  bearer?: string;
  user?: User;
}

export interface ChangePassword {
  newPassword?: string;
  otpCode?: string;
}

export interface UserModel {
    id: string;
    email: string;
    fullName?: string;
    permissions?: string[]; // por si se quiere manejar permisos específicos
    createdAt?: string;
    updatedAt?: string;
  }
  

export interface LoginCredentials {
    email: string;
    password: string;
  }

  export interface Role {
    name: string;
  }
  
  export interface UserRole {
    roles: Role;
  }
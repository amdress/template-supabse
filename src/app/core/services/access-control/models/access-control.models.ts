
// ==============   MODELO DE USER/CREDENTIAL ==============





// ==============   MODELO DE PERMISSIONS ==============

//==== Permission
export interface Permission {
  id: string;
  name: string;
  description?: string;
}

//===== RolePermission
export interface RolePermission {
  permission_id: string;
  permissions?: {
    name: string;
  };
}


// ==============   MODELO DE ROLES ==============

//=== Role
export interface Role {
  name: string;
}

//===== RoleEntry
export interface RoleEntry {
  roles: Role | Role[];  // Puede ser un solo Role o un array de Roles
}

// Modelo de UserRole (modificado según el nuevo modelo de RoleEntry)
export interface UserRole {
  user_id: string;
  role_id: string;
  roles: Role[];  // Aquí aseguramos que siempre sea un array de roles
}
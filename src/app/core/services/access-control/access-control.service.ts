import { Injectable } from '@angular/core';
import { DbConnectionService } from '../db_supabase/db_conection.service';
import { RoleEntry, UserRole , Role} from './models/access-control.models';
import { SessionService } from './session/session.service';
import { catchError, from, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {
  private supabase = this.connectionService.getClient();

  constructor(
    private connectionService: DbConnectionService,
    private sessionSvc: SessionService,
    private router: Router,
  ) {}




// ================ ROLES ==================

/**
 * Maneja la lógica de redirección del usuario según los roles asignados.
 * - Asegura que el usuario tenga al menos un rol asignado (asignando uno por defecto si es necesario).
 * - Obtiene los roles actuales del usuario.
 * - Redirige automáticamente si el usuario está en una ruta inicial (ej. '/', '/auth').
 *
 * @param userId - ID del usuario autenticado.
 */
async handleUserRoles(userId: string): Promise<void> {
  // Asegura que el usuario tenga al menos un rol asignado
  await this.ensureUserRole(userId);

  // Obtiene los roles del usuario
  const roles = await this.getUserRoles(userId);
  if (!roles?.length) {
    console.warn('El usuario no tiene roles asignados.');
    return;
  }

  const currentUrl = this.router.url;
  console.log('Ruta actual:', currentUrl);

  // Solo redirigimos si el usuario se encuentra en una ruta "inicial"
  const isInitial = currentUrl === '/' || currentUrl === '/auth';

  if (isInitial) {
    console.log('Redirigiendo automáticamente por rol', isInitial);
    this.redirectByRole?.(roles);
  } else {
    console.log('No se redirige porque ya está en una ruta válida');
  }
}


/**
 * Recupera los nombres de los roles asignados a un usuario desde la base de datos.
 * Evita duplicados y normaliza la estructura del resultado.
 *
 * @param userId - ID del usuario.
 * @returns Lista de nombres de roles asignados al usuario.
 */
async getUserRoles(userId: string): Promise<string[]> {
  const { data, error } = await this.supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', userId);

  if (error || !data) return [];

  const rolesSet = new Set<string>();

  (data as RoleEntry[]).forEach((entry) => {
    const role = entry.roles;

    if (Array.isArray(role)) {
      role.forEach((r) => rolesSet.add(r.name));
    } else if (role && typeof role === 'object' && 'name' in role) {
      rolesSet.add((role as Role).name);
    }
  });

  return Array.from(rolesSet);
}



 /**
 * Garantiza que el usuario tenga al menos un rol asignado.
 * Si no tiene ninguno, se le asigna el rol por defecto 'user'.
 *
 * @param userId - ID del usuario.
 */
async ensureUserRole(userId: string): Promise<void> {
  // Verifica si el usuario ya tiene roles asignados
  const { data: existing } = await this.supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', userId);

  if (existing && existing.length > 0) return;

  // Busca el ID del rol 'user' en la tabla roles
  const { data: role } = await this.supabase
    .from('roles')
    .select('id')
    .eq('name', 'user')
    .single();

  // Si el rol 'user' no existe, se detiene
  if (!role) return;

  // Asocia el rol 'user' al usuario
  await this.supabase
    .from('user_roles')
    .insert([{ user_id: userId, role_id: role.id }]);
}


/**
 * Verifica si un usuario posee al menos uno de los roles esperados.
 * Útil para proteger rutas mediante guards.
 *
 * @param userId - ID del usuario.
 * @param expectedRoles - Lista de roles válidos para la ruta.
 * @returns Observable<boolean> indicando si el usuario tiene permiso.
 */
checkUserHasAnyRole(
  userId: string,
  expectedRoles: string[]
): Observable<boolean> {
  if (!userId || !expectedRoles?.length) {
    console.warn(
      '⚠️ checkUserHasAnyRole: userId vacío o roles esperados no definidos.'
    );
    return of(false);
  }

  return from(this.getUserRoles(userId)).pipe(
    map((userRoles) => {
      if (!userRoles?.length) {
        console.warn(`⚠️ Usuario ${userId} no tiene roles asignados.`);
        return false;
      }

      const hasRole = expectedRoles.some((role) =>
        userRoles.includes(role)
      );

      console.log(
        `🔍 Verificando roles. Usuario: ${userId} | Roles esperados: [${expectedRoles}] | Roles usuario: [${userRoles}] | ¿Acceso? ${hasRole}`
      );

      return hasRole;
    }),
    catchError((error) => {
      console.error('❌ Error en checkUserHasAnyRole:', error);
      return of(false);
    })
  );
}




/**
 * Redirige automáticamente al usuario a una ruta según el rol detectado.
 *
 * @param roles - Lista de roles asignados al usuario.
 */
redirectByRole(roles: string[]): void {
  if (roles.includes('bussinessOwner')) {
    this.router.navigate(['/company']);
    return;
  }

  if (roles.includes('admin')) {
    this.router.navigate(['/admin']);
    return;
  }

  if (roles.includes('user')) {
    this.router.navigate(['/user/home']);
    return;
  }

  // Si no tiene roles conocidos, redirige a la página de acceso denegado
  this.router.navigate(['/unauthorized']);
}



// ================ PERMISSION ==============

/**
 * Devuelve una lista de permisos (por nombre) asociados a una lista de IDs de roles.
 
 * @returns Lista de nombres de permisos únicos.
 */

async getPermissions(): Promise<string[]> {
  const user = this.sessionSvc.getCurrentUser();

  if (!user) {
    console.warn('⚠️ No hay usuario en sesión.');
    return [];
  }

  // 1. Obtener los roles del usuario (desde la tabla user_roles)
  const { data: userRoles, error: rolesError } = await this.supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', user.id);

  if (rolesError) {
    console.error('❌ Error al obtener roles del usuario:', rolesError);
    return [];
  }

  if (!userRoles?.length) {
    console.warn('📭 El usuario no tiene roles asignados.');
    return [];
  }

  const roleIds = userRoles.map((ur) => ur.role_id);

  // 2. Obtener permisos a partir de los roles
  const { data: rolePermissions, error: permError } = await this.supabase
    .from('role_permissions')
    .select('permissions(name)')
    .in('role_id', roleIds);

  if (permError) {
    console.error('❌ Error al obtener permisos del rol:', permError);
    return [];
  }

  if (!rolePermissions?.length) {
    console.warn('📭 No se encontraron permisos para los roles del usuario.');
    return [];
  }

  // 3. Mapear los nombres de permisos únicos
  const permissions = rolePermissions
    .map((entry: any) => entry.permissions?.name)
    .filter((name: string | null | undefined): name is string => !!name);

  return Array.from(new Set(permissions));
}











}

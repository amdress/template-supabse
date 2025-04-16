import { Injectable } from '@angular/core';
import { DbConnectionService } from '../../db_supabase/db_conection.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private supabase = this.connectionService.getClient();

  constructor(
    private connectionService: DbConnectionService,
  ) { }

  /**
   * Obtiene el usuario autenticado actualmente desde Supabase Auth.
   */
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser();

    if (error) {
      console.error('Error al obtener usuario actual:', error);
      throw error;
    }

    return user;
  }

  /**
   * Obtiene el perfil completo (profile + rol) del usuario autenticado.
   */
  async getCurrentUserProfileWithRole() {
    const user = await this.getCurrentUser();

    const { data, error } = await this.supabase
      .from('profiles')
      .select('*, roles(name, description)')
      .eq('id', user?.id)
      .single();

    if (error) {
      console.error('Error al obtener perfil del usuario:', error);
      throw error;
    }

    return data;
  }

  /**
   * Actualiza el perfil del usuario actual.
   * @param updates - Campos a actualizar (full_name, role_id, etc.)
   */
  async updateCurrentUserProfile(updates: { full_name?: string; role_id?: string }) {
    const user = await this.getCurrentUser();

    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', user?.id)
      .single();

    if (error) {
      console.error('Error al actualizar perfil del usuario:', error);
      throw error;
    }

    return data;
  }

  /**
   * Obtiene todos los perfiles (usuarios) del sistema.
   */
  async getAllProfiles() {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*, roles(name)');

    if (error) {
      console.error('Error al obtener perfiles:', error);
      throw error;
    }

    return data;
  }

  /**
   * Asigna o cambia el rol de un usuario.
   * @param userId - UUID del usuario.
   * @param roleId - ID del nuevo rol.
   */
  async updateUserRole(userId: string, roleId: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .update({ role_id: roleId })
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error al actualizar rol del usuario:', error);
      throw error;
    }

    return data;
  }

  /**
   * Elimina el perfil de un usuario (opcional: desactivación lógica).
   */
  async deleteUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error al eliminar perfil del usuario:', error);
      throw error;
    }

    return data;
  }
}

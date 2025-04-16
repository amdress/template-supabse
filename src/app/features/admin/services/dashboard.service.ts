import { Injectable } from '@angular/core';
import { DbConnectionService } from '../../../core/services/db_supabase/db_conection.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private supabase = this.connectionService.getClient();

  constructor(
       private connectionService: DbConnectionService,
  ) { }


   //======= USERS ==============

   //userRoles===
  async userWithRoles() {
    const { data, error } = await this.supabase
      .from('user_with_roles')
      .select('email, role');
  
    if (error) {
      console.error('Error al obtener usuarios con roles:', error);
      return [];
    }
  
    return data;
  }

  //======= ROLES ==============

  //create===
  async createRole(name: string, description: string) {
    const { data, error } = await this.supabase
      .from('roles')
      .insert([{ name, description }]);
  
    if (error) throw error;
    return data;
  }
  
// all Roles ===
  async getRoles() {
    const { data, error } = await this.supabase
      .from('roles')
      .select('*');
  
    if (error) throw error;
    return data;
  }

  //update Roles===
  async updateRole(id: string, updates: { name?: string; description?: string }) {
    const { data, error } = await this.supabase
      .from('roles')
      .update(updates)
      .eq('id', id);
  
    if (error) throw error;
    return data;
  }

  // Delete role ===
  async deleteRole(id: string) {
    const { data, error } = await this.supabase
      .from('roles')
      .delete()
      .eq('id', id);
  
    if (error) throw error;
    return data;
  }
  
   //======= permissions ==============

   // Create ===
   async createPermission(permission: { name: string; description?: string }) {
    const { data, error } = await this.supabase
      .from('permissions')
      .insert([permission]);
  
    if (error) {
      console.error('Error al crear permiso:', error);
      throw error;
    }
  
    console.log('Permiso creado:', data);
    return data;
  }
  
  //Get All
  async getAllPermissions() {
    const { data, error } = await this.supabase
      .from('permissions')
      .select('*');
  
    if (error) {
      console.error('Error al obtener permisos:', error);
      throw error;
    }
  
    return data;
  }
  

  //Update ===
  async updatePermission(id: string, updates: { name?: string; description?: string }) {
    const { data, error } = await this.supabase
      .from('permissions')
      .update(updates)
      .eq('id', id);
  
    if (error) {
      console.error('Error al actualizar permiso:', error);
      throw error;
    }
  
    return data;
  }

  // Delete ===
  async deletePermission(id: string) {
    const { data, error } = await this.supabase
      .from('permissions')
      .delete()
      .eq('id', id);
  
    if (error) {
      console.error('Error al eliminar permiso:', error);
      throw error;
    }
  
    return data;
  }
  
}

import { Injectable } from '@angular/core';
import { DbConnectionService } from '../../db_supabase/db_conection.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Permission } from '../models/access-control.models';


@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private supabase = this.connectionService.getClient();
  private permissionsSubject = new BehaviorSubject<Permission[]>([]);

  constructor(
    private connectionService: DbConnectionService
  ) {}

  get permissions$(): Observable<Permission[]> {
    return this.permissionsSubject.asObservable();
  }



  // ================= CRUD PERMISSIONS =====================

  async createPermission(permission: { name: string; description?: string }): Promise<Permission[]> {
    const { data, error } = await this.supabase
      .from('permissions')
      .insert([permission])
      .select(); // Para devolver el nuevo permiso

    if (error) {
      console.error('Error al crear permiso:', error);
      throw error;
    }

    if (data) {
      const current = this.permissionsSubject.getValue();
      this.permissionsSubject.next([...current, ...data]);
    }

    return data;
  }

  async getAllPermissions(): Promise<Permission[]> {
    const { data, error } = await this.supabase
      .from('permissions')
      .select('*');

    if (error) {
      console.error('Error al obtener permisos:', error);
      throw error;
    }

    this.permissionsSubject.next(data || []);
    return data;
  }

  async updatePermission(id: string, updates: { name?: string; description?: string }): Promise<Permission[]> {
    const { data, error } = await this.supabase
      .from('permissions')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error al actualizar permiso:', error);
      throw error;
    }

    if (data) {
      const updatedList = this.permissionsSubject.getValue().map(p =>
        p.id === id ? { ...p, ...data[0] } : p
      );
      this.permissionsSubject.next(updatedList);
    }

    return data;
  }

  async deletePermission(id: string): Promise<Permission[]> {
    const { data, error } = await this.supabase
      .from('permissions')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error al eliminar permiso:', error);
      throw error;
    }

    if (data) {
      const updatedList = this.permissionsSubject.getValue().filter(p => p.id !== id);
      this.permissionsSubject.next(updatedList);
    }

    return data;
  }


  // ================= HELPERS PERMISSIONS =====================

  
}

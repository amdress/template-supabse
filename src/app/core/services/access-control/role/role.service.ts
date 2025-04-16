import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DbConnectionService } from '../../db_supabase/db_conection.service';
import { catchError, from, map, Observable, of } from 'rxjs';

interface Role {
  name: string;
}

interface RoleEntry {
  roles: Role | Role[];
}

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private supabase = this.connectionService.getClient();

  constructor(
    private connectionService: DbConnectionService,
    private router: Router
  ) {}

  // ========= CRUD DE ROLES =========

  createRole(name: string, description: string) {
    return this.supabase
      .from('roles')
      .insert([{ name, description }])
      .throwOnError();
  }

  getRoles() {
    return this.supabase.from('roles').select('*').throwOnError();
  }

  updateRole(id: string, updates: { name?: string; description?: string }) {
    return this.supabase
      .from('roles')
      .update(updates)
      .eq('id', id)
      .throwOnError();
  }

  deleteRole(id: string) {
    return this.supabase.from('roles').delete().eq('id', id).throwOnError();
  }

  getRoleByName(name: string) {
    return this.supabase.from('roles').select('*').eq('name', name).single();
  }



  // ================= HELPERS ROLES =====================

}

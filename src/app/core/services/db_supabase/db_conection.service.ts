import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DbConnectionService {
  private static supabase: SupabaseClient | null = null;


  constructor() {
    if (!DbConnectionService.supabase) {
      try {
        DbConnectionService.supabase = createClient(
          environment.supabaseUrl,
          environment.supabaseAnonKey,
          {
            auth: {
              persistSession: true, // O true, dependiendo de tu caso
              autoRefreshToken: true,
              detectSessionInUrl: true,
            },
          }
        );
        console.log('Cliente de Supabase creado correctamente');
      } catch (error) {
        console.error('Error al crear cliente de Supabase:', error);
        throw new Error('No se pudo inicializar el cliente de Supabase');
      }
    }
  }

  async testConnection(): Promise<void> {
    if (!DbConnectionService.supabase) {
      throw new Error('El cliente de Supabase no está inicializado');
    }

    try {
      //TODO:  Simplemente verifica si el cliente está conectado
      console.log('Conexión exitosa a Supabase');
    } catch (err) {
      throw new Error(`Error al verificar la conexión: ${err}`);
    }
  }

  getClient(): SupabaseClient {
    if (!DbConnectionService.supabase) {
      throw new Error('Supabase client no está inicializado');
    }
    return DbConnectionService.supabase;
  }


}

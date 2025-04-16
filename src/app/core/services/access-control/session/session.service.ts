import { Injectable } from '@angular/core';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { UserModel } from 'src/app/core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private sessionSubject = new BehaviorSubject<Session | null>(null);
  private userSubject = new BehaviorSubject<UserModel | null>(null);

  constructor() {}

  // Observables públicos
  get session$(): Observable<Session | null> {
    return this.sessionSubject.asObservable();
  }

  get user$(): Observable<UserModel | null> {
    return this.userSubject.asObservable();
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.session$.pipe(map((session) => !!session));
  }


  // Usuario actual 
  getCurrentUser(): UserModel | null {
    return this.userSubject.getValue();
  }
  

  // Actualiza la sesión y el usuario
  updateSession(session: Session | null): void {
    this.sessionSubject.next(session);
    const user = session?.user ? this.mapUser(session.user) : null;
    this.userSubject.next(user);

    session ? this.save(session) : this.clear();
  }

  // Mapear Supabase User a UserModel
  private mapUser(user: SupabaseUser): UserModel {
    return {
      id: user.id,
      email: user.email ?? '',
      fullName: user.user_metadata?.['full_name'] ?? '',
      createdAt: user.created_at,
    };
  }

  // Guardar sesión en localStorage
  private save(session: Session): void {
    localStorage.setItem('session', JSON.stringify(session));
  }

  // Limpiar localStorage
  private clear(): void {
    localStorage.removeItem('session');
  }

  // Cargar sesión desde localStorage
  loadFromStorage(): void {
    const raw = localStorage.getItem('session');
    if (!raw) return;

    try {
      const session: Session = JSON.parse(raw);

      // Validar expiración del token (opcional)
      const exp =
        session?.access_token &&
        JSON.parse(atob(session.access_token.split('.')[1])).exp;
      if (exp && Date.now() / 1000 > exp) {
        this.clear();
        return;
      }

      this.updateSession(session);
    } catch {
      this.clear();
    }
  }
}

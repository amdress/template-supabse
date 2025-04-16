import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { Session } from '@supabase/supabase-js';
import { DbConnectionService } from '../../db_supabase/db_conection.service';
import { LoginCredentials } from '../../../models/user.model';
import { SessionService } from '../session/session.service';
import { RoleService } from '../role/role.service';
import { Router } from '@angular/router';
import { AccessControlService } from '../access-control.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = this.connectionService.getClient();
  private authListener: ReturnType<typeof this.supabase.auth.onAuthStateChange> | null = null;
  constructor(
    private connectionService: DbConnectionService,
    private sessionSvc: SessionService,
    private accessCtrl: AccessControlService,
    private router: Router
  ) {
    this.listenToAuthChanges();
    this.sessionSvc.loadFromStorage();
  }

  // ==================== Auth State Listener ====================
  private listenToAuthChanges(): void {

    if (this.authListener) return; // Previene múltiples listeners
    
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.sessionSvc.updateSession(session);

      if (event === 'SIGNED_IN' && session?.user) {
        this.accessCtrl.handleUserRoles(session.user.id); 
      }

      if (event === 'SIGNED_OUT') {
        this.sessionSvc.updateSession(null);
        this.router.navigate(['/auth']);
      }
    });
  }

  // ==================== Sign In ====================
  
  signIn(credentials: LoginCredentials): Observable<Session> {
    return from(this.supabase.auth.signInWithPassword(credentials)).pipe(
      map(res => {
        if (res.error || !res.data.session) throw res.error || new Error('No session found');
        return res.data.session;
      }),
      tap(session => this.sessionSvc.updateSession(session)),
      switchMap(session => 
        from(this.accessCtrl.ensureUserRole(session.user.id))
          .pipe(
            switchMap(() => from(this.accessCtrl.getUserRoles(session.user.id))),
            tap(roles => {
              if (roles?.length) {
                this.accessCtrl.redirectByRole(roles);
              } else {
                console.warn('Usuario sin roles');
              }
            }),
            map(() => session)
          )
      ),
      catchError(err => {
        console.error('[SignIn Error]', err);
        throw err;
      })
    );
  }
  

  // ==================== Sign Up ====================
  signUp(credentials: LoginCredentials): Observable<Session> {
    return from(this.supabase.auth.signUp(credentials)).pipe(
      map(res => {
        if (res.error || !res.data.session) throw res.error || new Error('No session found');
        return res.data.session;
      }),
      tap(session => this.sessionSvc.updateSession(session)),
      catchError(err => {
        console.error('[SignUp Error]', err);
        throw err;
      })
    );
  }

  // ==================== Sign Out ====================
  signOut(): Observable<void> {
    return from(this.supabase.auth.signOut()).pipe(
      tap(() => this.sessionSvc.updateSession(null)),
      map(() => void 0)
    );
  }

  // ==================== Reset Password ====================
  resetPassword(email: string): Observable<void> {
    return from(this.supabase.auth.resetPasswordForEmail(email)).pipe(
      map(res => {
        if (res.error) throw res.error;
        return;
      }),
      catchError(err => {
        console.error('[ResetPassword Error]', err);
        throw err;
      })
    );
  }





  
  
  
}

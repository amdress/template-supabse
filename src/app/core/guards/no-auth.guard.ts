import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { SessionService } from '../services/access-control/session/session.service';
import { AuthService } from '../services/access-control/auth/auth.service';
import { AccessControlService } from '../services/access-control/access-control.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(
    private authSvc: AuthService,
    private accessCtrl: AccessControlService,
    private sessionSvc: SessionService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.sessionSvc.isAuthenticated$.pipe(
      take(1),
      switchMap(isAuth => {
        if (!isAuth) return of(true);

        return this.sessionSvc.user$.pipe(
          take(1),
          switchMap(user => {
            if (!user) return of(this.router.createUrlTree(['/auth'])); 
            return from(this.accessCtrl.handleUserRoles(user.id)).pipe(
              map(() => false) 
            );
          })
        );
      })
    );
  }
}

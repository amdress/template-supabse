import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SessionService } from '../services/access-control/session/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private sessionSvc: SessionService, 
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.sessionSvc.isAuthenticated$.pipe(
      take(1),
      map((isAuthenticated) => {
        console.log('autenticado? : ', isAuthenticated);
        return isAuthenticated ? true : this.router.createUrlTree(['/auth']); //TODO: redirige si no está autenticado
      })
    );
  }
}

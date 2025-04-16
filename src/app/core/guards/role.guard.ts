import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { switchMap, take, catchError } from 'rxjs/operators';
import { SessionService } from '../services/access-control/session/session.service';
import { AccessControlService } from '../services/access-control/access-control.service';


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private sessionSvc: SessionService,
    private accessCtrl: AccessControlService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const expectedRoles: string[] = route.data?.['roles'] || [];

    return this.sessionSvc.user$.pipe(
      take(1),
      switchMap(user => {
        if (!user?.id) {
          console.warn('No hay usuario en sesión, redirigiendo al login');
          return of(this.router.createUrlTree(['/auth']));
        }

        // ✅ Usamos checkUserHasAnyRole con userId y expectedRoles
        return this.accessCtrl.checkUserHasAnyRole(user.id, expectedRoles).pipe(
          switchMap(hasRole => {
            if (hasRole) {
              console.log('✅ Acceso permitido: el usuario tiene al menos uno de los roles requeridos.');
              return of(true);
            } else {
              console.warn('⛔ Acceso denegado: el usuario no tiene los roles requeridos.');
              return of(this.router.createUrlTree(['/unauthorized']));
            }
          }),
          catchError(error => {
            console.error('Error al verificar roles:', error);
            return of(this.router.createUrlTree(['/unauthorized']));
          })
        );
      })
    );
  }
}

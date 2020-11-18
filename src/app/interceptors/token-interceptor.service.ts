import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor( private authService: AuthService ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/auth/')) {
      return next.handle(req);
    }

    if ((new Date()).getTime() < this.authService.tokenRefresh.timeRef) {
      const headers = new HttpHeaders({ Authorization: `JWT ${ this.authService.tokenRefresh.token }` });
      console.log('Token aun no expirado');
      return next.handle(req.clone({ headers }));
    } else {
      console.log('Token cerca de expirar, refrescando token...');

      const tokenAntiguo = this.authService.tokenRefresh.token;

      return this.authService.refreshToken(this.authService.tokenRefresh.token)
        .pipe(
          switchMap( resp => {
            console.log(resp);
            console.log('Token antiguo:', tokenAntiguo);
            console.log('Nuevo token', this.authService.tokenRefresh.token);
            const headers = new HttpHeaders({ Authorization: `JWT ${ this.authService.tokenRefresh.token }` });
            return next.handle(req.clone({ headers }));
          })
        );
      }
  }
}

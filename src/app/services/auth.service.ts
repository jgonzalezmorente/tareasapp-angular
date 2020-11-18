import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { UserModel } from '../models/user.model';
import { environment } from '../../environments/environment';
import { TokenRefresh } from '../interfaces/interfaces';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tokenRefresh: TokenRefresh;

  constructor(private http: HttpClient) {
    this.readTokenRefresh();
  }

  private authenticate(bodyData: any, route: string): Observable<string> {

    return this.http.post<{ token: string }>(
      `${ environment.url }/${ route }`,
      bodyData,
    ).pipe(
        map(
          resp => {
            this.saveToken(resp.token);
            return resp.token;
        }
      )
    );
  }

  login(user: UserModel): Observable<string> {
    return this.authenticate(user, 'auth/login/');
  }

  refreshToken(token: string): Observable<string> {
    return this.authenticate({ token }, 'auth/token-refresh/');
  }

  isAuthenticated(): boolean {
    return (this.tokenRefresh && this.tokenRefresh.token && this.tokenRefresh.timeExp > (new Date()).getTime()) ? true : false;
  }

  private readTokenRefresh(): void {
    const tokenRefreshLS = localStorage.getItem('tokenRefresh');
    tokenRefreshLS ? this.tokenRefresh = JSON.parse(tokenRefreshLS) : this.tokenRefresh = null;
  }

  private saveToken(token: string): void {

    const jwt = JSON.parse(window.atob(token.split('.')[1]).replace('-', '+').replace('_', '/'));
    const currentTime = (new Date()).getTime();
    const timeExp = 1000 * jwt.exp;

    this.tokenRefresh = {
      token,
      timeExp,
      timeRef: currentTime + (timeExp - currentTime) / 2
    };
    localStorage.setItem('tokenRefresh', JSON.stringify( this.tokenRefresh ));
  }
}

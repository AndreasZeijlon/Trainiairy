import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import { AuthService } from '@app/services/auth.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const user = this.authService.userValue;
        const isLoggedIn = user && user.jwt_access;
        const isApiUrl = request.url.startsWith(environment.API_url);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.jwt_access}`
                }
            });
        } else {
        }

        return next.handle(request);
    }
}
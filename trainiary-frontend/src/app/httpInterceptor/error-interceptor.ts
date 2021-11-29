import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, concat } from 'rxjs';
import { catchError, switchMap, map, filter, take, tap } from 'rxjs/operators';


import { AuthService } from '@app/services/auth.service';
import { ThisReceiver } from '@angular/compiler';
import { AlertService } from '@app/services/alert.service';

export const retryCount = 3;

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    private refreshTokenInProgress = false;
    private refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private authService: AuthService, private alertService: AlertService) {
    }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

   
        return next.handle(request).pipe(catchError(error => {
    
            if (request.url.includes("token/refresh/")) {
                this.alertService.clear();
                this.authService.logout();
                this.alertService.error("Session expired", {keepAfterRouteChange: true});
                return throwError(error);
            }

            if(error.status !== 401) {
                return throwError(error);
            }

            if(error.error.code == "token_not_valid") {

                if(this.refreshTokenInProgress){
                    return this.refreshTokenSubject.pipe(
                        filter(result => result !==null),
                        take(1),
                        switchMap(() => next.handle(this.addTokenToRequest(request)))
                    )
                } else {
                    this.refreshTokenInProgress = true;
                    this.refreshTokenSubject.next(null);

                    return this.authService.refreshtoken().pipe(
                        switchMap((token: any) => {
                            this.refreshTokenInProgress = false;
                            this.refreshTokenSubject.next(token);

                            return next.handle(this.addTokenToRequest(request));
                        }),
                        catchError((err: any) => {
                            this.refreshTokenInProgress = false;
                            this.authService.logout();
                            return throwError(error);
                        })
                    )
                }
            } else {
                return throwError(error);
            }
        }))
    }


    addTokenToRequest(request) {
        const access_token = this.authService.userValue.jwt_access;

        if(!access_token) {
            return request;
        }

        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${access_token}`
            }
        });
    }
}
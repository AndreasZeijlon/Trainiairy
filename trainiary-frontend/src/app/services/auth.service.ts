import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginForm } from '@app/_models/loginForm';
import { environment } from '@env/environment';
import { User } from '@app/_models/user';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, defer } from 'rxjs';
import {ignoreElements, map, shareReplay, tap, filter, take} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private http: HttpClient, private router: Router) { 
    const user = JSON.parse(localStorage.getItem('user'));
    this.userSubject = new BehaviorSubject<User>(user);
    this.user = this.userSubject.asObservable();

  }


  public get userValue(): User {
    return this.userSubject.value;
  }

  login(username: string, password: string) {
    const credentials = {username: username,password: password};
    return this.http.post(`${environment.API_url}/user/auth`, credentials).pipe(map(response => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(response["user"]));
      this.userSubject.next(response["user"]);
      return response;
  }));
  }

  register(user : User) {
    return this.http.post(`${environment.API_url}/user/register`, user);
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/start/login']);
  }

  changepassword(formData) {
    const passworddata = {
      currentpassword: formData.currentpassword,
      newpassword: formData.newpassword,
      confirmnewpassword: formData.confirmnewpassword
    }

 
    return this.http.post(`${environment.API_url}/user/changepassword`, passworddata);
  }

  refreshtoken() : Observable<string> {
    return this.http.post(`${environment.API_url}/api/token/refresh/`, {refresh: this.userValue.jwt_refresh}).pipe(map(
      response => {
        const user = this.userValue;
        user.jwt_access = response["access"];
        if(response["refresh"]) {
          user.jwt_refresh = response["refresh"];
        }
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);

        return response["access"];

      }
      ))
  }
}

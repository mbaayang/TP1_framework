import { Injectable } from '@angular/core';
import { User } from './user';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 // Node/Express API
 REST_API: string = 'http://localhost:3000/api';
 // Http Header
 httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
 constructor(private httpClient: HttpClient, public router: Router) {}
 // Add
 AddUser(data: User): Observable<any> {
   let API_URL = `${this.REST_API}/add-user`;
   return this.httpClient
     .post(API_URL, data)
     .pipe(catchError(this.handleError));
 }
 // Get all objects
 GetUsers() {
   return this.httpClient.get(`${this.REST_API}`);
 }
 // Get single object
 GetUser(id: any): Observable<any> {
   let API_URL = `${this.REST_API}/read-user/${id}`;
   return this.httpClient.get(API_URL, { headers: this.httpHeaders }).pipe(
     map((res: any) => {
       return res || {};
     }),
     catchError(this.handleError)
   );
 }
 // Update
 updateUser(id: any, data: any): Observable<any> {
   let API_URL = `${this.REST_API}/update-user/${id}`;
   return this.httpClient
     .put(API_URL, data, { headers: this.httpHeaders })
     .pipe(catchError(this.handleError));
 }
 // Delete
 deleteUser(id: any): Observable<any> {
   let API_URL = `${this.REST_API}/delete-user/${id}`;
   return this.httpClient
     .delete(API_URL, { headers: this.httpHeaders })
     .pipe(catchError(this.handleError));
 }
// Sign-in
 signIn(data: User) {
  return this.httpClient
    .post<any>(`${this.REST_API}/signin`, data)
    .subscribe((res: any) => {
      localStorage.setItem('access_token', res.token);
      this.getUserProfile(res._id).subscribe((res) => {
        this.currentUser = res;
        this.router.navigate(['user-profile/' + res.msg._id]);
      });
    });
}
getToken() {
  return localStorage.getItem('access_token');
}
get isLoggedIn(): boolean {
  let authToken = localStorage.getItem('access_token');
  return authToken !== null ? true : false;
}
doLogout() {
  let removeToken = localStorage.removeItem('access_token');
  if (removeToken == null) {
    this.router.navigate(['log-in']);
  }
}
// User profile
getUserProfile(id: any): Observable<any> {
  let api = `${this.REST_API}/user-profile/${id}`;
  return this.httpClient.get(api, { headers: this.httpHeaders }).pipe(
    map((res) => {
      return res || {};
    }),
    catchError(this.handleError)
  );
}
 // Error
 handleError(error: HttpErrorResponse) {
   let errorMessage = '';
   if (error.error instanceof ErrorEvent) {
     // Handle client error
     errorMessage = error.error.message;
   } else {
     // Handle server error
     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
   }
   console.log(errorMessage);
   return throwError(() => {
     errorMessage;
   });
 }

}
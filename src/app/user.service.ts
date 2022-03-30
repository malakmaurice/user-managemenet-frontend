import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { user } from './app.component';
import { searchCriateria } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  saveUser(userRequest: user): Observable<any> {
    return this.http.post('http://localhost:8080/api/user', userRequest);
  }
  getUsers(): Observable<any> {
    return this.http.get('http://localhost:8080/api/user');
  }

  getUsersByFillter(searchCriateria: searchCriateria): Observable<any> {
    return this.http.post('http://localhost:8080/api/user/filter', searchCriateria);
  }
}

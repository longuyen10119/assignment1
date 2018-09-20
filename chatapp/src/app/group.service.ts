import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, of} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root' 
})

export class GroupService {
  constructor(private http: HttpClient) {}

  // Uses http.get() to load data from a single API endpoint
  getGroups() {
    return this.http.get('http://localhost:3000/api/groups');
  }
  addAUserToGroup(temp){
    console.log(temp);
    let body = JSON.stringify(temp);
    return this.http.post('http://localhost:3000/api/group/add', body, httpOptions);
  }
  removeUserFromGroup(temp){
    console.log(temp);
    let body = JSON.stringify(temp);
    return this.http.post('http://localhost:3000/api/group/remove', body, httpOptions);
  }
  getUsersInGroup(group){
    let body = JSON.stringify(group);
    return this.http.post('http://localhost:3000/api/group/users/', body, httpOptions);
  }
  createGroup(group) {
    let body = JSON.stringify(group);
    console.log('CATCH CHANNEL HERE ' + group);
    return this.http.post('http://localhost:3000/api/group/', body, httpOptions);
  }
  deleteGroup(group) {
    return this.http.delete('http://localhost:3000/api/group/' + group.name);
  }
  updateGroup(group) {
    let body = JSON.stringify(group);
    console.log('CATCH CHANNEL HERE ' + group);
    return this.http.put('http://localhost:3000/api/group/' , body, httpOptions);
  }
  // getUsers() {
  //   return this.http.get('http://localhost:3000/api/users');
  // }
  
}



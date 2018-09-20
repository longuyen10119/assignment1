import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, of} from 'rxjs';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private http: HttpClient) { }
  getChannels(groupid) {
    console.log('getusers is being called in service');
    return this.http.get('http://localhost:3000/api/channels/' + groupid);
  }
  createChannel(channel) {
    let body = JSON.stringify(channel);
    return this.http.post('http://localhost:3000/api/channel/', body, httpOptions);
  }
  deleteChannel(channel) {
    return this.http.delete('http://localhost:3000/api/channel/'+ channel.name);
  }
  updateChannel(channel) {
    let body = JSON.stringify(channel);
    return this.http.put('http://localhost:3000/api/channel/' , body, httpOptions);
  }
  getUsersInChannel(channel){
    console.log(channel);
    let body = JSON.stringify(channel);
    return this.http.post('http://localhost:3000/api/channel/users/', body, httpOptions);
  }
  // addUserToChannel(temp) {
  //   let body = JSON.stringify(temp);
  //   return this.http.post('http://localhost:3000/api/channel/adduser/', body, httpOptions);
  // }
  deleteUserFromChannel(temp) {
    let body = JSON.stringify(temp);
    return this.http.post('http://localhost:3000/api/channel/deleteuser/', body, httpOptions);
  }
  
  
}

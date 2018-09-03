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
  getChannels() {
    console.log('getusers is being called in service');
    return this.http.get('http://localhost:3000/api/channels');
  }
  createChannel(channel) {
    let body = JSON.stringify(channel);
    return this.http.post('http://localhost:3000/api/channel/', body, httpOptions);
  }
  deleteChannel(channel) {
    return this.http.delete('http://localhost:3000/api/channel/' + channel.name);
  }
  getUsersInChannel(channel){
    return this.http.get('http://localhost:3000/api/channel/users/' + channel.name, httpOptions);
  }
  addUserToChannel(channel,user) {
    let body = JSON.stringify(user);
    return this.http.post('http://localhost:3000/api/channel/adduser/' + channel.id, body, httpOptions);
  }
  deleteUserFromChannel(channel, user) {
    let body = JSON.stringify(user);
    return this.http.post('http://localhost:3000/api/channel/deleteuser/' + channel.id, body, httpOptions);
  }
  
  
}

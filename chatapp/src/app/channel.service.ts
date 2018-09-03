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
  getChannels(groupname) {
    console.log('getusers is being called in service');
    return this.http.get('http://localhost:3000/api/channels/' + groupname);
  }
  createChannel(temp) {
    let body = JSON.stringify(temp);
    return this.http.post('http://localhost:3000/api/channel/', body, httpOptions);
  }
  deleteChannel(temp) {
    let body = JSON.stringify(temp);
    return this.http.post('http://localhost:3000/api/channeldelete/', body, httpOptions);
  }
  getUsersInChannel(channel){
    console.log(channel);
    let body = JSON.stringify(channel);
    return this.http.post('http://localhost:3000/api/channel/users/', body, httpOptions);
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

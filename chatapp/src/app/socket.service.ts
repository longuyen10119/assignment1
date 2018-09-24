import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor() { }
  private url = 'http://localhost:3000';
  private socket;

  // Send message function
  sendMessage(message) {
    console.log('sendMessage()');

    this.socket.emit('incoming', message);
  }

  sendStatus(message) {
    console.log('sendStatus()');
    this.socket.emit('login', message);
  }
  // Get message function
  getMessages() {
    console.log('getMessages()');
    // Connection to localhost 3000
    // this.socket = io(this.url);

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        console.log("Received messages from Websocket Server" + JSON.stringify(data));
        
        observer.next(data);
      })
      return () => {
        this.socket.disconnect();
      }
    });

    // We return our observable
    return observable;

  }

  loadMessages(){
    this.socket = io(this.url);
    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let observable = new Observable(observer => {
      this.socket.on('load', (data) => {
        console.log("Load messages from Server")
        observer.next(data);
      })
      return () => {
        this.socket.disconnect();
      }
    });

    // We return our observable
    return observable;
  }
  statusListen(){
    // this.socket = io(this.url);
    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let observable = new Observable(observer => {
      this.socket.on('status', (data) => {
        observer.next(data);
      })
      return () => {
        this.socket.disconnect();
      }
    });

    // We return our observable
    return observable;
  }

}

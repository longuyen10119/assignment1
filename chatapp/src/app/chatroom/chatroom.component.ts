import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { ChannelService } from "../channel.service";
import { UserService } from '../user.service';
import { GroupService } from '../group.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

  constructor(private router: Router, private _channelService: ChannelService,
              private _userService: UserService,
              private _groupService: GroupService,
              private sockServer: SocketService) { }
  public users;
  public groups;
  public usertype;
  public usertypestring;
  public displayName;
  public channels;
  public usersInChannel;
  chooseusertype: String;
  currentGroupName: String;
  public currentgroup;
  public currentChannel;
  public messages =[];
  public message;
  public connection1;
  public connection2;

  ngOnInit() {
    if (localStorage.length == 0) {
      window.alert('Havent logged in');
      this.router.navigateByUrl('/login');
    }else {// also when loading check user in localStorage if user is normal, admin or super
      this.displayName = localStorage.getItem('user');
      this.usertypestring = localStorage.getItem('usertype');
      this.currentGroupName = localStorage.getItem('group');
      this.currentgroup = JSON.parse(localStorage.getItem('objectGroup'));
      this.currentChannel = JSON.parse(localStorage.getItem('channelObject'));
      switch (this.usertypestring) {
        case 'super':
          this.usertype = 1;
          break;
        case 'groupadmin':
          this.usertype = 2;
          break;
        case 'normal':
          this.usertype = 3;
          break;
      }
      // Getting messages 
      console.log(this.currentChannel);
      console.log("Chat session started for user: " + this.displayName);
      this.connection1 = this.sockServer.getMessages().subscribe(message=>{
        this.messages = Object.values(message);
        let thisChannelName = this.currentChannel.name;
        this.messages = this.messages.filter(x=> x.channel==thisChannelName);
        
      });
    }
  }
  sendMessage(){
    this.sockServer.sendMessage({channel:this.currentChannel.name, username:this.displayName, message: this.message});
  }

  ngOnDestroy(){
    if(this.connection1){
      this.connection1.unsubscribe();
    }
    if(this.connection2){
      this.connection2.unsubscribe();
    }
  }

}

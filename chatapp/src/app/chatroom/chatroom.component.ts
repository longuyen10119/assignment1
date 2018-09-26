import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { ChannelService } from "../channel.service";
import { UserService } from '../user.service';
import { GroupService } from '../group.service';
import { SocketService } from '../socket.service';
import { UploadService} from '../upload.service';
@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

  constructor(private router: Router, private _channelService: ChannelService,
              private _userService: UserService,
              private _groupService: GroupService,
              private sockServer: SocketService,
              private _uploadService: UploadService) { }
  public users;
  public groups;
  public usertype;
  public usertypestring;
  public displayName;
  public channels;
  public usersInChannel=[];
  chooseusertype: String;
  currentGroupName: String;
  public currentgroup;
  public currentChannel;
  public messages =[];
  public message;
  public connection1;
  public connection2;
  public connection3;
  public yesNoPic;
  selectedFile = null;
  imagePath="";
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
      // Load profile pic
      this.getProfile(localStorage.getItem('userId'));
      // Loading messages 
      console.log(this.currentChannel);
      console.log("Chat session started for user: " + this.displayName);
      this.connection1 = this.sockServer.loadMessages().subscribe(message=>{
        this.messages = Object.values(message);
        let thisChannelName = this.currentChannel.name;
        this.messages = this.messages.filter(x=> x.channel==thisChannelName);
        
      });
      
      // Getting messages
      this.connection2 = this.sockServer.getMessages().subscribe(message=>{
        let temp = Object.values(message);
        let tempchannel = temp[0]
        let tempuser = temp[1]
        let tempmessage = temp[2]
        let temppath = temp[3]
        if (tempchannel == this.currentChannel.name){
          this.messages = this.messages.filter(x => x.username.indexOf("Attention")==-1);
          let addmessage = {channel:tempchannel, username: tempuser, message: tempmessage, path:temppath};
          this.messages.push(addmessage);
        }
        this.message = '';
      });

      // Getting a status
      this.connection3 = this.sockServer.statusListen().subscribe(message=>{
        // console.log(Object.values(message));
        // console.log(message)
        let temp = Object.values(message);
        console.log(temp);
        let statusMessage
        // Parse the username message

        if(temp[0]==this.currentChannel.name){
          if(temp[2]==1){
            statusMessage = {channel:this.currentChannel.name, username:temp[1], message:'----------has just joined the chatroom----------------'};
          } else{
            statusMessage = {channel:this.currentChannel.name, username:temp[1], message:'----------has just left the chatroom----------------'};
          }
          this.messages.push(statusMessage);
        }
      });

      // Send out status
      let status = {channel: this.currentChannel.name, username: 'Attention ' + this.displayName, status: 1, path:this.imagePath}
      this.sockServer.sendStatus(status);
      
    }
  }
  sendMessage(){
    
    this.sockServer.sendMessage({channel:this.currentChannel.name, username:this.displayName, message: this.message, path:this.imagePath});
  }

  ngOnDestroy(){
    let status = {channel: this.currentChannel.name, username: 'Attention ' + this.displayName, status: 2}
      this.sockServer.sendStatus(status);
    if(this.connection1){
      this.connection1.unsubscribe();
    }
    if(this.connection2){
      this.connection2.unsubscribe();
    }
    if(this.connection3){
      this.connection3.unsubscribe();
    }

  }
  onFileSelected(event){
    // console.log(event);
    this.selectedFile = event.target.files[0];
  }
  getProfile(id){
    this._uploadService.getProfile(id).subscribe(res=>{
      let temp = Object.values(res);
      if(typeof temp!==undefined){
        console.log(temp);
        this.imagePath = temp[1];
        // this.yesNoPic = true;
      }
    });
  }
  uploadProfile(){ 
    const fd = new FormData();
    let id = localStorage.getItem('userId');
    console.log(id);
    fd.append('id',id);
    fd.append('profileImage',this.selectedFile);
    console.log(fd);
    this._uploadService.uploadProfile(fd).subscribe(res=>{
      console.log(res);
      this.imagePath = res.path;
    });
  }

}

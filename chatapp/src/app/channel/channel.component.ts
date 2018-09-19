import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { ChannelService } from "../channel.service";
import { UserService } from '../user.service';
import { GroupService} from '../group.service';
@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {

  constructor(private router:Router, private _channelService: ChannelService,
              private _userService: UserService,
              private _groupService: GroupService) { }
  //1 being super, 2 being groupAdmin, 3 being normal
  public users;
  public groups;
  public usertype;
  public usertypestring;
  public displayName;
  public channels;
  public usersInChannel;
  chooseusertype: String;
  currentGroupName: String;
  public currentGroup;
  public currentChannel;

  ngOnInit() {
    // If you haven't logged in
    // console.log('HELLLLLlllllllllefjelifjelfjelfjelfejflejflelllll')
    if(localStorage.length == 0){
      window.alert('Havent logged in');
      this.router.navigateByUrl('/login');
    }else{// also when loading check user in localStorage if user is normal, admin or super
      console.log('HELLLLLlllllllllefjelifjelfjelfjelfejflejflelllll')
      this.displayName = localStorage.getItem('user');
      console.log(this.displayName);
      this.usertypestring = localStorage.getItem('usertype');
      this.currentGroupName = localStorage.getItem('group');
      switch(this.usertypestring){
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
    }
    this.getChannels();
    this.getUsers();
    this.getGroups();
  }
    // List of Channel services-----------
    // getChannels
    // createChannel
    // deleteChannel
    // getUsersInChannel
    // addUserToChannel
    // deleteUserFromChannel
    // ---------------------------

    // get channels in current group
    getChannels() {
      console.log(this.groups);
      console.log(localStorage.getItem('user'));
      console.log(localStorage.getItem('usertype'));
      console.log(localStorage.getItem('group'));
      let foundgroup = this.groups.find(x =>x.name == this.currentGroupName)
      this._channelService.getChannels(foundgroup.id).subscribe(
        data => { this.channels = data;
                  console.log(data) },
        err => console.error(err),
        () => console.log('done loading Channels')
      );
    }
    // Create new channel within this group
    createChannel(channel){
      let temp = {channel: channel, group: this.currentGroupName};
      this._channelService.createChannel(temp).subscribe(
        data => {
          if(data==null){
            window.alert('Channel exists. Try different name');
          }else{
            this.getChannels();
            return true;
          }
        },
        error => {
          console.error(error);
        }
      );
    }
    deleteChannel(channel){
      let temp = {channel: channel.name, group: this.currentGroupName};
      console.log(temp);
      this._channelService.deleteChannel(temp).subscribe(
        data => {
          this.getChannels();
          this.usersInChannel = [];
          return true;
        },
        error => {
          console.error('Error deleting channel');
        }
      );
    }
    // get all users in this channel
    getUsersInChannel(channel){
      this.currentChannel = channel;
      console.log(this.currentChannel);
      localStorage.setItem('channel', this.currentChannel.name);
      this._channelService.getUsersInChannel(channel).subscribe(
        data => {
          console.log(data);
          this.usersInChannel = data;
          return true;
        },
        error => {
          console.error('Error getting all users in channel');
        },
        () => {console.log(this.usersInChannel);}
      );
      
    }
    addUserToChannel(name){
      let temp = {user: name, channel: this.currentChannel.name, groupname: this.currentGroupName};
      this._channelService.addUserToChannel(temp).subscribe(
        data => {
          console.log(data);
          return true;
        },
        error => {
          console.error('Error getting all users in channel');
        },
        () => {console.log(this.usersInChannel);}
      );
    }
    deleteUserFromChannel(user){
      // just need user id and channel id and group id
      let temp = {user: user.id, channel: this.currentChannel.name, groupname: this.currentGroupName};
      this._channelService.deleteUserFromChannel(temp).subscribe(
        data => {},
        err => console.log('Error removing this user to the channel'),
        () => {this.getUsersInChannel(this.currentChannel);
               console.log(this.usersInChannel)  ;
                 }
      );
    }



    //////////////////adding Some User Service here
  getUsers() {
    console.log('getUsers is being called in chat');
    this._userService.getUsers().subscribe(
      data => { this.users = data; 
                console.log(data)},
      err => console.error(err),
      () => console.log('done loading users')
    );
  }
  //Create new users
  createUser(name) {
    // for(let i =0; i<this.users.length; i++){
    //   if(this.users[i].name==name){
    //     window.alert('User exists. Try a different name');
    //     return;
    //   }
    // }
    let user = {
      name: name
    };
    this._userService.createUser(user).subscribe(
      data => {
        this.users = data;
      },
      error => {
        console.error('Error creating users');
      }
    );
  }
  updateUser(user) {
    this._userService.updateUser(user).subscribe(
      data => {
        this.getUsers()
      },
      error => {
        console.error('Error updating user');
      }
    );
  }
  ///////////////////////////////
  getGroups() {
    this._groupService.getGroups().subscribe(
      data => { this.groups = data;
                console.log(data) },
      err => console.error(err),
      () => console.log('done loading groups')
    );
  }
}

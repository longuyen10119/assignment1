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
  public currentgroup;
  public currentChannel;

  ngOnInit() {
    // If you haven't logged in
    if(localStorage.length == 0){
      window.alert('Havent logged in');
      this.router.navigateByUrl('/login');
    }else{// also when loading check user in localStorage if user is normal, admin or super
      this.displayName = localStorage.getItem('user');
      console.log(this.displayName);
      this.usertypestring = localStorage.getItem('usertype');
      this.currentGroupName = localStorage.getItem('group');
      this.currentgroup = JSON.parse(localStorage.getItem('objectGroup'));
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
    
    this.getUsers();
    this.getGroups();
    this.getChannels();
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
      let tempgroup = JSON.parse(localStorage.getItem('objectGroup'));
      console.log(tempgroup);
      let groupid = localStorage.getItem('groupid');
      this._channelService.getChannels(groupid).subscribe(
        data => { this.channels = data;
                  console.log(data) },
        err => console.error(err),
        () => console.log('done loading Channels')
      );
    }
    // Create new channel within this group
    createChannel(name){
      for(let i =0; i<this.channels.length; i++){// check for existing channels 
        if(this.channels[i].name==name){
          window.alert('Channel exists. Try a different name');
          return;
        }
      }
      let groupid = parseInt(localStorage.getItem('groupid'));
      let newChannel = {
        name : name,
        groupid : groupid,
        users : []
      }
      this._channelService.createChannel(newChannel).subscribe(
        data => {
            this.getChannels();
            return true;
        },
        error => {
          console.error(error);
        }
      );
    }
    deleteChannel(channel){
      this._channelService.deleteChannel(channel).subscribe(
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
      let tempusers = []
      for(let i = 0; i< channel.users.length;i++){
        let auser = this.users.find(x => x.id==channel.users[i]);
        tempusers.push(auser);
      }
      this.usersInChannel = tempusers;
      
    }
    addUserToChannel(name){
      let founduser = this.users.find(x=> x.name==name);
      console.log(this.currentChannel);
      console.log(this.currentgroup);
      if(typeof founduser !== 'undefined'){ // if user does exist in list
        this.currentChannel.users.push(founduser.id);
      }else{ // if user doesn't then need to add to list of users
        this.createUser(name);
        let id = this.users[this.users.length-1].id;
        id += 1;
        this.currentgroup.users.push(id);
        this.currentChannel.users.push(id);
        console.log(this.currentgroup);
        console.log(this.currentChannel);
      }
      //
      this.updateChannel(this.currentChannel);
      
      // this.updateGroup(this.currentgroup);
      this.getGroups();
      this.getChannels();
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
    updateChannel(channel) {
      this._channelService.updateChannel(channel).subscribe(
        data => {
          this.getChannels();
          return true;
        },
        error => {
          console.error('Error updating groups');
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
  updateGroup(group) {
    this._groupService.updateGroup(group).subscribe(
      data => {
        this.getGroups();
        return true;
      },
      error => {
        console.error('Error updating groups');
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ChannelService } from "../channel.service";
import { UserService } from '../user.service';
import { GroupService } from '../group.service';
@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {

  constructor(private router: Router, private _channelService: ChannelService,
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
    if (localStorage.length == 0) {
      window.alert('Havent logged in');
      this.router.navigateByUrl('/login');
    } else {// also when loading check user in localStorage if user is normal, admin or super
      this.displayName = localStorage.getItem('user');
      console.log(this.displayName);
      this.usertypestring = localStorage.getItem('usertype');
      this.currentGroupName = localStorage.getItem('group');
      this.currentgroup = JSON.parse(localStorage.getItem('objectGroup'));
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
      data => {
        this.channels = data;
        console.log(data)
      },
      err => console.error(err),
      () => console.log('done loading Channels')
    );
  }
  // Create new channel within this group
  createChannel(name) {
    for (let i = 0; i < this.channels.length; i++) {// check for existing channels 
      if (this.channels[i].name == name) {
        window.alert('Channel exists. Try a different name');
        return;
      }
    }
    let groupid = parseInt(localStorage.getItem('groupid'));
    let newChannel = {
      name: name,
      groupid: groupid,
      users: []
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
  deleteChannel(channel) {
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
  getUsersInChannel(channel) {
    this.currentChannel = channel;
    console.log(this.currentChannel);
    localStorage.setItem('channel', this.currentChannel.name);
    let tempusers = []
    for (let i = 0; i < channel.users.length; i++) {
      let auser = this.users.find(x => x.id == channel.users[i]);
      tempusers.push(auser);
    }
    this.usersInChannel = tempusers;

  }
  addUserToChannel(name) {
    // How to add a user to a channel
    // Let's check if this.users and this.groups are updated also check this.currentGroup
    console.log(this.users);
    console.log(this.groups);
    console.log(this.currentgroup);
    console.log(this.currentChannel)

    // 2 cases 
    // IF USER EXISTS 
    // IF USER DOESN'T EXIST

    // FIND IF USER EXISTS

    let foundUser = this.users.find(x => x.name === name)
    console.log(foundUser);
    if (typeof foundUser === "undefined") {
      console.log('User Not found');
      // need to add the user to database

      let newUserid = this.users[this.users.length - 1].id;
      newUserid += 1;// this is the new User id
      this.createUser(name, newUserid);
      // add this user
    } else {// IF USER EXISTS
      this.currentChannel.users.push(foundUser.id);
      this.updateChannel(this.currentChannel);
      this.currentgroup.users.push(foundUser.id);
      this.updateGroup(this.currentgroup);
    }

  }
  deleteUserFromChannel(user) {
    let id = user.id
    let index = this.currentChannel.users.findIndex(x => x == id);
    this.currentChannel.users.splice(index, 1);
    this.updateChannel(this.currentChannel);
    this.getUsersInChannel(this.currentChannel);
    this.getChannels();
  }
  updateChannel(channel) {
    this._channelService.updateChannel(channel).subscribe(
      data => {
        this.channels = data;
        return true;
      },
      error => {
        console.error('Error updating Channel');
      },
      () => { this.getUsersInChannel(this.currentChannel.name); }
    );
  }
  //////////////////adding Some User Service here
  getUsers() {
    this._userService.getUsers().subscribe(
      data => {
        this.users = data;
        console.log(data)
      },
      err => console.error(err),
      () => console.log('Done loading users')
    );
  }
  //Create new users
  createUser(name, id) {
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
        this.currentChannel.users.push(id);

      },
      error => {
        console.error('Error creating users');
      },
      () => { this.updateChannel(this.currentChannel) }
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
      data => { this.groups = data; },
      err => console.error(err),
      // () => console.log('done loading groups')
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

import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { ChannelService } from "../channel.service";
@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {

  constructor(private router:Router, private _channelService: ChannelService) { }
  //1 being super, 2 being groupAdmin, 3 being normal
  public usertype;
  public usertypestring;
  public displayName;
  public channels;
  public usersInChannel;
  chooseusertype: String;
  currentGroup: String;
  public currentChannel;

  ngOnInit() {
    // If you haven't logged in
    if(localStorage.length == 0){
      window.alert('Havent logged in');
      this.router.navigateByUrl('/login');
    }else{// also when loading check user in localStorage if user is normal, admin or super
      this.displayName = localStorage.getItem('user');
      this.usertypestring = localStorage.getItem('usertype');
      this.currentGroup = localStorage.getItem('group');
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
      this._channelService.getChannels(this.currentGroup).subscribe(
        data => { this.channels = data;
                  console.log(data) },
        err => console.error(err),
        () => console.log('done loading Channels')
      );
    }
    // Create new channel within this group
    createChannel(channel){
      let temp = {channel: channel, group: this.currentGroup};
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
      let temp = {channel: channel.name, group: this.currentGroup};
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
      console.log(localStorage.getItem('channel'));
      this._channelService.getUsersInChannel(channel).subscribe(
        data => {
          console.log(data);
          this.usersInChannel = data;
          return true;
        },
        error => {
          console.error('Error getting all users in channel');
        }
      );
    }
    addUserToChannel(){

    }
    deleteUserFromChannel(){

    }
}

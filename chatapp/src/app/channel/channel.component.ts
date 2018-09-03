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
  chooseusertype: String;
  currentGroup: String;

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
  }
    // List of Channel services-----------
    // getChannels
    // createChannel
    // deleteChannel
    // getUsersInChannel
    // addUserToChannel
    // deleteUserFromChannel
    // ---------------------------
    getChannels(){

    }
    createChannel(){

    }
    deleteChannel(){

    }
    getUsersInChannel(){

    }
    addUserToChannel(){

    }
    deleteUserFromChannel(){

    }
}

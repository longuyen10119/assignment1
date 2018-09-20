import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { ChannelService } from "../channel.service";
import { UserService } from '../user.service';
import { GroupService } from '../group.service';
@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

  constructor(private router: Router, private _channelService: ChannelService,
              private _userService: UserService,
              private _groupService: GroupService) { }
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
    }
  }

}

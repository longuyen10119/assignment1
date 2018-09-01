
import { Component, OnInit } from '@angular/core';
import { GroupService } from "../group.service";
import { LoginService } from "../login.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  public groups;
  public usersCrazy;
  public groupname;
  //1 being super, 2 being groupAdmin, 3 being normal
  public usertype;
  public displayName;
  


  constructor(private router:Router, private _groupService: GroupService,
                private _loginService: LoginService) { }

  ngOnInit() {
    //when group component is loading
    // check for sessionStorage if any user has logged in
    // if not then route back to log in
    if(sessionStorage.length == 0){
      window.alert('Havent logged in');
      this.router.navigateByUrl('/login');
    }else{// also when loading check user against user database if user is normal, admin or super
      this.displayName = sessionStorage.getItem('user');
      let tempname = sessionStorage.getItem('user');
      // console.log('Username from ngONIT');
      // console.log(tempname);
      let tempuser;
      this._loginService.checkLogin(tempname).subscribe(
        data => { tempuser = data;
                  console.log('Number 1' + data)},
        err => console.log('error when loading group component'),
        () => {console.log(tempuser.type);
              switch(tempuser.type){
                case 'super':
                  this.usertype = 1;
                  break;
                case 'groupadmin':
                  this.usertype = 2;
                  break;
                case 'normal':
                  this.usertype = 3;
                  break;};
                  console.log(this.usertype);
                }
      );
      // console.log('HELLO ARE YOU HERE?');
      // console.log(this.usertype);
      // load groups
      this.getGroups();
    }
  }
  getUsersInGroup(group){
    console.log('hello getUsersInGroup in component');
    console.log(group.name);
    this._groupService.getUsersInGroup(group).subscribe(
      data => { this.usersCrazy = data;
                console.log(data)},
      err => console.log('Get users in Group Error'),
      () => console.log('Done get users in group')
    );
    console.log(this.usersCrazy);
  }
  getGroups() {
    this._groupService.getGroups().subscribe(
      data => { this.groups = data;
                console.log(data) },
      err => console.error(err),
      () => console.log('done loading groups')
    );
  }
  // CREATE NEW GROUP
  createGroup(name, admin) {
    console.log(name);
    let group = {
      'name' : name,
      'groupAdmin': admin,
      'users': []
    }
    this._groupService.createGroup(group).subscribe(
      data => {
        this.getGroups();
        return true;
      },
      error => {
        console.error(error);
      }
    );
  }
  updateGroup(group) {
    this._groupService.updateGroup(group).subscribe(
      data => {
        this.getGroups();
        return true;
      },
      error => {
        console.error('Error saving group');
      }
    );
  }
  // DELETE GROUP
  deleteGroup(group) {
    this._groupService.deleteGroup(group).subscribe(
      data => {
        this.getGroups();
        return true;
      },
      error => {
        console.error('Error deleting group');
      }
    );
  }

}


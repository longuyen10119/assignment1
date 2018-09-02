
import { Component, OnInit } from '@angular/core';
import { GroupService } from "../group.service";
import { LoginService } from "../login.service";
import { UserService } from "../user.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  public groups;
  public usersInGroup;
  public groupname;
  //1 being super, 2 being groupAdmin, 3 being normal
  public usertype;
  public usertypestring;
  public displayName;
  chooseusertype: String;
  public currentgroup;

  public users;
  


  constructor(private router:Router, private _groupService: GroupService,
                private _loginService: LoginService,
                private _userService: UserService) { }

  ngOnInit() {
    //when group component is loading
    // check for sessionStorage if any user has logged in
    // if not then route back to log in
    if(sessionStorage.length == 0){
      window.alert('Havent logged in');
      this.router.navigateByUrl('/login');
    }else{// also when loading check user in sessionStorage if user is normal, admin or super
      this.displayName = sessionStorage.getItem('user');
      this.usertypestring = sessionStorage.getItem('usertype');
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
      // load groups
      this.getGroups();
      this.getUsers();
  }
  //Add users to Specific group
  addAUserToGroup(n, t){
    //n is name and t is type
    console.log(n);
    console.log(t);
    // need to know which group to add users to
    // what the username is, and role to add
    // current group is in currentgroup
    // username is in n, and role is in t
    let userNameToAdd = n;
    let roleToAdd = t;
    let groupToAdd = this.currentgroup;
    let temp = {name: n, type: t, group: groupToAdd}
    this._groupService.addAUserToGroup(temp).subscribe(
      data => {this.getUsersInGroup(this.currentgroup)},
      err => console.log('Error adding this user to the group'),
      () => console.log()
    );


  }
  
  getUsersInGroup(group){
    console.log('hello getUsersInGroup in component');
    console.log(group.name);
    this.currentgroup = group;
    this._groupService.getUsersInGroup(group).subscribe(
      data => { this.usersInGroup = data;
                console.log(data)},
      err => console.log('Get users in Group Error'),
      () => console.log('Done get users in group')
    );
    console.log(this.usersInGroup);
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
        this.usersInGroup = [];
        return true;
      },
      error => {
        console.error('Error deleting group');
      }
    );
  }
  removeUserFromGroup(){

  }

  //////////////////adding Some User Service here
  getUsers() {
    console.log('getUsers is being called in components');
    this._userService.getUsers().subscribe(
      data => { this.users = data; },
      err => console.error(err),
      () => console.log('done loading users')
    );
  }
  //Create new users
  createUser(name) {
    let user = {
      name: name
    };
    this._userService.createUser(user).subscribe(
      data => {
        this.getUsers();
        return true;
      },
      error => {
        console.error(error);
      }
    );
  }
  //Delete Users
  deleteUser(user) {
    this._userService.deleteUser(user).subscribe(
      data => {
        this.getUsers();
        return true;
      },
      error => {
        console.error('Error deleting group');
      }
    );
  }


}


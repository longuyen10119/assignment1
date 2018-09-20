
import { Component, OnInit } from '@angular/core';
import { GroupService } from "../group.service";
import { LoginService } from "../login.service";
import { UserService } from "../user.service";
import {Router} from "@angular/router";
import {FormsModule} from '@angular/forms';

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
    // check for localStorage if any user has logged in
    // if not then route back to log in
    if(localStorage.length == 0){
      window.alert('Havent logged in');
      this.router.navigateByUrl('/login');
    }else{// also when loading check user in localStorage if user is normal, admin or super
      this.displayName = localStorage.getItem('user');
      this.usertypestring = localStorage.getItem('usertype');
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
    // if user exists
    // get the user id, then add to users list in group
    let founduser = this.users.find(x=> x.name==n);
    if(typeof founduser !== 'undefined'){ // if user does exist in list
      this.currentgroup.users.push(founduser.id);
    }else{ // if user doesn't then need to add to list of users
      this.createUser(n);
      let id = this.users[this.users.length-1].id;
      id += 1;
      this.currentgroup.users.push(id);
    }
    //
    this.getUsers();
    this.updateGroup(this.currentgroup);
    this.getUsersInGroup(this.currentgroup);
    this.getGroups();

  }
  // Remove user from a group
  removeUserFromGroup(user){
    let id = user.id
    let index = this.currentgroup.users.findIndex(x=> x==id);
    this.currentgroup.users.splice(index,1);
    this.updateGroup(this.currentgroup);
    this.getUsersInGroup(this.currentgroup);
    this.getGroups();
  }
  getUsersInGroup(group){
    // set localStorage
    this.currentgroup = group;
    localStorage.setItem('objectGroup', JSON.stringify(group));
    localStorage.setItem('group', group.name);
    localStorage.setItem('groupid', group.id);
    let groupusers = []
    for(let i=0; i<group.users.length; i++){
      let id = group.users[i]
      let aUser = this.users.find(x=> x.id == id)
      groupusers.push(aUser);
    }
    this.usersInGroup = groupusers;
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
    for(let i =0; i<this.groups.length; i++){
      if(this.groups[i].name==name){
        window.alert('Group exists. Try a different name');
        return;
      }
    }
    let adminUser = this.users.find(x=> x.name== admin);
    adminUser.type = 'groupadmin';
    console.log(adminUser);
    this.updateUser(adminUser);
    let group = {
      'name' : name,
      'groupAdmin': adminUser.id,
      'users': [adminUser.id]
    }
    this._groupService.createGroup(group).subscribe(
      data => {
          this.getGroups();
          this.getUsers();
          return true;
      },
      error => {
        console.error(error);
      }
    );
  }
  // UPDATE GROUP
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
  // DELETE GROUP
  deleteGroup(group) {
    let adminUser = this.users.find(x=> x.id== group.groupAdmin);
    adminUser.type = 'normal';
    this.updateUser(adminUser);
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

  //////////////////adding Some User Service here
  getUsers() {
    console.log('getUsers is being called in components');
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
  //Delete Users

  deleteUser(user) {
    this._userService.deleteUser(user).subscribe(
      data => {
        this.getUsers();
        return true;
      },
      error => {
        console.error('Error deleting group');
      },
      ()=>{this.getUsers();}

    );
  }


}


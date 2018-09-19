import { Component, OnInit } from '@angular/core';
import { GroupService } from "../group.service";
import { LoginService } from "../login.service";
import { UserService } from "../user.service";
import {Router} from "@angular/router";
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
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
    if(localStorage.length == 0){
      window.alert('Havent logged in');
      this.router.navigateByUrl('/login');
    }else{// also when loading check user in localStorage if user is normal, admin or super
      this.displayName = localStorage.getItem('user');
      this.usertypestring = localStorage.getItem('usertype');
      // if(this.usertypestring=='')
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
  }
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
    for(let i =0; i<this.users.length; i++){
      if(this.users[i].name==name){
        window.alert('User exists. Try a different name');
        return;
      }
    }
    let user = {
      name: name
    };
    this._userService.createUser(user).subscribe(
      data => {
        if(data==null){
          window.alert('User exists. Try a different name');
          return false;
        }else{
        this.getUsers();
        return true;
        }
      },
      error => {
        console.error('Error creating users');
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
        console.error('Error deleting user');
      }
    );
  }
}

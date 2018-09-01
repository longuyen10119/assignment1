
import { Component, OnInit } from '@angular/core';
import { GroupService } from "../group.service";
import { UserService } from "../user.service";
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

  constructor(private router:Router, private _groupService: GroupService) { }

  ngOnInit() {
    if(sessionStorage.length == 0){
      window.alert('Havent logged in');
      this.router.navigateByUrl('/login');
    }else{
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
    console.log(group);
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


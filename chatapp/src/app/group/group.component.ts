
import { Component, OnInit } from '@angular/core';
import { GroupService } from "../group.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  public groups;
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
  getGroups() {
    this._groupService.getGroups().subscribe(
      data => { this.groups = data; },
      err => console.error(err),
      () => console.log('done loading groups')
    );
  }
  createGroup(name) {
    let group = {
      groupname: name
    };
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


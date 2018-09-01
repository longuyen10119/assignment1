
import { Component, OnInit } from '@angular/core';
import { GroupService } from "../group.service";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  public groups;
  public groupname;

  constructor(private _groupService: GroupService) { }

  ngOnInit() {
    this.getGroups();
    console.log('Get Group in group component ts')
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


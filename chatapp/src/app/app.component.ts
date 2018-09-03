import { Component } from '@angular/core';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { LoginComponent } from './login/login.component';
import { GroupComponent } from './group/group.component';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router:Router){}
  title = 'chatapp';
  usertype:String;
  ngOnInit() {
    if(localStorage.length!=0){
      this.usertype = localStorage.getItem('usertype');
      if(this.usertype=='super' || this.usertype=='groupadmin'){
        this.router.navigateByUrl('/user');
      }else{
        this.router.navigateByUrl('/group');
      }
    }
  }
  logOut(event){
    event.preventDefault();
    localStorage.clear();
    window.alert('You have been log out');
    
    // this.router.navigateByUrl('/login');
  }
}

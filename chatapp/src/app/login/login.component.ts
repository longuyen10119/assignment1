import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from "@angular/router";
import { LoginService } from "../login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username:string = '';
  public returnUser;
  constructor(private router:Router,private form:FormsModule, private _loginService: LoginService) { }

  ngOnInit() {
    if(sessionStorage.length!=0){
      window.alert('You are still logged in. Please log out first');
      this.router.navigateByUrl('/group');
    }
  }

  loginUser(event){
    event.preventDefault();
    console.log(this.username);

    this._loginService.checkLogin(this.username).subscribe(
        data => { this.returnUser = data;},
        err => console.error(err),
        () => {
                console.log('done loading user');
                if(this.returnUser == null){
                  window.alert("User not found");
                }else{
                  sessionStorage.setItem('user', this.returnUser.name);
                  sessionStorage.setItem('usertype', this.returnUser.type);
                  this.router.navigateByUrl('/group');
                }
              }
    );
  }

}

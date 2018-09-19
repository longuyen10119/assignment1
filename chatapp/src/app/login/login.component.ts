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
  pass:string = '';
  public returnUser;
  constructor(private router:Router,private form:FormsModule, private _loginService: LoginService) { }

  ngOnInit() {
    if(localStorage.length!=0){
      window.alert('You are still logged in. Please log out first');
      this.router.navigateByUrl('/group');
    }
  }

  loginUser(event){
    event.preventDefault();
    let user = {
      name:this.username,
      pass:this.pass
    }

    this._loginService.checkLogin(user).subscribe(
        data => { 
          this.returnUser = data;
        },
        err => console.error(err),
        () => {
                console.log(this.returnUser);
                if(this.returnUser.name == ''){
                  window.alert("Username or Password is wrong");
                }else{
                  localStorage.setItem('user', this.returnUser.name);
                  localStorage.setItem('usertype', this.returnUser.type);
                  this.router.navigateByUrl('/user');
                }
              }
    );
  }

}

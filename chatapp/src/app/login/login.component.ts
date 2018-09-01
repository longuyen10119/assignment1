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
                  this.router.navigateByUrl('/group');
                }
              }
    );
    // console.log("login component ts");
    // console.log(this.returnUser);
    
    // console.log(this.username);
    // if (this.username == "Long"){
    //   sessionStorage.setItem('userName', this.username);
    //   sessionStorage.setItem('id', '1');
    //   sessionStorage.setItem('birthDate', "29/12");
    //   sessionStorage.setItem('Age', '29');
    //   this.router.navigateByUrl('/Info');
    // } else{
    //   alert('Username or password is incorrect');
    // }
  }

}

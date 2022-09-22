import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-welcome',
  templateUrl: './user-welcome.component.html',
  styleUrls: ['./user-welcome.component.css']
})
export class UserWelcomeComponent implements OnInit {
  useData: any;
  toasterObj: any;
  isToaster: boolean = false;

  constructor(private userService : UserService,
    private router : Router) { }

  ngOnInit(): void {
    this.useData = this.userService.user;
    this.getToaster();
  }

  getToaster() {
    this.userService.toastObj.subscribe((res) => {
      if (res != null) {
        this.toasterObj = res;
        this.isToaster = true;
      }
    })
  }

  logout(){
    this.userService.logout();
    let data = {
      success : true,
      message : "Logout Successfully.."
    }
    this.userService.setToast(data);
    setTimeout(() => {
      this.router.navigateByUrl('/user/login');
    }, 200);
  }

}

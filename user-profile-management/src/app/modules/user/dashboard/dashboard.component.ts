import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activePage = "list"
  user: any;
  editUser: any = null;
  isToaster = false;
  toasterObj: any;
  constructor(private userService : UserService,
    private router : Router) { }

  ngOnInit(): void {
    this.user = this.userService.user;
    this.getModifyUser();
    this.getActivePage();
    this.getToaster();
  }

  changeActive(page:string){
    this.activePage = page;
  }

  getActivePage(){
    this.userService.activePage.subscribe((res)=>{
      if(res !=null)
      this.activePage = res;
    })
  }

  getToaster(){
    this.userService.toastObj.subscribe((res)=>{
      if(res != null){
        this.toasterObj = res;
        this.isToaster = true;
      }
    })
  }

  getModifyUser(){
    this.userService.editUser.subscribe((response)=>{
      if(response){
        this.activePage = "add-user";
        this.editUser = response;
      }
    })
  }

  logout(){
    this.userService.logout().subscribe((res)=>{
      this.userService.setEditUser(null);
      this.userService.setToast(res);
      setTimeout(() => {
        this.router.navigateByUrl('/user/login');
      }, 100);
    });
  }
}

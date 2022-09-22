import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ViewUserComponent } from '../view-user/view-user.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  matDialogRef!: MatDialogRef<ViewUserComponent>;
  userInfo: any;
  pageInfo: any;
  totalRecords: number = 0;
  noOfPages: any;
  activePage = 0;
  searchText!: any;

  constructor(private userService: UserService,
    private router: Router,
    private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.setDefault();
    this.getAllUser();

  }

  setDefault() {
    this.pageInfo = {
      pageNumber: 1,
      size: 5
    }
  }

  getAllUser() {
    this.userService.getAllUser(this.pageInfo).subscribe((response: any) => {
      this.userInfo = response.data;
      this.totalRecords = response.totalRecords;
      this.setPagination();
    });
  }

  updateUser(user: any) {
    this.userService.setEditUser(user);
  }

  deleteUser(user: any) {
    this.userService.deleteUser(user).subscribe((response: any) => {
      if (response.success) {
        this.router.navigateByUrl('/user/list', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/user/dashboard']);
        });
      }
      this.userService.setToast(response);
    });
  }

  setPagination() {
    let remainRecord = this.totalRecords % 5;
    if (remainRecord > 0) {
      this.noOfPages = Math.floor(this.totalRecords / 5) + 1;
    } else {
      this.noOfPages = Math.floor(this.totalRecords / 5);
    }
    this.noOfPages = Array(this.noOfPages).fill(1);
  }

  addUser() {
    this.userService.setActivePage("add-user");
  }

  gotoPage(indx: number) {
    this.pageInfo.pageNumber = indx + 1;
    this.getAllUser();
    this.activePage = indx;
  }

  previousPage(indx: number) {
    this.pageInfo.pageNumber = indx;
    this.getAllUser();
    this.activePage = indx;
  }

  searchUser() {
    let obj = {
      pageNumber: 1,
      size: 5,
      searchText: this.searchText,
      searchType: "name"
    }
    this.userService.searchUser(obj).subscribe((response: any) => {
      this.userInfo = response.data;
      this.totalRecords = response.totalRecords;
      this.setPagination();
    });
  }

  viewUser(user: any) {
    this.matDialogRef = this.matDialog.open(ViewUserComponent, {
      disableClose: true,
      data: user,
      height: '40%',
      width: '60%',
    });
  }
}

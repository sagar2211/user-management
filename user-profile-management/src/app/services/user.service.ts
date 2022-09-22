import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Subject } from 'rxjs';
import { environment } from "../../environments/environment";
import ls from 'localstorage-slim';
ls.config.encrypt = true;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: any;
  editUser = new BehaviorSubject(null);
  toastObj = new Subject<any>();
  activePage = new BehaviorSubject(null);

  constructor(private httpClient: HttpClient) {
    this.user = this.getUserRole();
  }

  createUser(data: any) {
    return this.httpClient.post(`${environment.URL}/user/create`, data);
  }

  loginUser(data: any) {
    return this.httpClient.post(`${environment.URL}/user/login`, data).pipe(
      map((res: any) => {
        if (res.success) {
          this.setLocalStorage(res);
          this.user = this.getUserRole();
        }
        return res;
      }));
  }

  setToast(obj: any) {
    let data = {
      status: obj.success,
      message: obj.message
    }
    this.toastObj.next(data);
  }

  setActivePage(pageName: any) {
    this.activePage.next(pageName);
  }

  logout() {
    return this.httpClient.post(`${environment.URL}/user/logout`, this.user).pipe(
      map((res: any) => {
        if (res.success) {
          this.user = null;
          localStorage.clear();
          this.editUser.next(null);
          this.activePage.next(null);
        }
        return res;
      }));
  }

  setEditUser(user: any) {
    this.editUser.next(user);
    setTimeout(() => {
      this.editUser.next(null);
    }, 1000);
  }

  private getUserRole() {
    return ls.get('userData');
  }

  setLocalStorage(data: any) {
    ls.set('userData', data);
  }

  getLocalStorage() {
    return ls.get('userData');
  }

  getAllUser(data: any) {
    return this.httpClient.post(`${environment.URL}/user/all`, data);
  }

  searchUser(data: any) {
    return this.httpClient.post(`${environment.URL}/user/searchUser`, data);
  }

  updateUser(data: any) {
    return this.httpClient.post(`${environment.URL}/user/update`, data);
  }

  deleteUser(data: any) {
    return this.httpClient.delete(`${environment.URL}/user/delete/${data._id}`);
  }

  googleAuth() {
    return this.httpClient.get(`${environment.URL}/passport/google`);
  }
}

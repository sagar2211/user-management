import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleSigninService {
  private auth2! : gapi.auth2.GoogleAuth;
  private subject = new ReplaySubject<gapi.auth2.GoogleUser>(1)
  constructor() { 
    gapi.load('auth2',()=>{
      this.auth2 = gapi.auth2.init({
        client_id : '625103421553-9t31sku2e3gvlef83l3decu1jv8fj104.apps.googleusercontent.com',
      })
    })
  }

  signIn(){
    this.auth2.signIn({
      scope : "https://www.googleapis.com/auth/gmail.readonly"
    }).then((user)=>{
      this.subject.next(user);
    }).catch((err)=>{
    })
  }

  signOut(){
    this.auth2.signOut().then(()=>{
      // this.subject.next(null);
    })
  }

  public observable():Observable<gapi.auth2.GoogleUser>{
    return this.subject.asObservable();
  }
}

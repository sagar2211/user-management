import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { GoogleSigninService } from 'src/app/services/google-signin.service';
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { FacebookLoginProvider } from "@abacritt/angularx-social-login";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userForm!: FormGroup;
  user!: gapi.auth2.GoogleUser;
  faGoogle = faGoogle;
  faFacebook = faFacebook;
  isToaster = false;
  toasterObj: any;
  constructor(private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private signInService: GoogleSigninService,
    private ref: ChangeDetectorRef,
    private socialService: SocialAuthService) { }

  ngOnInit(): void {
    this.createForm();
    this.signInService.observable().subscribe((user) => {
      this.user = user;
      this.ref.detectChanges();
    })
    this.getToaster();
  }

  createForm() {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: [null, Validators.required]
    });
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.userForm.controls[controlName].touched ? this.userForm.controls[controlName].hasError(errorName) : null;
  }

  onSubmit() {
    this.userService.loginUser(this.userForm.value).subscribe((response) => {
      if (response.success) {
        this.isToaster = true;
        this.userService.setToast(response);
        setTimeout(() => {
          if (response.data.role === 'admin')
            this.router.navigate(['/user/dashboard'])
          else
            this.router.navigate(['/user/welcome']);
        }, 100);
      }
      this.userService.setToast(response);
    })
  }

  signIn() {
    this.signInService.signIn();
  }

  signOut() {
    this.signInService.signOut();
  }

  signInWithFB(): void {
    this.socialService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOutWithFB(): void {
    this.socialService.signOut();
  }

  getToaster() {
    this.userService.toastObj.subscribe((res) => {
      if (res != null) {
        this.toasterObj = res;
        this.isToaster = true;
      }
    })
  }

}

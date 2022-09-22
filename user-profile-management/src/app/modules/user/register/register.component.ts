import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userForm!: FormGroup;
  editUser: any;
  toasterObj: any;
  isToaster: boolean = false;
  constructor(private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.createForm();
    this.getModifyUser();
    this.getToaster();
  }

  createForm() {
    this.userForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      gender: ["Male", Validators.required],
      strength: [null],
      about: [null],
      password: [null, Validators.required]
    });
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.userForm.controls[controlName].touched ? this.userForm.controls[controlName].hasError(errorName) : null;
  }

  getToaster() {
    this.userService.toastObj.subscribe((res) => {
      if (res != null) {
        this.toasterObj = res;
        this.isToaster = true;
      }
    })
  }

  getModifyUser() {
    this.userService.editUser.subscribe((response) => {
      if (response) {
        this.editUser = response;
        this.modifyUser();
      }
    })
  }

  modifyUser() {
    this.userForm.patchValue({
      name: this.editUser.name,
      email: this.editUser.email,
      password: this.editUser.password,
      gender: this.editUser.gender,
      strength: this.editUser.strength,
      about: this.editUser.about
    })
  }

  updateUser() {
    let obj = this.userForm.value;
    obj._id = this.editUser._id;
    this.userService.updateUser(obj).subscribe((response: any) => {
      if (response.success) {
        this.isToaster = true;
        this.userService.setToast(response);
        this.userService.setActivePage("list");
      }
    });
  }

  onSubmit() {
    this.userService.createUser(this.userForm.value).subscribe((response: any) => {
      if (response.success) {
        this.isToaster = true;
        this.userService.setToast(response);
        setTimeout(() => {
          if (this.userService.user?.data.role === 'admin') {
            this.userService.setActivePage("list");
          } else {
            this.router.navigateByUrl('/user/login');
          }
        }, 100);
      }
    });
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  @Input() public toasterObj : any
  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.openSnackBar(this.toasterObj.message,this.toasterObj.status ? "success" : "fail", this.toasterObj.status)
  }

  openSnackBar(message: string, action: string, status: boolean) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: status === true ? ["success-snackbar"] : ["danger-snackbar"],
    });
  }

}

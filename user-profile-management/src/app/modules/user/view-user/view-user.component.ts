import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {
  
  constructor(
    private _mdr: MatDialogRef<ViewUserComponent>,
    @Inject(MAT_DIALOG_DATA) data: string
  ) { }

  ngOnInit(): void {
  }

  CloseDialog() {
    this._mdr.close(false)
  }

}

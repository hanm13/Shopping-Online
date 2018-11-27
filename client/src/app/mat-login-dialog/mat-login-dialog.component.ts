import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user-service.services';
import { MatDialog } from '@angular/material';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-mat-login-dialog',
  templateUrl: './mat-login-dialog.component.html',
  styleUrls: ['./mat-login-dialog.component.css']
})
export class MatLoginDialogComponent implements OnInit {

  user: User;

  // tslint:disable-next-line:max-line-length
  constructor(private myUserService: UserService, private matdialog: MatDialog ) {
    this.user = this.myUserService.currentUser;

   }

  ngOnInit() {

  }

  closeDialog() {
    this.matdialog.closeAll();
  }

}

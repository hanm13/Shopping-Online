import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user-service.services';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent implements OnInit {
  user: User;
  store: { phone: string; email: string; };
  constructor(private myUserService: UserService) {
    this.user = this.myUserService.currentUser;
    this.store = {phone: '03-974-7412', email: 'online@shopping.test.com'}
  }

  logout() {

    for (const key in this.myUserService.currentUser) {
      if (this.myUserService.currentUser.hasOwnProperty(key)) {
        this.myUserService.currentUser[key] = undefined;

      }
    }

    this.myUserService.currentUser.userName = 'Guest';
    this.myUserService.currentUser.firstName = 'Guest';
  }


  ngOnInit() {}
}

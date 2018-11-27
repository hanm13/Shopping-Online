import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user-service.services';
import { User } from '../shared/models/user.model';
import { OrdersService } from '../shared/services/orders-service.service';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.css']
})
export class MyCartComponent implements OnInit {

  user: User;
  cartItemSearch: any = { cartItems: [] };

  constructor(private myUserService: UserService, private myOrderService: OrdersService) {

    this.user = myUserService.currentUser;
    this.cartItemSearch = this.myOrderService.cartItemSearch;

  }

  emptyCartItems() {

    this.myUserService.emptyCartItems();

  }

  removeCartItem(cartItemID) {


    this.myUserService.removeCartItem(cartItemID);

  }

  updateUserState(state) {

    this.user.state = state;

  }

  ngOnInit() {
  }

  onloadSlide () {
    const container = document.getElementById('container');
    const left = document.getElementById('left_panel');
    const right = document.getElementById('right_panel');
    const handle = document.getElementById('drag');
    let isResizing = false;
    let lastDownX = 0;

    handle.onmousedown = function(e) {
        isResizing = true;
        lastDownX = e.clientX;
    };

    document.onmousemove = function(e) {
        // we don't want to do anything if we aren't resizing.
        if (!isResizing) {
            return;
        }
        const offsetRight = container.clientWidth - (e.clientX - container.offsetLeft)  ;
        left.style.right = offsetRight + 'px';
        right.style.width = offsetRight + 'px';
    };

    document.onmouseup = function(e) {
        // stop resizing
        isResizing = false;
    };
}

}

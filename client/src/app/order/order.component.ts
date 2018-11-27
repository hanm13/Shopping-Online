import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user-service.services';
import { User } from '../shared/models/user.model';
import { OrdersService } from '../shared/services/orders-service.service';
import { stringify } from 'querystring';
import { ProductsService } from '../shared/services/products-service.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  user: User;
  currentCreatedOrder: any = { order: undefined };
  cartItemSearch: any = { cartItems: [] };

  constructor(
    private myUserService: UserService,
    private myOrderService: OrdersService
  ) {
    this.user = myUserService.currentUser;
    this.currentCreatedOrder = this.myOrderService.currentCreatedOrder;
    this.cartItemSearch = this.myOrderService.cartItemSearch;
  }

  resetCurrentUserOrder() {
    this.currentCreatedOrder.order = undefined;
  }

  searchCartItems(searchVal) {
    this.cartItemSearch.cartItems = [];

    if (searchVal !== '') {
      for (let index = 0; index < this.user.cartItems.length; index++) {
        const element = this.user.cartItems[index];

        if (
          element.name.toLowerCase().indexOf(searchVal.toLowerCase()) !== -1
        ) {
          this.cartItemSearch.cartItems.push(element.name);
        }
      }
    }

    console.log(
      'Found order cart item search match: ',
      this.cartItemSearch.cartItems
    );
  }

  ngOnInit() {
    this.user.state = 'order';
  }

  saveTextAsFile(data, filename) { // https://codepen.io/sandeep821/pen/JKaYZq
    if (!data) {
      console.error('Console.save: No data');
      return;
    }

    if (!filename) { filename = 'console.json'; }

    const blob = new Blob([data], { type: 'text/plain' }),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a');
    // FOR IE:

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const e = document.createEvent('MouseEvents'),
        a = document.createElement('a');

      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
      e.initEvent(
        'click',
        true,
        false,
      );
      a.dispatchEvent(e);
    }
  }

  getLastOrderFile() {

    const order = this.user.orders[this.user.orders.length - 1];

    let text = `
Order ID: ${order._id} \r\n
Order Creation Date: ${new Date(
  Number(order.creationDate)
).toUTCString()} \r\n
Order Shipping Date: ${order.shippingDate} \r\n
Order Shipping City: ${order.city} \r\n
Order Shipping Street: ${order.street} \r\n
Order Total Price: ${order.totalPrice} \r\n
Order 4 Visa Digits: ${order.visaDigits} \r\n
Purchased Items: \r\n`;

    for (const key in this.user.tempCartItems) {
      if (this.user.tempCartItems.hasOwnProperty(key)) {
        const cartItem = this.user.tempCartItems[key];
        text = text + `___________________\r\n
\r\n
Name: ${cartItem.name} \r\n
Amount: ${cartItem.amount} \r\n
Total Price: ${cartItem.totalPrice}$ \r\n`;
      }
    }


    const fileName = `myOrder_${order._id}.txt`;
    this.saveTextAsFile(text, fileName);

  }
}

import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../shared/services/products-service.service';
import { OrdersService } from '../shared/services/orders-service.service';
import { UserService } from '../shared/services/user-service.services';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  shopImg = './assets/images/book_home_page.png';
  ordersCounter: any = {count: 0 };
  productsCounter: any = {count: 0 };
  user: User;

  // tslint:disable-next-line:max-line-length
  constructor(private myProductsService: ProductsService, private myOrdersService: OrdersService, private myUserService: UserService) {

    this.productsCounter = this.myProductsService.productsCounter;
    this.ordersCounter = this.myOrdersService.ordersCounter;
    this.user = this.myUserService.currentUser;


  }

  ngOnInit() {

    this.myProductsService.initProductsCounter();
    this.myOrdersService.initOrdersCounter();

  }

}

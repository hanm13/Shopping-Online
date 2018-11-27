import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../shared/services/products-service.service';
import { UserService } from '../shared/services/user-service.services';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit {

  user: User;


  constructor(private myProductsService: ProductsService, private myUserService: UserService) {

    this.user = this.myUserService.currentUser;


  }

  ngOnInit() {


    if (this.user.role === 1 || this.user.userName === 'manager') {

      this.user.state = 'admin';
    } else {

      this.user.state = 'shopping';

    }


  }

  searchProductsByName(name) {

    if ( name === '' ) { // if we search for nothing we will reload the regular products;

      this.myProductsService.initProductsFromCategory(this.myProductsService.categoriesList.categories[0]._id);

    } else {

      this.myProductsService.initProductsByName(name);

    }


  }

}

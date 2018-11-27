import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user-service.services';
import { ProductsService } from '../shared/services/products-service.service';
import { MatDialog } from '@angular/material';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-mat-product-confirm-dialog',
  templateUrl: './mat-product-confirm-dialog.component.html',
  styleUrls: ['./mat-product-confirm-dialog.component.css']
})
export class MatProductConfirmDialogComponent implements OnInit {

  ProductQuantityValue: Number;
  selectedProductForCart: any = {product: undefined};
  user: User;
  maxProducts: Number = 15;

  // tslint:disable-next-line:max-line-length
  constructor(private myProductsService: ProductsService, private myUserService: UserService, private matdialog: MatDialog ) {
    this.ProductQuantityValue = 1;
    this.selectedProductForCart = myProductsService.selectedProductForCart;
    this.user = this.myUserService.currentUser;

   }

  ngOnInit() {

  }

  closeDialog() {
    this.matdialog.closeAll();
  }

  plusOneQuantity (quantity) {
    quantity++;
    if ( quantity > this.maxProducts ) { return; }
    this.ProductQuantityValue = quantity;
  }

  minusOneQuantity (quantity) {
    if (quantity > 1) {
      quantity--;
      this.ProductQuantityValue = quantity;
    }
  }

  updateQuantity (quantity) {
    if ( quantity > this.maxProducts ) {
      this.ProductQuantityValue = this.maxProducts;
      return;
    }
    this.ProductQuantityValue = quantity;
  }

  addItemToCartItems(product, amount) {

    this.matdialog.closeAll(); // Must be first!
    this.selectedProductForCart.product = null;

    const shouldUpdate = {should: false, cartItemID: undefined};

    // we check if we already have the item inside our cart items and then if we have we need to update the cart item with the ammount.
    for (const key in this.user.cartItems) {
      if (this.user.cartItems.hasOwnProperty(key)) {
        const element = this.user.cartItems[key];
        if ( element.productID === product._id) {

          shouldUpdate.should = true;
          shouldUpdate.cartItemID = element._id;

        }

      }
    }

    if (shouldUpdate.should) {

      this.myUserService.updateCartItem(shouldUpdate.cartItemID, amount);

    } else {

      this.myUserService.addCartItem(product, amount);

    }

  }

}

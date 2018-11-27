import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../shared/services/products-service.service';
import { UserService } from '../shared/services/user-service.services';
import { User } from '../shared/models/user.model';
import { MatDialog } from '@angular/material';
import { MatProductConfirmDialogComponent } from '../mat-product-confirm-dialog/mat-product-confirm-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  selectedProductsByCategory: any = {products: []};
  selectedProductForCart: any = {product: undefined};
  user: User;

  constructor( private myProductsService: ProductsService, private myUserService: UserService, private matdialog: MatDialog) {

    this.selectedProductsByCategory = myProductsService.selectedProductsByCategory;
    this.selectedProductForCart = myProductsService.selectedProductForCart;
    this.user = this.myUserService.currentUser;

  }

  updateSelectedProductForCart(product) {

    this.matdialog.closeAll();
    this.selectedProductForCart.product = product;
    this.matdialog.open(MatProductConfirmDialogComponent, {
      //   width: '200px',
      //   height: '200px',
        disableClose: false
    });
  }

  editProduct(product) {

    this.myProductsService.updateProductForEdit(product);

  }

  ngOnInit() {

  }

}

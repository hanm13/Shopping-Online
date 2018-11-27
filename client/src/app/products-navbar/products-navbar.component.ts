import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../shared/services/products-service.service';
import { Category } from '../shared/models/category.model';

@Component({
  selector: 'app-products-navbar',
  templateUrl: './products-navbar.component.html',
  styleUrls: ['./products-navbar.component.css']
})
export class ProductsNavbarComponent implements OnInit {

  categories: any = {categories: []};

  constructor( private myProductsService: ProductsService) {

    this.categories = myProductsService.categoriesList;

  }

  ngOnInit() {

    this.myProductsService.initCategoriesList();


  }

  initProductsOfCategory(categoryID) {

    this.myProductsService.initProductsFromCategory(categoryID);
  }

}

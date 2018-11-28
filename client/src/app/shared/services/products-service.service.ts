import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { UserService } from './user-service.services';
import { User } from '../models/user.model';

// מאפשר לשירות הנוכחי להשתמש בתוכו בשירותים אחרים
@Injectable()
export class ProductsService {

    // Heroku: https://sleepy-plains-48411.herokuapp.com - DEV: http://localhost:6200
    mainAPIDomain: String = 'http://localhost:6200';

    productsList: any = { products: [] };
    categoriesList: any = { categories: []};
    selectedProductsByCategory: any = { products: [] };
    selectedProductForCart: any = { product: undefined };
    productsCounter: any = { count: 0};
    productForEdit: any = { product: undefined };
    user: User;

    constructor(private myHttpClient: HttpClient, private myUserService: UserService) {

        this.user = this.myUserService.currentUser;

    }

    initCategoriesList() {

        this.myHttpClient.get(`${this.mainAPIDomain}/api/categories`)
            .subscribe((resp) => {


                this.categoriesList.categories = <Category[]>resp;
                // we want to show items as default and not wait for the client to click on category
                this.initProductsFromCategory(this.categoriesList.categories[0]._id);

            });

    }

    initProductsFromCategory(categoryID) {

        this.myHttpClient.get(`${this.mainAPIDomain}/api/products/category/${categoryID}`)
            .subscribe((resp: any) => {

                this.selectedProductsByCategory.products = <Product[]>resp.items;
                this.selectedProductForCart.product = undefined;

            });

    }

    initProductsByName(name) {

        this.myHttpClient.get(`${this.mainAPIDomain}/api/products/${name}`)
            .subscribe((resp: any) => {

                this.selectedProductsByCategory.products = <Product[]>resp.items;
                this.selectedProductForCart.product = undefined;

            });

    }

    initProductsCounter() {

        this.myHttpClient.get(`${this.mainAPIDomain}/api/count/products`)
        .subscribe((resp: any) => {

            this.productsCounter.count = resp.counter;

        });

    }

    updateProductForEdit(product) {

        this.productForEdit.product = product;

    }

    editProduct(productInfo, categoryId= this.categoriesList.categories[0]._id) {

        this.myHttpClient.put(`${this.mainAPIDomain}/api/products/${this.productForEdit.product._id}`, productInfo, {
            headers: {
                'xx-auth': `${this.user.token}` // authentication for request!
            }

        })
        .subscribe((resp: any) => {

            this.initProductsFromCategory(categoryId);

        });

    }

    addProduct(productInfo, categoryId= this.categoriesList.categories[0]._id) {

        this.myHttpClient.post(`${this.mainAPIDomain}/api/products/`, productInfo, {
            headers: {
                'xx-auth': `${this.user.token}` // authentication for request!
            }

        })
        .subscribe((resp: any) => {

            this.initProductsFromCategory(categoryId);
            this.initProductsCounter();

        });

    }

}

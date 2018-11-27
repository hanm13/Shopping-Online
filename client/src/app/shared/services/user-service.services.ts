import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { hash } from './sha-convertor.service';
// מאפשר לשירות הנוכחי להשתמש בתוכו בשירותים אחרים
@Injectable()
export class UserService {
    currentUser: User = { firstName: 'Guest', userName: 'Guest', token: undefined, cart: undefined, cartItems: undefined,
     state: 'shopping', orders: undefined};
     loginError: any = {error: '' };
     // Heroku: https://sleepy-plains-48411.herokuapp.com - DEV: http://localhost:6200
     mainAPIDomain: String = 'https://sleepy-plains-48411.herokuapp.com';

    constructor(private myHttpClient: HttpClient) {}


    loginUser(loginUser: User, callback?): void {

        const apiUrl = `${this.mainAPIDomain}/api/users`;


        const hashPassword = hash(loginUser.password);
        this.myHttpClient.get(apiUrl, {
            observe: 'response',
            headers: {
                'xx-auth': `${hashPassword}${loginUser.userName}`
            }})
            .subscribe((resp) => {

                for (const key in resp.body) {
                    if (resp.body.hasOwnProperty(key)) {
                        this.currentUser[key] = resp.body[key];
                    }
                }

                this.currentUser.token = resp.headers.get('xx-auth');
                this.initUserCart();
                this.initUserCartItems();
                this.initUserOrders();

                if (this.currentUser.role === 1 || this.currentUser.userName === 'manager') {

                this.currentUser.state = 'admin';

                }

                callback();

            }, (err => {

                this.loginError.error = 'Incorrect details!';

            }));
    }

    calculateTotalCartItemsPrice(cartItems) {

        let total = 0;

        for (let index = 0; index < cartItems.length; index++) {
            const element = cartItems[index];
            total += element.totalPrice;

        }

        return total;

    }


    registerUser(newUser: User): void {
        const apiUrl = `${this.mainAPIDomain}/api/users`;
        newUser.password = hash(newUser.password);

        this.myHttpClient.post(apiUrl, newUser, {observe: 'response'})
        .subscribe((resp) => {

            for (const key in resp.body) {
                if (resp.body.hasOwnProperty(key)) {
                    this.currentUser[key] = resp.body[key];
                }
            }

            this.currentUser.token = resp.headers.get('xx-auth');

        });
    }

    validateUserRegister(newUser) {

        return new Promise((resolve, reject) => {

            this.myHttpClient.post(`${this.mainAPIDomain}/api/users/validateRegister`, newUser, {observe: 'response'})
            .subscribe((resp) => {
                resolve(resp);
            }, (err) => {

                reject(err);

            });

        });

    }

    initUserOrders(): void {

        const userOrdersAPI = `${this.mainAPIDomain}/api/orders/`;


        this.myHttpClient.get(userOrdersAPI + this.currentUser._id, {
            headers: {
                'xx-auth': `${this.currentUser.token}` // authentication for request!
            }})
        .subscribe((resp: any) => {

            this.currentUser.orders = resp.orders;

        });

    }

    initUserCart(): void {

        const apiUrl = `${this.mainAPIDomain}/api/activecarts/${this.currentUser._id}`;


        this.myHttpClient.get(apiUrl, {
            headers: {
                'xx-auth': `${this.currentUser.token}` // authentication for request!
            }})
            .subscribe((resp: any) => {

                this.currentUser.cart = resp.carts[0];

            });
    }

    initUserCartItems(): void {

        const apiUrl = `${this.mainAPIDomain}/api/cartitems/${this.currentUser._id}`;


        this.myHttpClient.get(apiUrl, {
            headers: {
                'xx-auth': `${this.currentUser.token}` // authentication for request!
            }})
            .subscribe((resp: any) => {

                this.currentUser.cartItems = resp.cartitems;

                if(this.currentUser.cartItems.length > 0) {

                    this.currentUser.cart.totalPrice = this.calculateTotalCartItemsPrice(this.currentUser.cartItems);

                } else {

                    if ( this.currentUser.cart ) {

                        this.currentUser.cart.totalPrice = 0;

                    }

                }

            });
    }

    addCartItem(product, amount) {


            this.myHttpClient.post(`${this.mainAPIDomain}/api/cartitems/${this.currentUser._id}`,
            {productID: product._id, amount: amount}, {
                headers: {
                    'xx-auth': `${this.currentUser.token}` // authentication for request!
                }

            })
            .subscribe((resp: any) => {

                this.currentUser.cartItems = resp.cartitems;
                this.currentUser.cart = resp.userCart;
                this.currentUser.cart.totalPrice = this.calculateTotalCartItemsPrice(this.currentUser.cartItems);



            });
    }
    updateCartItem(cartItemID, amount) {


        this.myHttpClient.put(`${this.mainAPIDomain}/api/cartitems/${cartItemID}`,
        {amount: amount, userID: this.currentUser._id}, {
            headers: {
                'xx-auth': `${this.currentUser.token}` // authentication for request!
            }

        })
        .subscribe((resp: any) => {

            this.currentUser.cartItems = resp.cartitems;
            this.currentUser.cart.totalPrice = this.calculateTotalCartItemsPrice(this.currentUser.cartItems);

        });
    }

    emptyCartItems() {

        this.myHttpClient.delete(`${this.mainAPIDomain}/api/cartitems/empty/${this.currentUser.cart._id}`, {
            headers: {
                'xx-auth': `${this.currentUser.token}` // authentication for request!
            }

        })
        .subscribe((resp: any) => {

            this.currentUser.cartItems = [];

        });
    }


    removeCartItem(cartItemID) {

        this.myHttpClient.delete(`${this.mainAPIDomain}/api/cartitems/${cartItemID}`, {
            headers: {
                'xx-auth': `${this.currentUser.token}` // authentication for request!
            }

        })
        .subscribe((resp: any) => {

            this.currentUser.cartItems = resp.cartitems;

        });

    }

}

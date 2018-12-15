import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';
import { UserService } from './user-service.services';
import { User } from '../models/user.model';

// מאפשר לשירות הנוכחי להשתמש בתוכו בשירותים אחרים
@Injectable()
export class OrdersService {

    // Heroku: https://sleepy-plains-48411.herokuapp.com - DEV: http://localhost:6200
    mainAPIDomain: String = 'http://localhost:6200';
    ordersCounter: any = { count: 0};
    user: User;
    currentCreatedOrder: any = { order: undefined};
    cartItemSearch: any = { cartItems: [] };

    constructor(private myUserService: UserService, private myHttpClient: HttpClient) {

        this.user = this.myUserService.currentUser;

    }

    initOrdersCounter() {

        this.myHttpClient.get(`${this.mainAPIDomain}/api/count/orders`)
        .subscribe((resp: any) => {

            this.ordersCounter.count = resp.counter;

        });

    }

    createNewOrder(newOrderInfo) {

        this.myHttpClient.post(`${this.mainAPIDomain}/api/orders/${this.user._id}`, newOrderInfo, {
            headers: {
                'xx-auth': `${this.user.token}` // authentication for request!
            }

        })
        .subscribe((resp: any) => {

            this.user.cart = undefined;
            this.user.tempCartItems = {...this.user.cartItems};
            this.user.cartItems = undefined;
            this.currentCreatedOrder.order = newOrderInfo;
            this.user.orders = <Order[]>resp.orders;

        });

    }

    validateOrderDate(date) {

        return new Promise((resolve, reject) => {

            this.myHttpClient.get(`${this.mainAPIDomain}/api/count/ordersdate/${date}`, {
                headers: {
                    'xx-auth': `${this.user.token}` // authentication for request!
                }
            })
            .subscribe((resp) => {
                resolve(resp);
            }, (err) => {

                reject(err);

            });

        });

    }

}

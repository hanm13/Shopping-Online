import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';
import { UserService } from './user-service.services';
import { User } from '../models/user.model';

// מאפשר לשירות הנוכחי להשתמש בתוכו בשירותים אחרים
@Injectable()
export class OrdersService {

    ordersCounterAPI = 'http://localhost:6200/api/count/orders';
    ordersCounter: any = { count: 0};
    user: User;
    currentCreatedOrder: any = { order: undefined};
    cartItemSearch: any = { cartItems: [] };

    constructor(private myUserService: UserService, private myHttpClient: HttpClient) {

        this.user = this.myUserService.currentUser;

    }

    initOrdersCounter() {

        this.myHttpClient.get(this.ordersCounterAPI)
        .subscribe((resp: any) => {

            this.ordersCounter.count = resp.counter;

        });

    }

    createNewOrder(newOrderInfo) {

        this.myHttpClient.post(`http://localhost:6200/api/orders/${this.user._id}`, newOrderInfo, {
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

            this.myHttpClient.get(`http://localhost:6200/api/count/ordersdate/${date}`, {
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

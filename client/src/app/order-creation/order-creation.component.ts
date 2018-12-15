import { Component, OnInit } from '@angular/core';
import { User } from '../shared/models/user.model';
import { UserService } from '../shared/services/user-service.services';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OrdersService } from '../shared/services/orders-service.service';

@Component({
  selector: 'app-order-creation',
  templateUrl: './order-creation.component.html',
  styleUrls: ['./order-creation.component.css']
})
export class OrderCreationComponent implements OnInit {

  user: User;
  orderAvailableCities: any = {cities: []};
  orderForm: FormGroup;
  orderFormErrors: any = { errors: []};
  today: String;
  // Heroku: https://sleepy-plains-48411.herokuapp.com - DEV: http://localhost:6200
  mainAPIDomain: String = 'http://localhost:6200';

  constructor(private myUserService: UserService, private myOrderService: OrdersService, private myHttpClient: HttpClient) {

    this.user = this.myUserService.currentUser;

    const orderFormConfig = {

      city: this.getFormControl(2, 25, 'City'),
      street: this.getFormControl(2, 25, 'Street'),
      shippingDate: new FormControl('', [
        f => (!f.value ?  { err: `` } : null),
        f => (!f.value && !f.pristine ? { err: `Date is required` } : null),
      ]),
      visaDigits: this.getFormControl(4, 4, 'Visa Digits'),

    };

    this.orderForm = new FormGroup(orderFormConfig);

    const today = new Date();
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    this.today = yyyy + '-' + mm + '-' + dd;

  }

  initOrderCities() {

    this.myHttpClient.get(`${this.mainAPIDomain}/api/cities`)
    .subscribe((resp) => {
        this.orderAvailableCities.cities = resp;
    }, (err) => {

        console.log(err);

    });

  }

  createNewOrder() {


    this.myOrderService.validateOrderDate(this.orderForm.value.shippingDate).then((amount: any) => {

      this.orderFormErrors.errors = [];

      if (amount.ordersAmount < 3) {

        const newOrderInfo = {

          city: this.orderForm.value.city,
          street: this.orderForm.value.street,
          shippingDate: this.orderForm.value.shippingDate,
          visaDigits: this.orderForm.value.visaDigits,

        };

        this.myOrderService.createNewOrder( newOrderInfo );

      } else {

        this.orderFormErrors.errors.push('You must select different day, all shipments are taken!');


      }

    });


        // {\"city\":\"batYam\",\"street\":\"Balfur\",\"shippingDate\":\"21/11/2018\",\"visaDigits\":\"4567\"}



  }

  getFormControl(min, max, label) {
    return new FormControl('', [
      f => (!f.value ?  { err: `` } : null),
      f => (!f.value && !f.pristine ? { err: `${label} is required` } : null),
      f => f.value && f.value.length > max ? { err: `${label} is max ${max} chars` } : null,
      f => f.value && f.value.length < min ? { err: `${label} is min ${min} chars` } : null
    ]);
  }

  ngOnInit() {

    this.initOrderCities();

  }

}

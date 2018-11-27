import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { UserService } from './shared/services/user-service.services';
import { ProductsService } from './shared/services/products-service.service';
import { OrdersService } from './shared/services/orders-service.service';

import { AppComponent } from './app.component';
import { HeadComponent } from './head/head.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccountComponent } from './account/account.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ShoppingComponent } from './shopping/shopping.component';
import { MyCartComponent } from './my-cart/my-cart.component';
import { ProductsComponent } from './products/products.component';
import { ProductsNavbarComponent } from './products-navbar/products-navbar.component';
import { OrderComponent } from './order/order.component';
import { OrderCreationComponent } from './order-creation/order-creation.component';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';
import { MatProductConfirmDialogComponent } from './mat-product-confirm-dialog/mat-product-confirm-dialog.component';
import { MatLoginDialogComponent } from './mat-login-dialog/mat-login-dialog.component';


import { MatDialogModule, MatCardModule, MatButtonModule, MatToolbarModule, MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const appRoutes: Routes = [

    { path: 'home', component: HomeComponent },
    { path: 'account', component: AccountComponent },
    { path: 'shopping', component: ShoppingComponent },
    { path: 'order', component: OrderComponent },

    // default path - will redirect the current path to 'home'
    { path: '',
      redirectTo: '/home',
      pathMatch: 'full'
    },
   // ** is an angular placeholder for any path that does not exist
   { path: '**', component: PageNotFoundComponent }

  ];

@NgModule({
  declarations: [
    AppComponent,
    HeadComponent,
    FooterComponent,
    MainComponent,
    HomeComponent,
    PageNotFoundComponent,
    AccountComponent,
    ShoppingComponent,
    MyCartComponent,
    ProductsComponent,
    ProductsNavbarComponent,
    OrderComponent,
    OrderCreationComponent,
    AddEditProductComponent,
    MatProductConfirmDialogComponent,
    MatLoginDialogComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatIconModule
  ],
  providers: [ProductsService, UserService, OrdersService],
  bootstrap: [AppComponent],
  entryComponents: [MatProductConfirmDialogComponent, MatLoginDialogComponent]
})
export class AppModule { }

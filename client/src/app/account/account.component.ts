import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user-service.services';
import { User } from '../shared/models/user.model';
import { FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { MatLoginDialogComponent } from '../mat-login-dialog/mat-login-dialog.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  // ----------------PROPERTIRS-------------------
  loginForm: FormGroup;
  registerStepOneForm: FormGroup;
  registerStepTwoForm: FormGroup;
  state = 'login';
  user: User;
  registerAvailableCities: any = {cities: []};
  formRegisterErrors = { 'msg': [] };
  loginError: any = {error: '' };
  // Heroku: https://sleepy-plains-48411.herokuapp.com - DEV: http://localhost:6200
  mainAPIDomain: String = 'https://sleepy-plains-48411.herokuapp.com';


  constructor(private myUserService: UserService, private myHttpClient: HttpClient, private matdialog: MatDialog) {

    this.user = this.myUserService.currentUser;
    this.loginError = this.myUserService.loginError;

    const loginGroupConfig = {
      userName: this.getFormControl(2, 15, 'User name'),
      userPassword: this.getFormControl(5, 10, 'Password')
    };


    const registerStepOneGroupConfig = {

        // Real ID validator
        // Pattern: https://github.com/AnnaKarpf/Full-stack-4578_25/blob/master/02_Angular/Day%2007%20-%2013.09.2018/Homework.docx
        personID: this.getPersonIDFormControl(),

        userName: this.getFormControl(2, 45, 'User name'),
        userPassword: this.getFormControl(6, 16, 'Password'),
        userPasswordConfirm: new FormControl('', [
          f => (!f.value ?  { err: `` } : null),
          f => (!f.value  && !f.pristine ?  { err: `Password confirm is required!` } : null),
          f => f.value && f.value !== this.registerStepOneForm.value.userPassword ? { err: `Password does not match!` } : null,
        ]),

    };

    const registerStepTwoGroupConfig = {

      firstName: this.getFormControl(2, 15, 'First name'),
      lastName: this.getFormControl(2, 15, 'Last name'),
      city: this.getFormControl(1, 99, 'City'),
      street: this.getFormControl(1, 99, 'Street'),


  };

    this.loginForm = new FormGroup(loginGroupConfig);
    this.registerStepOneForm = new FormGroup(registerStepOneGroupConfig);
    this.registerStepTwoForm = new FormGroup(registerStepTwoGroupConfig);

  } // end constructor funciton

  getPersonIDFormControl() {

    return new FormControl('', [
      f => (!f.value ?  { err: `` } : null),
      f => !f.value && !f.pristine ? { 'err': `ID is required` } : null,
      f => f.value && f.value.length < 9 ? { 'err': `ID is min 9 chars` } : null,
      f => f.value && f.value.length > 9 ? { 'err': `ID is max 9 chars` } : null,
      function(f) {
        if (f.value && f.value.length) {

          const tempValArr = f.value.toString().split('');

          // A

          if (tempValArr.length < 9) {
            for (let i = 0; i < tempValArr.length; i++) {
              if (tempValArr.length < 9) {
                tempValArr.unshift('0');
              }
          }
         }


          // B
          const accessoriesNumbers = [1, 2, 1, 2, 1, 2, 1, 2, 1];
          const accessoriesValueArr = [];

          // C

          for (let acc_num = 0; acc_num < accessoriesNumbers.length; acc_num++) {

            accessoriesValueArr.push(accessoriesNumbers[acc_num] * tempValArr[acc_num]);

           }

           // D

           for (let acc_value = 0; acc_value < accessoriesValueArr.length; acc_value++) {
               if (accessoriesValueArr[acc_value] > 9) {

                 const tempNum = Math.floor(accessoriesValueArr[acc_value] / 10);
                 const tempNum2 = accessoriesValueArr[acc_value] % 10;

                 accessoriesValueArr[acc_value] = tempNum + tempNum2;
               }
           }

          let counter = 0;
          for (let i = 0; i < accessoriesValueArr.length; i++) {
              counter += accessoriesValueArr[i];
          }

          if (counter % 10 === 0) {


            return null;

          } else {

            return { 'err': `Invalid ID!` };

          }



        }
      },

    ]);

  }

  ngOnInit() {

    this.initRegisterCities();

  }

  initRegisterCities() {

    this.myHttpClient.get(`${this.mainAPIDomain}/api/cities`)
    .subscribe((resp) => {
        this.registerAvailableCities.cities = resp;
    }, (err) => {

        console.log(err);

    });

  }

  getFormControl(min, max, label) {
      return new FormControl('', [
        f => (!f.value ?  { err: `` } : null),
        f => (!f.value && !f.pristine ? { err: `${label} is required` } : null),
        f => f.value && f.value.length > max ? { err: `${label} is max ${max} chars` } : null,
        f => f.value && f.value.length < min ? { err: `${label} is min ${min} chars` } : null
      ]);
  }

  changeState(newState: string) {
    this.state = newState;
  }

  loginUser() {
    this.myUserService.loginUser({
      userName: this.loginForm.value.userName,
      password: this.loginForm.value.userPassword
    }, () => {
      this.matdialog.closeAll();
      this.matdialog.open(MatLoginDialogComponent, {
          disableClose: false
      });
    });
    this.loginForm.reset();

  }
  registerUser() {
    this.myUserService.registerUser({
      personID: this.registerStepOneForm.value.personID,
      userName: this.registerStepOneForm.value.userName,
      password: this.registerStepOneForm.value.userPassword,

      firstName: this.registerStepTwoForm.value.firstName,
      lastName: this.registerStepTwoForm.value.lastName,
      city: this.registerStepTwoForm.value.city,
      street: this.registerStepTwoForm.value.street

    });

    this.registerStepOneForm.reset();
    this.registerStepTwoForm.reset();
  }

  async registerNextClick() {

    this.myUserService.validateUserRegister(this.registerStepOneForm.value).then((resp) => {

      this.changeState('register2');
      this.formRegisterErrors.msg = [];


    }).catch((err) => {

      this.formRegisterErrors.msg = err.error.msg;

    });

  }

}

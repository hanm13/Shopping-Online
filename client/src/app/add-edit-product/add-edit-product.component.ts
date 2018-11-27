import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../shared/services/products-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Category } from '../shared/models/category.model';
import { Product } from '../shared/models/product.model';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css']
})
export class AddEditProductComponent implements OnInit {

  productForEdit: any = { product: {name: '', price: 0 , imageAddress: '', categoryId: '' } };
  editAddForm: FormGroup;
  editAddFormErrors: any = { errors: []};
  categories: any = {categories: []};
  addMode = false;


  constructor(private myProductsService: ProductsService) {

    this.productForEdit = myProductsService.productForEdit;

    this.resetProductForEditObj();

    this.categories = myProductsService.categoriesList;

    const editAddFormConfig = {

      name: this.getFormControl(2, 99, 'Name'),
      price: this.getFormControl(1, 999999, 'Price'),
      imageAddress: this.getFormControl(18, 999999, 'Image Address(/assets/images/name.png)'),
      category: this.getFormControl(1, 99, 'Category'),

    };

    this.editAddForm = new FormGroup(editAddFormConfig);

   }

  ngOnInit() {

    this.myProductsService.initCategoriesList();


  }

  getFormControl(min, max, label, defaultVal= '') {
    return new FormControl(defaultVal, [
      f => (!f.value ?  { err: `` } : null),
      f => (!f.value && !f.pristine ? { err: `${label} is required` } : null),
      f => f.value && f.value.length > max ? { err: `${label} is max ${max} chars` } : null,
      f => f.value && f.value.length < min ? { err: `${label} is min ${min} chars` } : null
    ]);
  }

  editAddProduct() {

    this.editAddFormErrors.errors = [];

    const formProduct = {

      categoryId: this.editAddForm.controls.category.value,
      name: this.editAddForm.controls.name.value,
      price: this.editAddForm.controls.price.value,
      imageAddress: this.editAddForm.controls.imageAddress.value,

    };

    if (this.productForEdit.product._id) {

      this.myProductsService.editProduct(formProduct, formProduct.categoryId);

    } else {

      this.myProductsService.addProduct(formProduct, formProduct.categoryId);

    }

    this.editAddFormErrors.errors.push('Saved! - ' + new Date().toUTCString());

  }

  resetProductForEditObj() {
    this.productForEdit.product = {};
    this.productForEdit.product.name = '';
    this.productForEdit.product.price = 0;
    this.productForEdit.product.categoryId = '';
    this.productForEdit.product.imageAddress = '';
    this.productForEdit.product._id = undefined;

  }

  updateAddMode() {

    this.addMode = !this.addMode;

    if (this.productForEdit.product._id) {
      this.addMode = true;
    }

    this.resetProductForEditObj();

    this.editAddForm.reset();

}


}

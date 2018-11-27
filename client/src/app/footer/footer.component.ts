import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: []
})
export class FooterComponent {
  adminName = 'Chen Magled';
  currentYear: number = (new Date()).getFullYear();
}

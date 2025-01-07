import { Component } from '@angular/core';
import { PaypalButtonComponent } from "../paypal-button/paypal-button.component";

@Component({
  selector: 'app-payment',
  imports: [PaypalButtonComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {

}

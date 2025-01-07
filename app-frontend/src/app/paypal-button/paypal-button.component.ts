import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Declare PayPal script variable
declare var paypal: any;

@Component({
  selector: 'app-paypal-button',
  standalone: true,
  templateUrl: './paypal-button.component.html',
  styleUrls: ['./paypal-button.component.css']
})
export class PaypalButtonComponent implements OnInit, AfterViewInit {
  
  totalBookedSeats: number = 1; // Receive value from parent
  seatPrice: number = 10; // Price per seat
  private isPaypalRendered: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Retrieve the query parameter `totalBookedSeats` from the URL
    this.route.queryParams.subscribe(params => {
      this.totalBookedSeats = +params['totalBookedSeats']; // Convert string to number, default to 0
      console.log(`Total seats booked from query params: ${this.totalBookedSeats}`);
    });
  }

  ngAfterViewInit(): void {
    if (!this.isPaypalRendered) {
      this.loadPaypalScript().then(() => {
        this.renderPaypalButton();
      });
    }
  }

  getTotalAmount(): number {
    return this.totalBookedSeats * this.seatPrice; // Calculate total dynamically
  }

  renderPaypalButton(): void {
    if (this.isPaypalRendered) return;

    const paypalContainer = document.getElementById('paypal-button-container');
    if (!paypalContainer) return;

    const totalAmount = this.getTotalAmount();

    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: totalAmount.toFixed(2) // Format amount
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          const payerName = details?.payer?.name?.given_name;
          alert(`Transaction completed by ${payerName}. Total paid: $${totalAmount.toFixed(2)}`);
        });
      }
    }).render('#paypal-button-container');

    this.isPaypalRendered = true;
  }

  loadPaypalScript(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src="https://www.paypal.com/sdk/js?client-id=AQ4dbvjCfnuvB8Q6_lFY2ptLZ96Mzetb44XH65xT8Qh5BMPzV0yHJFzVlA5zhbiT8NsH0ePwqVfHV4Ta"]')) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = "https://www.paypal.com/sdk/js?client-id=AQ4dbvjCfnuvB8Q6_lFY2ptLZ96Mzetb44XH65xT8Qh5BMPzV0yHJFzVlA5zhbiT8NsH0ePwqVfHV4Ta";
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });
  }
}

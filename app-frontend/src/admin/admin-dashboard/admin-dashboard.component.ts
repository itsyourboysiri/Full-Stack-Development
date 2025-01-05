import { Component } from '@angular/core';
import { Chart, registerables, LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';


@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  ngOnInit() {

    Chart.register(
      LinearScale, // Linear scale
      CategoryScale, // X-axis scale
      PointElement, // Point in line chart
      LineElement, // Line in line chart
      Title, // Title plugin
      Tooltip, // Tooltip plugin
      Legend, // Legend plugin
      ...registerables // Optional, registers additional defaults
    );
    
    this.renderSalesChart();
  }

  renderSalesChart() {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;

    const salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'],
        datasets: [
          {
            label: 'Sales for Today',
            data: [50, 70, 100, 150, 200, 250], // Placeholder sales data
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Simulate real-time updates
     // Simulate real-time updates safely
  setInterval(() => {
    if (!salesChart.data.labels) {
      salesChart.data.labels = []; // Initialize labels array if undefined
    }
    if (!salesChart.data.datasets[0].data) {
      salesChart.data.datasets[0].data = []; // Initialize data array if undefined
    }

    salesChart.data.labels.push(new Date().toLocaleTimeString()); // Add new label
    salesChart.data.datasets[0].data.push(Math.floor(Math.random() * 300)); // Add random data
    salesChart.update();
  }, 5000);
  }

}

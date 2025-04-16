import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, IonicModule, BaseChartDirective , ],
})
export class DashboardComponent implements OnInit  {


  constructor(
    private dashboardSvc : DashboardService
  ) { }




  async ngOnInit(): Promise<void> {

  }


 // 📊 Gráfico de barras
 public barChartOptions: ChartConfiguration['options'] = {
  responsive: true,
  plugins: {
    legend: { display: true },
  }
};

public barChartData = {
  labels: ['Empresa A', 'Empresa B', 'Empresa C', 'Empresa D'],
  datasets: [
    {
      label: 'Usuarios',
      data: [120, 80, 60, 40],
      backgroundColor: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'],
    }
  ]
};

// 🍩 Gráfico tipo doughnut
public doughnutChartOptions: ChartConfiguration['options'] = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
  }
};

public doughnutChartData = {
  labels: ['CRM', 'Inventario', 'Ventas', 'Reportes'],
  datasets: [
    {
      data: [25, 30, 20, 25],
      backgroundColor: ['#F94144', '#F3722C', '#F8961E', '#43AA8B'],
    }
  ]
};



}
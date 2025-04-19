import { AccessControlService } from './../../../../../core/services/access-control/access-control.service';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../../services/dashboard.service';
import { HasPermissionDirective } from 'src/app/core/services/access-control/directives/has-permission.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, IonicModule, BaseChartDirective , HasPermissionDirective],
})
export class DashboardComponent implements OnInit  {


  constructor(
    private dashboardSvc : DashboardService,
    private accessCtrl : AccessControlService
  ) { }




  async ngOnInit(): Promise<void> {
    const permisos = await this.accessCtrl.getPermissions();
    console.log('Permisos del rol:', permisos);
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
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  imports: [IonicModule, CommonModule]
})
export class UsersListComponent implements OnInit {
  
  users = [
    {
      name: 'Miguel A. Cavalcante',
      email: 'miguel@example.com',
      roles: ['admin', 'user']
    },
    {
      name: 'Ana Pérez',
      email: 'ana@empresa.com',
      roles: ['bussinesOwner']
    },
    {
      name: 'Carlos Gómez',
      email: 'carlos@gmail.com',
      roles: ['user']
    }
  ];
  
  constructor(
    private router: Router
  ){

  }

  ngOnInit() {
   
  
  }

  navigateTo(path: string) {
    this.router.navigate(['/admin', path]);
  }
}

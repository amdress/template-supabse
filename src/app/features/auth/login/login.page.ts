import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input.component';
import { Router } from '@angular/router';
import { LoginCredentials } from '../../../../app/core/models/user.model';
import { AuthService } from '../../../core/services/access-control/auth/auth.service';
import Swal from 'sweetalert2';
import { UtilsService } from '../../../../app/shared/utils/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule, CustomInputComponent]
})
export class LoginPage implements OnInit {
  
loginForm = new FormGroup({
  email: new FormControl('',[
    Validators.required,
    Validators.email
  ]),
  password: new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ])
})

  constructor(
    private router: Router,
    private authSvc : AuthService,
    private utilSvc : UtilsService
  ) {
   
  }

  ngOnInit() {}

  onSubmit() {
    if (this.loginForm.invalid) {
      this.utilSvc.presentToast({
        message: `Error en el formulario $`,
        duration: 2000,
        color: 'danger'
      })
      return;
    }

    try {

      this.utilSvc.presentLoading({message:'Haciendo Login...'})

      const loginData: LoginCredentials = {
        email: this.loginForm.get('email')?.value ?? '',
        password: this.loginForm.get('password')?.value ?? ''
      };
  
      this.authSvc.signIn(loginData).subscribe({
        next: (response) => {
          this.utilSvc.dismissLoading()
          
          this.loginForm.reset();
        },
        error: (err) => {
          this.utilSvc.dismissLoading();
          this.utilSvc.presentToast({
            message: `Error: ${err}`,
            duration: 2000,
            color: 'danger'
          })
          console.log('Error Ts: ',err)
          
        }
      });
      
    } catch (error) {
      console.log(error)
    }finally {
      this.utilSvc.dismissLoading()
    }

 
  }

  goToRegister() {
    this.router.navigate(['auth/register']);
  }

}

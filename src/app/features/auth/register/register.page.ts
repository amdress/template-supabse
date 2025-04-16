import { LoginCredentials } from './../../../core/models/user.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input.component';
import { Router } from '@angular/router';
import { UtilsService } from '../../../shared/utils/utils.service';
import { AuthService } from '../../../core/services/access-control/auth/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, CustomInputComponent]
})
export class RegisterPage implements OnInit {

  registerForm = new FormGroup({
    displayName: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(30)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  constructor(
    private router: Router,
    private auhtSvc : AuthService,
    private utilSvc : UtilsService
  ) { }

  ngOnInit() {
  }

  // Validador personalizado para coincidencia de contraseñas
  private passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { mismatch: true };
  }

  
 async onSubmit() {
    if (this.registerForm.invalid) {
      this.showFormErrors();
      return;
    }

    console.log(this.registerForm.value)
    await this.handleRegistration();
    
  }

  private showFormErrors(): void {
    if (this.registerForm.hasError('mismatch')) {
      this.utilSvc.presentToast({
        message: 'Las contraseñas no coinciden',
        duration: 2000,
        color: 'warning'
      });
    } else {
      this.utilSvc.presentToast({
        message: 'Por favor completa todos los campos correctamente',
        duration: 2000,
        color: 'warning'
      });
    }
  }
  



  private async handleRegistration(): Promise<void> {
    const { email, password } = this.registerForm.value;
    const loading = await this.utilSvc.presentLoading({message: 'Creando tu cuenta...'});

    const registerData: LoginCredentials = {
      email: this.registerForm.get('email')?.value ?? '',
      password: this.registerForm.get('password')?.value ?? '',
    };

    try {
      const user = await this.auhtSvc.signUp(registerData);
      console.log(user)
      
      await this.router.navigate(['/auth']);

      this.utilSvc.presentToast({
        message: `¡Bienvenido ${user}!Haga login para continuar.`,
        duration: 3000,
        color: 'success'
      });

      this.registerForm.reset();
    } catch (error) {
      this.handleRegistrationError(error);
    } finally {
      await this.utilSvc.dismissLoading();
    }
  }

  private handleRegistrationError(error: unknown): void {
    const errorMessage = this.getErrorMessage(error);
    console.error('Registration error:', error);
    
    this.utilSvc.presentToast({
      message: errorMessage,
      duration: 3000,
      color: 'danger'
    });
  }


  private getErrorMessage(error: unknown): string {
    if (typeof error === 'string') return error;
    if (error instanceof Error) {
      return error.message.includes('already registered') 
        ? 'Este email ya está registrado' 
        : error.message;
    }
    return 'Error desconocido al registrar';
  }

  goToLogin(){
    this.router.navigate(['/auth'])
  }
}

import {
    Directive,
    inject,
    Input,
    TemplateRef,
    ViewContainerRef,
  } from '@angular/core';
  import { AccessControlService } from '../access-control.service';
  
  @Directive({
    selector: '[hasPermission]',
    standalone: true,
  })
  export class HasPermissionDirective {
    private accessControl = inject(AccessControlService);
    private viewContainer = inject(ViewContainerRef);
    private templateRef = inject(TemplateRef<any>);
  
    @Input() set hasPermission(permission: string) {
      this.checkPermission(permission);
    }
  
    private async checkPermission(permission: string) {
      // Limpiar cualquier vista previa antes de evaluar
      this.viewContainer.clear();
  
      try {
        const permissions = await this.accessControl.getPermissions();
  
        if (permissions.includes(permission)) {
          // Mostrar contenido si el permiso existe
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
      } catch (error) {
        console.error('Error al verificar permisos en la directiva:', error);
      }
    }
  }
  
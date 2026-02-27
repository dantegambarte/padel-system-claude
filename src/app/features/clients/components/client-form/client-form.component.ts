import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../../../../core/services/notification.service';
import { ClientService } from '../../services/client.service';
import { Client, CreateClientDto, UpdateClientDto } from '../../models/client.interface';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {
  clientForm!: FormGroup;
  loading = false;
  isEditMode = false;
  clientId?: string;

  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<ClientFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { client?: Client }
  ) {
    this.isEditMode = !!data?.client;
    this.clientId = data?.client?.id;
  }

  ngOnInit(): void {
    this.initForm();

    if (this.isEditMode && this.data.client) {
      this.clientForm.patchValue(this.data.client);
    }
  }

  initForm(): void {
    this.clientForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
      email: ['', [Validators.email]],
      dni: ['', [Validators.pattern(/^[0-9]{7,8}$/)]],
      notas: ['']
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.markFormGroupTouched(this.clientForm);
      return;
    }

    this.loading = true;
    const formValue = this.clientForm.value;

    if (this.isEditMode && this.clientId) {
      this.updateClient(formValue);
    } else {
      this.createClient(formValue);
    }
  }

  createClient(data: CreateClientDto): void {
    this.clientService.createClient(data).subscribe({
      next: (client) => {
        this.notificationService.showSuccess('Cliente creado correctamente');
        this.dialogRef.close(true);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateClient(data: UpdateClientDto): void {
    this.clientService.updateClient(this.clientId!, data).subscribe({
      next: (client) => {
        this.notificationService.showSuccess('Cliente actualizado correctamente');
        this.dialogRef.close(true);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para errores
  get nombreError(): string {
    const control = this.clientForm.get('nombre');
    if (control?.hasError('required') && control.touched) {
      return 'El nombre es requerido';
    }
    if (control?.hasError('minlength') && control.touched) {
      return 'El nombre debe tener al menos 2 caracteres';
    }
    return '';
  }

  get apellidoError(): string {
    const control = this.clientForm.get('apellido');
    if (control?.hasError('required') && control.touched) {
      return 'El apellido es requerido';
    }
    if (control?.hasError('minlength') && control.touched) {
      return 'El apellido debe tener al menos 2 caracteres';
    }
    return '';
  }

  get telefonoError(): string {
    const control = this.clientForm.get('telefono');
    if (control?.hasError('required') && control.touched) {
      return 'El teléfono es requerido';
    }
    if (control?.hasError('pattern') && control.touched) {
      return 'El teléfono debe tener entre 8 y 15 dígitos';
    }
    return '';
  }

  get emailError(): string {
    const control = this.clientForm.get('email');
    if (control?.hasError('email') && control.touched) {
      return 'Email inválido';
    }
    return '';
  }

  get dniError(): string {
    const control = this.clientForm.get('dni');
    if (control?.hasError('pattern') && control.touched) {
      return 'El DNI debe tener 7 u 8 dígitos';
    }
    return '';
  }
}

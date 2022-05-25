import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  types: any = ['Admin', 'Paciente', 'Dentista'];
  private isEmail = /\S+@\S+\.\S+/;
  formSubmitted = false;
  image: any;
  isImageSaved: boolean = false;
  cardImageBase64: string = '';
  public registerForm = this.fb.group(
    {
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      type: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.isEmail)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      terms: [false, [Validators.requiredTrue]],
    },
    {
      validators: this.samePassword('password', 'confirmPassword'),
    }
  );

  constructor(private authSrv: AuthService, private fb: FormBuilder) {
    
  }

  ngOnInit(): void {
    const image = document.getElementById('labelImage').style
    image.backgroundImage = `url(https://firebasestorage.googleapis.com/v0/b/angularfire-14c89.appspot.com/o/images%2Fprofile.jpg?alt=media&token=a9ff9653-c73a-4a6c-82c8-2a4685f35625)`;
    image.backgroundSize = 'cover';
    image.height='150px';
    image.width='150px';
    image.margin= '0 auto';
    image.borderRadius = '50%';
  }

  get selectType() {
    return this.registerForm.get('type');
  }

  createUser() {
    this.formSubmitted = true;
    if (this.registerForm.valid && this.isImageSaved) {
      this.authSrv.signIn({
        name: this.registerForm.value.name,
        lastName: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        type: this.registerForm.value.type,
        image: this.image,
      });
    }
  }

  isSelectedType(): boolean {
    return this.selectType.value == '';
  }

  btnRegister() {
    let flag;
    if (this.isSelectedType() || this.registerForm.invalid) {
      flag = true;
    } else {
      flag = false;
    }
    return flag;
  }

  formNotValid(camp: string): boolean {
    return this.registerForm.get(camp).invalid && this.formSubmitted;
  }
  aceptTerms() {
    return !this.registerForm.get('terms').value && this.formSubmitted;
  }

  passwordsNotValid() {
    const pass = this.registerForm.get('password').value;
    const confirmPass = this.registerForm.get('confirmPassword').value;
    return pass != confirmPass && this.formSubmitted;
  }

  samePassword(pass1: string, pass2: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ notSame: true });
      }
    };
  }

  onUpload($event) {
    this.image = $event.target.files[0];
    if ($event.target.files && $event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const imgBase64Path = e.target.result;
          this.cardImageBase64 = imgBase64Path;         
          this.isImageSaved = true;
          document.getElementById('labelImage').style.backgroundImage =  `url(${imgBase64Path})`;
        };
      };
      reader.readAsDataURL($event.target.files[0]);
    }
  }
}

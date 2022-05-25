import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { SweetAlertService } from './sweet-alert.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollecitons: AngularFirestoreCollection<any>;
  imageUrl: any;
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private storage: AngularFireStorage,
    private sweetAlertSrv: SweetAlertService,
    private router: Router
  ) {
    this.usersCollecitons = this.afStore.collection('users');
  }

  logIn(email: string, password: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const userLogin = this.usersCollecitons.doc<any>(user.uid).get();
        userLogin.subscribe({
          next: (user) => {
            if (user.exists) {
              this.sweetAlertSrv.alert('success', 'Bienvenido', 1500);
              localStorage.setItem('user', JSON.stringify(user.data()));
              this.router.navigate(['/home']);
            }
          },
          error: (err:Error) => {
            this.sweetAlertSrv.alert('error', `${err.message}`, 1500);
          }
        });
      })
      .catch((resp) => {
        let errorMessage='Error desconocido';
        switch (resp.code) {
          case 'auth/user-not-found':
            errorMessage='El usuario no existe';
            break;
          case 'auth/wrong-password':
            errorMessage='La contraseña es incorrecta';
            break;
          case 'auth/invalid-email':
            errorMessage='El email es invalido';
            break;
          default:
            console.log('Error desconocido');
            break;
        }
        this.sweetAlertSrv.alert('error', errorMessage, 1500);
      });
  }
  signIn({ name, lastName, email, password, type, image }) {
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const filePath = `images/${user.uid}/${image.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, image);
        this.uploadPercent = task.percentageChanges();
        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe({
                next: (url) => {
                    this.imageUrl = url;
                    const userRef = this.usersCollecitons.doc<any>(user.uid).set({
                      email: user.email,
                      uid: user.uid,
                      name: name,
                      lastname: lastName,
                      type: type,
                      image: this.imageUrl,
                    });
                    userRef.then(() => {
                      console.log('Usuario Creado');
                      localStorage.setItem(
                        'user',
                        JSON.stringify({
                          email: user.email,
                          uid: user.uid,
                          name: name,
                          lastname: lastName,
                          type: type,
                          image: this.imageUrl,
                        })
                      );
                      this.sweetAlertSrv.alert('success', 'Usuario creado', 1500);
                      this.router.navigate(['/home']);
                    });
                },
                error: (err:Error) => {
                  this.sweetAlertSrv.alert('error', `${err.message}`, 1500);
                }
              });
            })
          )
          .subscribe();
      })
      .catch((resp) => {
        let errorMessage='Error desconocido';
        switch (resp.code) {
          case 'auth/email-already-in-use':
            console.log('El email ya esta en uso');
            errorMessage='El email ya esta en uso';
            break;
          case 'auth/invalid-email':
            console.log('El email es invalido');
            errorMessage='El email es invalido';
            break;
          case 'auth/operation-not-allowed':
            console.log('No se puede registrar');
            errorMessage='No se puede registrar';
            break;
          case 'auth/weak-password':
            console.log('La contraseña es muy debil');
            errorMessage='La contraseña es muy debil';
            break;
          default:
            console.log('Error desconocido', resp);
            break;
        }
        this.sweetAlertSrv.alert('error', errorMessage, 1500);
      });
  }
  logOut() {
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/signIn']);
    });
  }

  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (user.type === 'Admin') {
        return true;
      }
    }
    this.router.navigate(['/home']);
    return false;
  }
  isPatient(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (user.type === 'Paciente') {
        return true;
      }
    }
    this.router.navigate(['/home']);
    return false;
  }
  isMedic(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (user.type === 'Dentista') {
        return true;
      }
    }
    this.router.navigate(['/home']);
    return false;
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['navbar.component.scss']
})
export class NavbarComponent implements OnDestroy, OnInit {

  rolSubs$: Subscription;
  isLoged=false;
  isPatient= false;
  isDentist=false;
  user:any
  constructor(private router:Router,private authSrv:AuthService) {
    this.rolSubs$ = this.getArgumentosRuta()
    .subscribe(( {rol} ) => {
      switch (rol) {
        case 'patient':
          console.log('Es paciente');
          break;
        case 'dentist':
          break;
      
        default:

          break;
      }
    });
   }
  ngOnInit(): void {
    if(localStorage.getItem('user')){
      this.isLoged=true;
      this.user=JSON.parse(localStorage.getItem('user'));
    }
  }

   ngOnDestroy(): void {
    this.rolSubs$.unsubscribe();
    }
  getArgumentosRuta() {
    return this.router.events.pipe(
      filter(
        (event: any) =>
          event instanceof ActivationEnd &&
          event.snapshot.firstChild === null &&
          event.snapshot.queryParams != null
      ),
      map((event: ActivationEnd) => event.snapshot.queryParams)
    );
  }

  logOut(){
    this.authSrv.logOut();
  }
  viewUser(){
    this.router.navigate(['/user']);
  }

}

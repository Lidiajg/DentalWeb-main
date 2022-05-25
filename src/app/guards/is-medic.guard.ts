import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsMedicGuard implements CanActivate {
  constructor(private authSrv:AuthService){

  }
  canActivate():boolean  {
    return this.authSrv.isMedic();
  }
  
}

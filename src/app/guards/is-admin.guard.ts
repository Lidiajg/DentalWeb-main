import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class isAdminGuard implements CanActivate {
  constructor(private authSrv: AuthService) {}
  canActivate() {
    return this.authSrv.isAdmin();
  }
}

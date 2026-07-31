import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProdutorGuard {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isProdutor()) return true;
    this.router.navigate(['/home']);
    return false;
  }
}

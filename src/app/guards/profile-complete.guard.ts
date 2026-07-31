import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserProfileService } from '../service/user-profile.service';
import { AuthService } from '../login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileCompleteGuard {

  constructor(
    private profileService: UserProfileService,
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.userAutetic()) return true; // AuthGuard tratará auth
    if (this.profileService.isProfileComplete()) return true;
    this.router.navigate(['/atualizar-informacoes'], {
      queryParams: { redirect: state.url }
    });
    return false;
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, filter, startWith, map } from 'rxjs/operators';
import { AuthService } from '../../login/auth.service';
import { UserProfileService } from '../../service/user-profile.service';

@Component({
    selector: 'app-profile-notification-banner',
    templateUrl: './profile-notification-banner.component.html',
    standalone: false
})
export class ProfileNotificationBannerComponent implements OnInit, OnDestroy {

  visible = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private profileService: UserProfileService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const route$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.router.url),
    );

    combineLatest([
      this.authService.authStatus$,
      this.profileService.profileComplete$,
      route$,
    ]).pipe(takeUntil(this.destroy$))
      .subscribe(([isAuth, isComplete, url]) => {
        const onProfilePage = (url || '').includes('/atualizar-informacoes');
        this.visible = isAuth && !isComplete && !onProfilePage;
      });

    // Carregar perfil para alimentar o observable (silencioso)
    if (this.authService.userAutetic()) {
      this.profileService.getProfile().pipe(takeUntil(this.destroy$)).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

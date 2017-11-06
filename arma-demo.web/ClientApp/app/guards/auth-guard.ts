import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor (public router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.checkLogin();
    }

    checkLogin(): boolean {
        this.router.navigate(['/home']);
        return false;
    }
}

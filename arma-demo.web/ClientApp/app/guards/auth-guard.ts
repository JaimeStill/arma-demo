import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { IdentityService } from '../services/identity.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor (public router: Router, public identity: IdentityService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.checkLogin();
    }

    checkLogin(): boolean {
        if (this.identity.authenticated) { return true; }
        this.router.navigate(['/home']);
        return false;
    }
}

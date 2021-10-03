import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  
  private isAuthenticated$ = new BehaviorSubject(false);

  authState = this.isAuthenticated$.asObservable();

  setAuth(data) {
    this.isAuthenticated$.next(data);
  }

  access;
  
  constructor(private router: Router) { 
    this.authState.subscribe(
      state =>{
        this.access = state;
      }
    )
  }

  canActivate(route: ActivatedRouteSnapshot)
  {
    if(!this.access){
      this.router.navigate(['/index']);
    }
    return this.access;
  }
}

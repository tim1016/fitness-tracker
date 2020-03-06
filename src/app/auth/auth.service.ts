import { Injectable } from "@angular/core";

import { User } from "./user.model";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AuthService {
  private user: User;
  authChange = new Subject<boolean>();

  constructor(private router: Router) {}

  private authSuccess() {
    this.authChange.next(true);
    this.router.navigate(["/training"]);
  }

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authSuccess();
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authSuccess();
  }

  logout() {
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(["/login"]);
  }

  getUser() {
    return { ...this.user };
  }

  isAuth() {
    // console.log(this.user);
    return this.user ? "true" : null;
  }
}

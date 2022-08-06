import { Component } from '@angular/core';
import { DtAuthService } from './dt-auth.service';
import { GoogleApiService, UserInfo } from './google-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'DanTech';

  userInfo?: UserInfo;

  constructor(private readonly googleApi: GoogleApiService, private readonly dtAuth: DtAuthService) {
    googleApi.userProfileSubject.subscribe( info => {
      this.userInfo = info;
    })
  }

  isLoggedIn(): boolean {
    return this.googleApi.isLoggedIn();
  }

  logout() {
    this.googleApi.signOut();
  }

  accessToken(): string {
    return this.googleApi.accessToken();
  }

  dtAuthTest(): string {
    return this.dtAuth.test();
  }

  login(): void {
    return this.dtAuth.authenticate();
  }
}
  

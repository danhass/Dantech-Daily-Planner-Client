import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin,
  clientId: '849195656550-mi3286esf9mrgk8gkacu2712c1qghi3m.apps.googleusercontent.com',
  scope: 'openid profile email'  
}

export interface UserInfo {
  info: {
    sub: string,
    email: string,
    name: string,
    given_name: string,
    family_name: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  userProfileSubject = new Subject<UserInfo>()

  constructor(private readonly oAuthService: OAuthService) {
    oAuthService.configure(oAuthConfig)
    oAuthService.loadDiscoveryDocument().then( () => {
      oAuthService.tryLoginImplicitFlow().then(() => {
        if(!oAuthService.hasValidAccessToken()) {
          oAuthService.initLoginFlow()
        } else {
          oAuthService.loadUserProfile().then((userProfile) => {
            this.userProfileSubject.next(userProfile as UserInfo)
            //console.log(JSON.stringify(userProfile))
          })
        }
      })
    })
   }

   isLoggedIn(): boolean{
    return this.oAuthService.hasValidAccessToken();
   }

   signOut() {
    this.oAuthService.logOut();
   }

   accessToken(): string {
    return this.oAuthService.getAccessToken();
   }
  }
   

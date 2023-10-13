import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

const GoogleAuthEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
const GoogleCalendarScope = "https://www.googleapis.com/auth/calendar";
const GoogleUserInfoEmailScope = "https://www.googleapis.com/auth/userinfo.email";
const GoogleUserInfoProfileScope = "https://www.googleapis.com/auth/userinfo.profile";
const GoogleClientId = "849195656550-mi3286esf9mrgk8gkacu2712c1qghi3m.apps.googleusercontent.com";


@Injectable({
  providedIn: 'root'
})
export class DtAuthService {

  constructor(private cookie: CookieService) { } 

  authenticate(): void {

    let url = GoogleAuthEndpoint + 
                "?state=google_signin" + 
                "&redirect_uri=" + window.location.protocol + "//" + window.location.hostname;
    if (window.location.port.length > 0) url += ":" + window.location.port;
    url +="/google" +
                "&access_type=offline" +
                "&response_type=code" +
                "&scope=" + "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar" +
                "&client_id=" + GoogleClientId;
    this.cookie.set("sentToGoogle", "true");
  
    window.location.href = url;
  }
}

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OAuthModule } from 'angular-oauth2-oidc';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleHandlerComponent } from './google-handler/google-handler.component';
import { DtConstantsService } from './dt-constants.service';
import { FormsModule } from '@angular/forms';
import { DtProjects } from './dt-planner.service';

@NgModule({
  declarations: [
    AppComponent,
    GoogleHandlerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    OAuthModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

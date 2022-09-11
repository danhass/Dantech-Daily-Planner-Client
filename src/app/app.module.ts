import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OAuthModule } from 'angular-oauth2-oidc';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleHandlerComponent } from './google-handler/google-handler.component';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  declarations: [
    AppComponent,
    GoogleHandlerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    TooltipModule
  ],
  providers: [ DatePipe ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleHandlerComponent } from './google-handler/google-handler.component';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DtNotMobilePlannerComponent } from './dt-not-mobile-planner/dt-not-mobile-planner.component';
import { DtPrivacyPolicyComponent } from './dt-privacy-policy/dt-privacy-policy.component';
import { DtLoginComponent } from './dt-login/dt-login.component';
import { DtTosComponent } from './dt-tos/dt-tos.component';
import { DtProjectComponent } from './dt-project/dt-project.component';
import { DtTabsComponent } from './dt-tabs/dt-tabs.component';
import { DtPlanItemCollectionComponent } from './dt-plan-item-collection/dt-plan-item-collection.component';
import { DtPlanItemComponent } from './dt-plan-item/dt-plan-item.component';
import { DtRecurrenceComponent } from './dt-recurrence/dt-recurrence.component';
import { DtPlannerDaysComponent } from './dt-planner-days/dt-planner-days.component';
import { DtRecurrenceItemComponent } from './dt-plan-item/dt-recurrence-item/dt-recurrence-item.component';
import { DtDateSeparatedPlanItemComponent } from './dt-plan-item/dt-date-separated-plan-item/dt-date-separated-plan-item.component';
import { MaterialModule } from './shared/modules/material/material.module';
import { TooltipModule } from 'ng2-tooltip-directive';
import { DtUserCredentialsComponent } from './dt-user-credentials/dt-user-credentials.component';
import { DtKetoComponent } from './dt-keto/dt-keto.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    MaterialModule,
    TooltipModule
  ],
  declarations: [
    AppComponent,
    GoogleHandlerComponent,
    DtNotMobilePlannerComponent,
    DtPrivacyPolicyComponent,
    DtLoginComponent,
    DtTosComponent,
    DtProjectComponent,
    DtTabsComponent,
    DtPlanItemCollectionComponent,
    DtPlanItemComponent,
    DtRecurrenceComponent,
    DtPlannerDaysComponent,
    DtRecurrenceItemComponent,
    DtDateSeparatedPlanItemComponent,
    DtUserCredentialsComponent,
    DtKetoComponent
  ],  
  providers: [ DatePipe ],
  bootstrap: [AppComponent]
})
export class AppModule { }

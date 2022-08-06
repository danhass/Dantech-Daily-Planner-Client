import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoogleHandlerComponent } from './google-handler/google-handler.component';

const routes: Routes = [
  {path: 'google', component: GoogleHandlerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

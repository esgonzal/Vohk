import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NavbarComponent } from './sharepage/navbar/navbar.component';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { UserComponent } from './user/user.component';
import { LockComponent } from './lock/lock.component';
import { PasscodeComponent } from './passcode/passcode.component';
import { EkeyComponent } from './ekey/ekey.component';
import { PopUpComponent } from './pop-up/pop-up.component';
import { PassageModeComponent } from './passage-mode/passage-mode.component';
import { TransferLockComponent } from './transfer-lock/transfer-lock.component';
import { HomeComponent } from './home/home.component';
import { PerfilComponent } from './perfil/perfil.component';


import { DatePipe } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    LockComponent,
    PasscodeComponent,
    EkeyComponent,
    PopUpComponent,
    PassageModeComponent,
    TransferLockComponent,
    HomeComponent,
    PerfilComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatTableModule,
    FontAwesomeModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    NgxMaterialTimepickerModule,
    MatMenuModule,
    MatIconModule,
    MatSlideToggleModule,
    AppRoutingModule,
    RouterModule.forRoot([])
  ],
  providers: [DatePipe ],
  bootstrap: [AppComponent]
})
export class AppModule { }

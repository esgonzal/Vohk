import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from "@angular/common/http";
import { DatePipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './sharepage/navbar/navbar.component';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { UserComponent } from './user/user.component';
import { LockComponent } from './lock/lock.component';
import { PasscodeComponent } from './passcode/passcode.component';
import { ICCardComponent } from './iccard/iccard.component';
import { FingerprintComponent } from './fingerprint/fingerprint.component';
import { EkeyComponent } from './ekey/ekey.component';
import { TextTransformPipe } from './ekey/text.pipe';
import { PopUpComponent } from './pop-up/pop-up.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    LockComponent,
    PasscodeComponent,
    ICCardComponent,
    FingerprintComponent,
    EkeyComponent,
    TextTransformPipe,
    PopUpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
    MatGridListModule
    
  ],
  providers: [DatePipe ],
  bootstrap: [AppComponent]
})
export class AppModule { }

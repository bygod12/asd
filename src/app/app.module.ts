import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { QuadroComponent } from './components/dashboard/quadro/quadro.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasComponent } from './components/dashboard/canvas/canvas.component';
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import {AuthService} from "./shared/services/auth.service";
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {AppRoutingModule} from "./app-routing.module";
import {AngularFireModule} from "@angular/fire/compat";
import { ProfileComponent } from './components/profile/profile.component';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {FormsModule} from "@angular/forms";
import { NavComponent } from './components/nav/nav.component';
import { ProfComponent } from './components/prof/prof.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import {MatInputModule} from "@angular/material/input";
import {ModalTextComponent} from "./components/dashboard/canvas/modal-text/modal-text.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import { TableComponent } from './components/table/table.component';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import { QuadroSmallComponent } from './components/dashboard/quadro-small/quadro-small.component';
import { CanvasSmallComponent } from './components/dashboard/canvas-small/canvas-small.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    QuadroComponent,
    ModalTextComponent,
    CanvasComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    NavBarComponent,
    ProfileComponent,
    NavComponent,
    ProfComponent,
    TableComponent,
    QuadroSmallComponent,
    CanvasSmallComponent
  ],
  imports: [
    BrowserModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    AppRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    FormsModule,
    MatGridListModule,
    MatMenuModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule
  ],
  providers: [AuthService],
  exports: [
    CanvasComponent,
    DashboardComponent,
    NavBarComponent,
    TableComponent,
    ProfileComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

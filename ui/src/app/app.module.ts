import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { BlocksComponent } from './blocks/blocks.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DataService } from './data.service';
import { ConnectComponent } from './connect/connect.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BlockDetailsComponent } from './block-details/block-details.component';
import { TimeagoModule } from 'ngx-timeago';
import { NetworkComponent } from './network/network.component';
import { JoinNetworkComponent } from './joinNetwork/joinNetwork.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BlockDetailsComponent,
    BlocksComponent,
    ConnectComponent,
    NetworkComponent,
    JoinNetworkComponent,
  ],
  imports: [
    TimeagoModule.forRoot(),
    NgxChartsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    CdkStepperModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatRadioModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonModule,
    MatGridListModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  entryComponents: [
    ConnectComponent,
    JoinNetworkComponent,
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }

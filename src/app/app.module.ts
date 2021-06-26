import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { SpotifySearchItemComponent } from './components/spotify/spotify-search-item/spotify-search-item.component';
import { DialogTokenDialog, SpotifyComponent } from './components/spotify/spotify.component';
import {MatCardModule} from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    SpotifySearchItemComponent,
    SpotifyComponent,
    DialogTokenDialog
    
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    FlexLayoutModule,
    MatCardModule,
    ToastrModule.forRoot(),
    MatDialogModule,
    MatChipsModule,
    MatSelectModule
    
    
    
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

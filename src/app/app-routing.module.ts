import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpotifyComponent } from './components/spotify/spotify.component';

const routes: Routes = [
  { path: 'spotify',  component: SpotifyComponent },
  { path: '', redirectTo: 'spotify', pathMatch: 'full' },
  { path: '**', redirectTo: 'spotify' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

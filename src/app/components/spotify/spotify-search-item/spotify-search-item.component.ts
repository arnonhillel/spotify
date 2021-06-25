import { Component, Input, OnInit } from '@angular/core';
import { ImageModel } from '../spotify-data-model/data.model';
import { SpotifyComponent } from '../spotify.component';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-spotify-search-item',
  templateUrl: './spotify-search-item.component.html',
  styleUrls: ['./spotify-search-item.component.scss']
})
export class SpotifySearchItemComponent implements OnInit {
  @Input() name: string;
  @Input() type: string;
  @Input() artist: string;
  @Input() artists;
  @Input() release_date: string;
  @Input() track_url:any;
  @Input() images: ImageModel[];
  @Input() imageUrl: string;
  @Input() albomName: string;
  constructor(private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}

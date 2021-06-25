import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageModel, PagesUrls } from './spotify-data-model/data.model';
import { SpotifyService } from './spotify.service';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.scss']
})
export class SpotifyComponent implements OnInit {
  public isTokenValid = false
  public searchResult = [];
  public searchFormGroup: FormGroup
  public searchValue = ''
  public trackUrl = ''
  public pages: PagesUrls = {
    nextPage: undefined,
    prevPage: undefined
  }

  constructor(private fb: FormBuilder, 
    private spotifyService: SpotifyService,
    private sanitizer:DomSanitizer, 
    public dialog: MatDialog) {
    spotifyService.serviceSaerchValue$.subscribe(res => {
      this.searchValue = res;
    });
    spotifyService.serviceSearchResultData$.subscribe(res => {
      this.searchResult = res;
    });
    spotifyService.serviceIsTokenValid$.subscribe(res => {
      this.isTokenValid = res
      if(!this.isTokenValid){
        this.openDialog()
      }
    })
    spotifyService.servicePagesUrls$.subscribe(res => {
      this.pages = res
    })
  }

  ngOnInit(): void {
    this.spotifyService.setToken(!!JSON.parse(localStorage.getItem('spotifyToken')))
    this.searchFormGroup = this.fb.group({
      searchValue: [{
        value: this.searchValue,
        disabled: false
      }, [Validators.required]]
    },

    );
    this.onChanges();
  }


  getImageUrl(images): string {
    if (!!images) {
      return images[0].url
    }
    return ''
  }

  getImages(item) {
    if (!!item) {
      return item
    }
    return []
  }

  getSpotifyUrl(url){
    let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(url);
    return sanitizedUrl
  }

  getArtists(artists) {
    let artistName = ''
    if (!!artists) {
      artists.forEach(element => {
        artistName += `${element.name} `
      });
    }
    return artistName
  }

  onChanges(): void {
    this.searchFormGroup.valueChanges.subscribe(() => {
      this.spotifyService.setSaerchValue(this.searchFormGroup.value['searchValue'])
    });
  }

  search() {
    let url = `https://api.spotify.com/v1/search?query=${this.searchValue}&type=track&offset=0&limit=6`
    this.spotifyService.search(url).subscribe(() => {
    }
    )
  }


  public nextPrevPage(pageUrl) {
    if (!!this.pages[pageUrl]) {
      this.spotifyService.search(this.pages[pageUrl]).subscribe(() => {

      })
    }

  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogTokenDialog, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}



@Component({
  selector: 'dialog-token-dialog',
  templateUrl: './insert-token-dialog.html',
})
export class DialogTokenDialog implements OnInit {
  public tokenFormGroup: FormGroup
  constructor(
    public dialogRef: MatDialogRef<DialogTokenDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder,
    private spotifyService: SpotifyService,) {}

  ngOnInit(): void {
    this.tokenFormGroup = this.fb.group({
      token: [{
        value: '',
        disabled: false
      }, [Validators.required]],
    })

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  addToken() {
    localStorage.setItem('spotifyToken', JSON.stringify(this.tokenFormGroup.value['token']))
    this.spotifyService.setToken(true)
    this.dialogRef.close();
  }

}
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ImageModel, PagesUrls } from './spotify-data-model/data.model';
import { SpotifyService } from './spotify.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  token: string;
}

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.scss']
})
export class SpotifyComponent implements OnInit {
  public selectedYear: number = -1;
  public years: number[] = [];
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
    private sanitizer: DomSanitizer,
    public dialog: MatDialog) {
    spotifyService.serviceSaerchValue$.subscribe(res => {
      this.searchValue = res;
      // this.search() //live
    });
    spotifyService.serviceSearchResultData$.subscribe(res => {
      this.searchResult = res;
    });
    spotifyService.serviceIsTokenValid$.subscribe(res => {
      this.isTokenValid = res
      if (!this.isTokenValid) {
        this.openDialog()
      }
    })
    spotifyService.servicePagesUrls$.subscribe(res => {
      this.pages = res
    })
  }

  ngOnInit(): void {
    let years = new Date().getFullYear();
    for (let year = years; year >= 1900; year--) {
      this.years.push(year);
    }

    this.spotifyService.setToken(!!JSON.parse(localStorage.getItem('spotifyToken')))
    this.searchFormGroup = this.fb.group({
      'searchValue': [null, Validators.compose([Validators.required, Validators.minLength(2)])],}
    );

    this.onChanges();
  }


  public getImageUrl(images): string {
    if (!!images) {
      return images[0].url
    }
    return ''
  }

  public getImages(item) {
    if (!!item) {
      return item
    }
    return []
  }

  public  getSpotifyUrl(url) {
    let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(url);
    return sanitizedUrl
  }

  public getArtists(artists) {
    let artistName = ''
    if (!!artists) {
      artists.forEach(element => {
        artistName += `${element.name} `
      });
    }
    return artistName
  }

  public onChanges(): void {
    this.searchFormGroup.valueChanges.subscribe(() => {
      this.spotifyService.setSaerchValue(this.searchFormGroup.value['searchValue'])
    });
  }

  public search() {
    let queryParams = this.searchValue;
    if(-1 !== this.selectedYear){
      queryParams =`${this.searchValue}%20year:${this.selectedYear}`
    }
    let url = `https://api.spotify.com/v1/search?query=${queryParams}&type=track&offset=0&limit=6`
    this.spotifyService.search(url).subscribe(() => {
    }
    )
  }

  public changeYear(val){
    this.selectedYear = val
    if(!!this.searchValue){
      this.search()
    }
  }


  public nextPrevPage(pageUrl) {
    if (!!this.pages[pageUrl]) {
      this.spotifyService.search(this.pages[pageUrl]).subscribe(() => {

      })
    }

  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogTokenDialog, {
      width: '50%',
      height: 'fit content',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
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
    private spotifyService: SpotifyService,) { }

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
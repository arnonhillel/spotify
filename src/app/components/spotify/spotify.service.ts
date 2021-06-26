import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { spotifyEnvironment } from 'src/environments/spotify.environment';
import { ToastrService } from "ngx-toastr";
import { PagesUrls } from './spotify-data-model/data.model';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  public token = spotifyEnvironment.token
  public serverUrl = 'https://api.spotify.com/v1/search'
  private searchResultData = new BehaviorSubject<any>('');
  serviceSearchResultData$ = this.searchResultData.asObservable();

  private saerchValue = new BehaviorSubject<any>('');
  serviceSaerchValue$ = this.saerchValue.asObservable();

  private pagesUrls = new BehaviorSubject<PagesUrls>({
    nextPage: undefined,
    prevPage: undefined
  });
  servicePagesUrls$ = this.pagesUrls.asObservable();

  private isTokenValid = new Subject<boolean>();
  serviceIsTokenValid$ = this.isTokenValid.asObservable();

  constructor(private http: HttpClient, private toastr: ToastrService) { }



  public setPagesUrls(pages: PagesUrls) {
    this.pagesUrls.next(pages)
  }

  public setToken(flag: boolean) {
    this.isTokenValid.next(flag)
  }

  public setSearchResultData(data) {
    this.searchResultData.next(data)
  }

  public setSaerchValue(value: String) {
    this.saerchValue.next(value)
  }
  //  ------------------------------HTTP-----------------------

  public getAuthorizationDict() {
    const authorizationData = `Bearer ${this.getToken()}`;
    const headerOptions = {
      headers: {
        Authorization: authorizationData,
      },
    };
    return headerOptions;
  }


  public getToken() {
    let token = JSON.parse(localStorage.getItem('spotifyToken'))
    if (!!token) {
      return token
    }
  }

  public search(url: string): Observable<any> {
    const headerOptions = this.getAuthorizationDict();
    return this.http.get(url, headerOptions)
      .pipe(
        map((data) => {
          if (data['tracks'].items) {
            if (data['tracks'].items.length == 0) {
              this.toastr.warning('No results were found')
            }
            this.setSearchResultData(data['tracks'].items)
            let pages = {
              nextPage: data['tracks'].next || undefined,
              prevPage: data['tracks'].previous || undefined
            }
            this.setPagesUrls(pages)
          } else {
            this.setSearchResultData([])
          }
        }),
        catchError(err => {
          let errMsg = this.handleErrors(err)
          this.toastr.error('ERROR', errMsg)
          return `ERROR: ${err}`
        })
      )

  }



  private handleErrors(err) {
    let errMsg = err.error.error.message
    if (err.error.error.status == 401) {
      localStorage.removeItem('spotifyToken')
      this.setToken(false)
    }
    return errMsg
  }


  


}

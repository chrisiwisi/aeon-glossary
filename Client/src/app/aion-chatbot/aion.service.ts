import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AionService {
  private baseUri: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  promptAndAwaitFullThread(prompt: string): Observable<any> {
    const options = {
      params: new HttpParams().set('message', prompt)
    };
    return this.http.get<any>(this.baseUri + '/messages', options);
  }
}

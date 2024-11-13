import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {MessageDTO} from "./MessageDTO";
import {FullThreadDTO} from "./FullThreadDTO";

@Injectable({
  providedIn: 'root'
})
export class AionService {
  private baseUri: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  promptAndAwaitResponse(prompt: string): Observable<FullThreadDTO> {
    const options = {
      params: new HttpParams().set('message', prompt)
    };
    return this.http.get<FullThreadDTO>(this.baseUri + '/messages', options);
  }

  getFullThread(): Observable<FullThreadDTO> {
    return this.http.get<FullThreadDTO>(`${this.baseUri}/threads`);
  }
}

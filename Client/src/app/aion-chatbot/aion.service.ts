import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {MessageDTO} from "./MessageDTO";

@Injectable({
  providedIn: 'root'
})
export class AionService {
  private baseUri: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  promptAndAwaitResponse(prompt: string): Observable<MessageDTO> {
    const options = {
      params: new HttpParams().set('message', prompt)
    };
    return this.http.get<MessageDTO>(this.baseUri + '/messages', options);
  }
}

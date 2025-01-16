import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable, switchMap} from "rxjs";
import {FullThreadDTO} from "./DTOs/FullThreadDTO";

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
    return this.http.get<FullThreadDTO>(this.baseUri + '/threads/' + this.getThreadIdFromLocalStorage() + '/messages', options); //TODO is there a chance threadID is null?
  }

  getFullThread(): Observable<FullThreadDTO> {
    let threadID: string | null = this.getThreadIdFromLocalStorage();
    if (!threadID) {
       return this.http.get<string>(`${this.baseUri}/threads`, { responseType: 'text' as 'json' }).pipe(
         switchMap((newThreadID) => {
           console.log(`a new thread was created`);
           this.setThreadIdToLocalStorage(newThreadID);
           return this.http.get<FullThreadDTO>(`${this.baseUri}/threads/${newThreadID}`);
         })
       );
    } else {
      return this.http.get<FullThreadDTO>(`${this.baseUri}/threads/${threadID}`);
    }
  }

  setThreadIdToLocalStorage(threadId: string): void {
    localStorage.setItem('threadId', threadId);
  }

  getThreadIdFromLocalStorage(): string | null {
    return localStorage.getItem('threadId');
  }
}

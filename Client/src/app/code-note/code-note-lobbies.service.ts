import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CodeNoteLobbiesService {
  public lobbyCodes = signal<string[]>([]);
  private isInitialized = false;

  constructor() {
    this.initializeLobbyCodes();
    this.isInitialized = true;
  }

  private initializeLobbyCodes() {
    const storedLobbyCodes = localStorage.getItem('lobbyCodes');
    if (storedLobbyCodes) {
      this.lobbyCodes.set(JSON.parse(storedLobbyCodes));
    }
  }

  addLobbyCode(lobbyCode: string): void {
    if (this.lobbyCodes().includes(lobbyCode)) {
      return;
    }
    if (!this.isInitialized) {
      this.initializeLobbyCodes();
    }
    const currentLobbyCodes = this.lobbyCodes();
    currentLobbyCodes.push(lobbyCode);
    this.lobbyCodes.set(currentLobbyCodes);
    localStorage.setItem('lobbyCodes', JSON.stringify(currentLobbyCodes));
  }

  public removeLobbyCode(lobbyCode: string): void {
    const currentLobbyCodes = this.lobbyCodes();
    const updatedLobbyCodes = currentLobbyCodes.filter(code => code !== lobbyCode);
    this.lobbyCodes.set(updatedLobbyCodes);
    localStorage.setItem('lobbyCodes', JSON.stringify(updatedLobbyCodes));
  }
}

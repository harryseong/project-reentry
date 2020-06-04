import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getItem(key: string): any {
    return JSON.parse(localStorage.getItem(key));
  }

  setItem(key: string, item: any): void {
    if (localStorage.getItem(key) !== null || localStorage.getItem(key) !== undefined) {
      localStorage.removeItem(key);
    }

    if (typeof item === "string") {
      localStorage.setItem(key, item);
    } else {
      localStorage.setItem(key, JSON.stringify(item))
    }
  }
}

import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  userId: string;

  constructor() {
    this.userId = uuidv4();
  }

  getUserId(): string {
    return this.userId;
  }
}

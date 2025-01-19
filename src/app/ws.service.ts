import { inject, Injectable, Type } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { environment } from '../environments/environment';
import * as WebstompClient from 'webstomp-client';
import { WEBSOCKET, WEBSTOMP } from './app.tokens';

@Injectable({
  providedIn: 'root'
})
export class WsService {
  private readonly WebSocket: Type<WebSocket> = inject(WEBSOCKET);
  private readonly Webstomp: typeof WebstompClient = inject(WEBSTOMP);

  connect<T>(channel: string): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      const connection: WebSocket = new this.WebSocket(`${environment.wsBaseUrl}/ws`);
      const stompClient: WebstompClient.Client = this.Webstomp.over(connection);
      let subscription: WebstompClient.Subscription;

      stompClient.connect(
        { login: '', passcode: '' },
        () => {
          subscription = stompClient.subscribe(channel, message => {
            observer.next(JSON.parse(message.body) as T);
          });
        },
        error => {
          observer.error(error);
        }
      );

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
        connection.close();
      };
    });
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class IBLivePriceService {
  private sockets: Map<string, WebSocketSubject<PriceUpdateMessage>> = new Map<
    string,
    WebSocketSubject<PriceUpdateMessage>
  >();

  private readonly baseUrl: string = 'ws://localhost:8000/prices/ws/stream';

  /**
   * Retrieves an observable stream for a specific stock symbol.
   * Creates a new connection if one does not already exist for that symbol.
   */
  public getPriceStream(symbol: string): Observable<PriceUpdateMessage> {
    if (!this.sockets.has(symbol)) {
      const url = `${this.baseUrl}/${symbol}`;
      const socket = webSocket<PriceUpdateMessage>(url);
      this.sockets.set(symbol, socket);
      console.log(`Establishing new connection for ${symbol} at ${url}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.sockets.get(symbol)!.asObservable();
  }

  /**
   * Closes the connection for a specific symbol.
   */
  public closeConnection(symbol: string): void {
    const socket = this.sockets.get(symbol);
    if (socket) {
      socket.complete(); // Closes the underlying WebSocket
      this.sockets.delete(symbol);
      console.log(`Closed connection for ${symbol}`);
    }
  }

  /**
   * Closes all active connections (useful on application teardown).
   */
  public closeAllConnections(): void {
    this.sockets.forEach((socket) => socket.complete());
    this.sockets.clear();
  }
}

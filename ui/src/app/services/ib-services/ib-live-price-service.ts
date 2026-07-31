import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PriceUpdateMessage } from '../../interfaces/price-update-message-interface';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AppConfigService } from '../app-config/app-config-service';

@Injectable({
  providedIn: 'root',
})
export class IBLivePriceService {
  private config = inject(AppConfigService);

  private sockets: Map<string, WebSocketSubject<PriceUpdateMessage>> = new Map<
    string,
    WebSocketSubject<PriceUpdateMessage>
  >();

  private get baseUrl(): string { return `${this.config.wsBaseUrl}/portfolio/ws/stream`; }

  /**
   * Retrieves an observable stream for a specific stock symbol.
   * Creates a new connection if one does not already exist for that symbol.
   */
  public getPriceStream(portfolio_name: string, asset: string): Observable<PriceUpdateMessage> {
    if (!this.sockets.has(asset)) {
      const url = `${this.baseUrl}/${portfolio_name}/${asset}`;
      const socket = webSocket<PriceUpdateMessage>(url);
      this.sockets.set(asset, socket);
    }

    return this.sockets.get(asset)!.asObservable();
  }

  /**
   * Closes the connection for a specific symbol.
   */
  public closeConnection(symbol: string): void {
    const socket = this.sockets.get(symbol);
    if (socket) {
      socket.complete(); // Closes the underlying WebSocket
      this.sockets.delete(symbol);
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

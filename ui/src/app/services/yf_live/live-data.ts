import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LivePerformanceInterface } from '../../interfaces/live-performance-interface';

@Injectable({
  providedIn: 'root',
})
export class LiveHealthCheck {
  http = inject(HttpClient);
  apiUrl = 'http://localhost:8000/yf_live';

  checkYFssLive(): Observable<any> {
    const apiMethod = 'health_check';

    return this.http.get<any>(`${this.apiUrl}/${apiMethod}`);
  }
}

@Injectable({
  providedIn: 'root',
})
export class LivePerformanceDataService {
  apiUrl = 'http://localhost:8000/yf_live';

  getStream(url: string): Observable<LivePerformanceInterface> {
    return new Observable((observer) => {
      const controller = new AbortController();

      fetch(url, {
        method: 'POST', // <-- METHOD changed to POST
        headers: {
          'Content-Type': 'application/json', // <-- Required header
        },
        body: JSON.stringify({
          symbols: ['AAPL', 'GOOG', 'TSLA', 'MSFT', 'META', 'NVDA', 'AMZN'],
        }), // <-- BODY added
        signal: controller.signal,
      }).then(async (response) => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let partialChunk = '';

        if (!reader) return;

        try {
          while (true) {
            const { done, value } = await reader.read();

            // 1. Process the current chunk if it exists
            if (value) {
              const chunk = decoder.decode(value, { stream: true });
              const lines = (partialChunk + chunk).split(/\r?\n/);

              const combined = partialChunk + chunk;

              console.log(
                `[Stream Debug] Buffer Size: ${combined.length} bytes | New Lines Found: ${lines.length - 1}`,
              );
              console.log(
                `Chunks: ${lines.length}. Remaining buffer size: ${partialChunk.length}`,
              );

              // The last element of .split is always the "incomplete" part
              // (or an empty string if it ended perfectly with \n)
              partialChunk = lines.pop() ?? '';

              for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed) {
                  try {
                    observer.next(JSON.parse(trimmed));
                  } catch (e) {
                    console.error('JSON Parse Error on line:', trimmed);
                  }
                }
              }
            }

            // 2. Check if stream is finished
            if (done) {
              // Process the very last fragment if it didn't end in \n
              if (partialChunk.trim()) {
                try {
                  observer.next(JSON.parse(partialChunk));
                } catch (e) {
                  console.error('Final fragment parse error:', partialChunk);
                }
              }
              break;
            }
          }
          observer.complete();
        } catch (err) {
          observer.error(err);
        }
        return () => controller.abort(); // Cleanup on unsubscribe
      });
    });
  }
}

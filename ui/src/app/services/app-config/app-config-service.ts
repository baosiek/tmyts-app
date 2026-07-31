import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

// Populated from public/config.json (dev default) or, in the Docker image,
// generated at container start-up from environment variables injected by
// Kubernetes - see docker-entrypoint.sh. This lets one built image be
// promoted across environments instead of baking API URLs in at build time.
export interface AppConfig {
  apiBaseUrl: string;
  wsBaseUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private http = inject(HttpClient);

  private config?: AppConfig;

  async load(): Promise<void> {
    this.config = await firstValueFrom(this.http.get<AppConfig>('/config.json'));
  }

  get apiBaseUrl(): string {
    return this.getConfig().apiBaseUrl;
  }

  get wsBaseUrl(): string {
    return this.getConfig().wsBaseUrl;
  }

  private getConfig(): AppConfig {
    if (!this.config) {
      throw new Error('AppConfigService.load() must resolve before config is read');
    }
    return this.config;
  }
}

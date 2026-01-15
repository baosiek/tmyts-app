import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIcon } from "@angular/material/icon";
import { timer } from 'rxjs/internal/observable/timer';
import { LiveHealthCheck } from '../../../services/ms-health-check/live-health-check';

@Component({
  selector: 'app-online-signal',
  imports: [MatIcon, CommonModule],
  templateUrl: './online-signal.html',
  styleUrl: './online-signal.scss'
})
export class OnlineSignal implements OnInit{

  live_service = inject(LiveHealthCheck)
  private destroyRef = inject(DestroyRef); 
  isHealthy: boolean = false

  ngOnInit(): void {
    // Start polling immediately, then every 10 seconds (10000ms)
    timer(0, 10000)
      .pipe(
        // Automatically unsubscribes when this service is destroyed
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.checkHealth();
      });
  }

  checkHealth() {
    this.live_service.checkYFssLive().subscribe(
      {
        next: (response: any) => {
          const statusCode = response['status_code'];
          if (statusCode === 200) {
            this.isHealthy = true
          } else {
            this.isHealthy = false
          }
        },
        error: (error) => {
          this.isHealthy = false
        },
        complete: () => {}
      }
    )
  }
}

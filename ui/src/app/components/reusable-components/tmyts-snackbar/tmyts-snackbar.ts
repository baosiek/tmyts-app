import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tmyts-snackbar',
  imports: [],
  templateUrl: './tmyts-snackbar.html',
  styleUrl: './tmyts-snackbar.scss'
})
export class TmytsSnackbar {

  constructor(
    public snackBarRef: MatSnackBarRef<TmytsSnackbar>,
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string, action: string }
  ){}

}

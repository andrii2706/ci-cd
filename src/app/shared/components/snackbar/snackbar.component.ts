import { Component, Inject, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../../app-material/app-material.module';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [AppMaterialModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent implements OnInit {
  public dataSnackbar: string;

  constructor(
    public matSnackBarRef: MatSnackBarRef<SnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: { text: string; status: string },
  ) {}

  ngOnInit(): void {
    this.matSnackBarRef._open();
    this.dataSnackbar = this.data.text;
  }
}

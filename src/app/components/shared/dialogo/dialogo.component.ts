import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dialogo } from 'src/app/model/dialogo.model';

@Component({
  selector: 'sag-dialogo',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.scss']
})
export class DialogoComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<DialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Dialogo) { }

  ngOnInit() {
  }

  onClose(){
    this.dialogRef.close();
  }

}

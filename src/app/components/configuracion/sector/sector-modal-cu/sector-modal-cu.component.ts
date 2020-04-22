import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SectorData, SectorModal } from 'src/app/model/sector.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SectorService } from 'src/app/services/sector.service';

@Component({
  selector: 'sag-sector-modal-cu',
  templateUrl: './sector-modal-cu.component.html',
  styleUrls: ['./sector-modal-cu.component.scss']
})
export class SectorModalCuComponent implements OnInit {

  tituloModal: string;
  descripcion: any;


  constructor(public dialogRef: MatDialogRef<SectorModalCuComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: SectorModal, 
    private sectorService: SectorService) { }

  formSector = new FormGroup({
    'descripcion': new FormControl('', [Validators.required])
  });


  getErrorMessage() {
    return this.formSector['descripcion'].hasError('required') ? 'ingrese un sector' : '' ;
  }

  ngOnInit() {
    this.tituloModal = this.data.titulo;
    
    if (this.data.operacion === 2) {
      this.formSector.setValue({ 'descripcion': this.data.payload.descripcion });
    }
  }

  
  onCancel(): void {
    this.dialogRef.close(undefined);
  }

  onSubmit() {

    if (this.formSector.valid) {
      if (this.data.operacion === 1) {
        
        this.sectorService.createSector(
          this.formSector.value['descripcion']
        ).subscribe((dialog) => {          
          this.formSector.reset();
          this.dialogRef.close(dialog);
        });        
      }

      if (this.data.operacion === 2) {

        let sector: SectorData = {
          id: this.data.payload.id,
          activo: this.data.payload.activo,
          descripcion: this.formSector.value['descripcion']
        }

        this.sectorService.updateSector(sector).subscribe((dialog) => {
          this.dialogRef.close(dialog);
        });
      }


    }
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Provincia } from 'src/app/model/provincia.model';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ProvinciaService } from 'src/app/services/provincia.service';
import { LocalidadService } from 'src/app/services/localidad.service';
import { Localidad } from 'src/app/model/localidad.model';
import { ProveedorData } from 'src/app/model/proveedor.model';
import { RubroProveedorService } from 'src/app/services/rubroProveedor.service';
import { RubroProveedorData } from 'src/app/model/rubroProveedor.model';
import { validaCuit } from 'src/app/miscelaneos/validaCuit';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { map, filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'sag-proveedor-abm',
  templateUrl: './proveedor-abm.component.html',
  styleUrls: ['./proveedor-abm.component.scss']
})
export class ProveedorAbmComponent implements OnInit {
  provincias$: Observable<Provincia[]>
  localidades: Localidad[] = [];
  rubroProveedores$: Observable<RubroProveedorData[]>;
  titulo$: Observable<string>;
  operacion: number;

  proveedorForm = this._formBuilder.group({
    id: [''],
    razonSocial: ['', Validators.required],
    cuit: ['', [validaCuit]],
    rubroProveedorId: [''],
    rubroProveedor: ['', Validators.required],
    provinciaId: [''],
    provincia: ['', Validators.required],
    localidadId: [''],
    localidad: ['', Validators.required],
    telefono: [''],
    web: [''],
    email: ['', Validators.email],
    calle: [''],
    numero: [''],
    activo: [''],
    oficina: [''],
    codigoPostal: [''],
    piso: [''],
  });

  constructor(private _formBuilder: FormBuilder,
    private proveedorService: ProveedorService,
    private provinciaService: ProvinciaService,
    private localidadService: LocalidadService,
    private rubroProveedorService: RubroProveedorService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.provincias$ = this.provinciaService.fetchProvincias();
    this.rubroProveedores$ = this.rubroProveedorService.fetchRubroProveedores();


    this.titulo$ = this.route.data.pipe(
      map(res => {
        return res.titulo
      })
    );

    this.route.data.subscribe(res => {
      this.operacion = res.operacion
    });



    this.route.paramMap
      .pipe(
        filter((params: ParamMap) => params.get('id') !== null),
        switchMap((params: ParamMap) => this.proveedorService.getProveedorById(+params.get('id'))),
        map(proveedor => {
          this.proveedorForm.setValue({ ...proveedor });
          this.proveedorForm.get('rubroProveedor').setValue(proveedor.rubroProveedorId);
          this.proveedorForm.get('provincia').setValue(proveedor.provinciaId);
          this.proveedorForm.get('localidad').setValue(proveedor.localidadId);
          return proveedor;
        }),
        switchMap(proveedor => this.localidadService.fetchLocalidades(proveedor.provinciaId))
      ).subscribe(localidades => {
        this.localidades = localidades
      });
  }



  onSubmit() {

    if (this.proveedorForm.valid) {
      let proveedorData: ProveedorData = this.proveedorForm.value;

      proveedorData.rubroProveedorId = this.proveedorForm.get('rubroProveedor').value;
      proveedorData.provinciaId = this.proveedorForm.get('provincia').value;
      proveedorData.localidadId = this.proveedorForm.get('localidad').value;
      proveedorData.rubroProveedor = '';
      proveedorData.provincia = '';
      proveedorData.localidad = '';

      if (this.operacion === 1) {
        this.proveedorService.createProveedor(proveedorData).subscribe(() => {
          
          this.router.navigate(['/proveedor']);

        })
      }
      if (this.operacion === 2) {
        this.proveedorService.EditProveedor(proveedorData).subscribe(() => {
          proveedorData.rubroProveedorId = this.proveedorForm.get('rubroProveedor').value;
          proveedorData.provinciaId = this.proveedorForm.get('provincia').value;
          proveedorData.localidadId = this.proveedorForm.get('localidad').value;
          this.router.navigate(['/proveedor']);

        })
      }


    }

  }

  getLocalidades(event) {
    if (event.value) {
      this.localidadService.fetchLocalidades(event.value).subscribe(response => {
        this.localidades = response;
      });
    }
  }

}


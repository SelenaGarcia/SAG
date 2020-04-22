import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Provincia } from 'src/app/model/provincia.model';
import { Localidad } from 'src/app/model/localidad.model';
import { AgenteService } from 'src/app/services/agente.service';
import { ProvinciaService } from 'src/app/services/provincia.service';
import { LocalidadService } from 'src/app/services/localidad.service';
import { SectorData } from 'src/app/model/sector.model';
import { SectorService } from 'src/app/services/sector.service';
import { FuncionService } from 'src/app/services/funcion.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { CategoriaData } from 'src/app/model/categoria.model';
import { FuncionData } from 'src/app/model/funcion.model';
import { AgenteData } from 'src/app/model/agente.model';
import { EstadocivilService } from 'src/app/services/estadocivil.service';
import { SexoService } from 'src/app/services/sexo.service';
import { Sexo } from 'src/app/model/sexo.model';
import { EstadoCivil } from 'src/app/model/estadoCivil.model';
import { TituloService } from 'src/app/services/titulo.service';
import { Titulo } from 'src/app/model/titulo.model';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { map, filter, switchMap } from 'rxjs/operators';


@Component({
  selector: 'sag-agente-abm',
  templateUrl: './agente-abm.component.html',
  styleUrls: ['./agente-abm.component.scss']
})
export class AgenteAbmComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;  
  provincias$: Observable<Provincia[]>
  localidades: Localidad[] = [];  
  sectores$: Observable<SectorData[]>
  funciones$: Observable<FuncionData[]>
  categorias$: Observable<CategoriaData[]>
  sexos$: Observable<Sexo[]>
  estadoCivil$: Observable<EstadoCivil[]>
  titulo$: Observable<Titulo[]>
  operacion: number;




  agenteForm = this._formBuilder.group({
    firstFormGroup: this._formBuilder.group({
      apellidoCtrl: ['', Validators.required],
      nombreCtrl: ['', Validators.required],
      cuilCtrl: [''],
      dniCtrl: [''],
      telefonoCtrl: [''],
      numeroIpss: [''],
      fechaNacimiento: [''],
      legajo: [''],
      matricula: [''],
      estCivilSelect: [''],
      sectorSelect: [''],
      funcionSelect: [''],
      correoElectronicoCtrl: ['', Validators.email],
      sexoSelect: [''],
      categoriaSelect: [''],
      tituloSelect: [''],
      fechaIngreso: [''],
    }),
    secondFormGroup: this._formBuilder.group({
      calle: [''],
      numero: [''],
      piso: [''],
      dpto: [''],      
      provinciaCtrl: [''],  
      departamentoCtrl  : [''],  
      codigopostal: [''],  
    })
  });



  constructor(private _formBuilder: FormBuilder,
    private agenteService: AgenteService,
    private provinciaService: ProvinciaService,
    private localidadService: LocalidadService, 
    private sectorService: SectorService,
    private funcionService: FuncionService,
    private categoriaService: CategoriaService,
    private estadoCivilService: EstadocivilService,
    private sexoService: SexoService,
    private tituloService: TituloService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {   
    this.provincias$ = this.provinciaService.fetchProvincias(); 
    this.sectores$= this.sectorService.getAllSectores(true);
    this.funciones$ = this.funcionService.getFunciones(true);
    this.categorias$ = this.categoriaService.getCategorias(true);
    this.sexos$ = this.sexoService.fetchSexo(true);
    this.estadoCivil$ = this.estadoCivilService.getAllEstadoCivil(true);
    this.titulo$ = this.tituloService.fetchTitulo(true);

    //this.titulo$ = this.route.data.pipe(
     // map(res => {
      //  return res.titulo
     // })
    //);

    this.route.data.subscribe(res => {
      this.operacion = res.operacion
    });

    this.route.paramMap
      .pipe(
        filter((params: ParamMap) => params.get('id') !== null),
        switchMap((params: ParamMap) => this.agenteService.getAgenteById(+params.get('id'))),
        map(agente => {
          this.agenteForm.setValue({ ...agente });          
          this.agenteForm.get('provincia').setValue(agente.provinciaId);
          this.agenteForm.get('localidad').setValue(agente.localidadId);
          this.agenteForm.get('estadoCivilId').setValue(agente.estadoCivilId);
          this.agenteForm.get('tituloId').setValue(agente.tituloId);
          return agente;
        }),
        switchMap(agente => this.localidadService.fetchLocalidades(agente.provinciaId))
      ).subscribe(localidades => {
        this.localidades = localidades
      });

  }
  
  onSubmit() { 
  //  if(this.agenteForm.valid){
      let formValues = this.agenteForm.value;


      let agenteData: AgenteData = {
        
        apellido: formValues['firstFormGroup'].apellidoCtrl,
        nombre: formValues['firstFormGroup'].nombreCtrl,
        dni : formValues['firstFormGroup'].dniCtrl,
        cuil: formValues['firstFormGroup'].cuilCtrl,
        telefono: formValues['firstFormGroup'].telefonoCtrl,
        correoElectronico: formValues['firstFormGroup'].correoElectronicoCtrl,
        numeroIpss: formValues['firstFormGroup'].numeroIpss,
        fechaNacimiento: formValues['firstFormGroup'].fechaNacimiento,
        legajo: formValues['firstFormGroup'].legajo,
        matricula: formValues['firstFormGroup'].matricula,
        sexo: formValues['firstFormGroup'].sexoSelect,
        estadoCivil: formValues['firstFormGroup'].estCivilSelect,
        sector: formValues['firstFormGroup'].sectorSelect,
        sectorId: +formValues['firstFormGroup'].sectorSelect,
        funcion:  formValues['firstFormGroup'].funcionSelect,
        categoriaId:  +formValues['firstFormGroup'].categoriaSelect,
        categoria: formValues['firstFormGroup'].categoriaSelect,        
        tituloId: formValues['firstFormGroup'].tituloSelect,
        fechaIngreso: formValues['firstFormGroup'].fechaIngreso,
        provinciaId: formValues['secondFormGroup'].provinciaCtrl,
        localidadId: formValues['secondFormGroup'].departamentoCtrl,
        funcionId: +formValues['firstFormGroup'].funcionSelect,
        localidad: formValues['secondFormGroup'].localidad,
        provincia: formValues['secondFormGroup'].provincia,
        sexoId: +formValues['firstFormGroup'].sexoSelect,
        estadoCivilId: +formValues['firstFormGroup'].estCivilSelect,
        calle: formValues['secondFormGroup'].calle,
        numero: +formValues['secondFormGroup'].numero,
        piso: formValues['secondFormGroup'].piso,
        dpto: formValues['secondFormGroup'].dpto,
        codigoPostal: formValues['secondFormGroup'].codigopostal,    
        activo: true,
      };

      console.log(agenteData);

      this.agenteService.onCreateAgente(agenteData).subscribe();
 //   }    

  }
  getLocalidades(event){
  
    if(event.value){
      this.localidadService.fetchLocalidades(event.value).subscribe(response=>{
        
        this.localidades = response;

      });
    }
  }
}

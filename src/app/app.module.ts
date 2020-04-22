
// modulos
import { MaterialModule } from './modules/material.module';
import { NgFallimgModule } from 'ng-fallimg';


// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


// routing
import { AppRoutingModule } from './app-routing.module';


// components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AgenteComponent } from './components/agente/agente.component';
import { InformeComponent } from './components/informe/informe.component';
import { SolCompraComponent } from './components/sol-compra/sol-compra.component';
import { OrdenPagoComponent } from './components/orden-pago/orden-pago.component';
import { DialogoDeleteComponent } from './components/shared/dialogo-delete/dialogo-delete.component';
import { AuthComponent } from './components/auth/auth.component';
import { CustomSnackBarComponent } from './components/shared/custom-snack-bar/custom-snack-bar.component';
import { DialogoComponent } from './components/shared/dialogo/dialogo.component';
import { CategoriaComponent } from './components/configuracion/categoria/categoria.component';
import { CuentaComponent } from './components/configuracion/cuenta/cuenta.component';
import { FuncionComponent } from './components/configuracion/funcion/funcion.component';
import { ProductoComponent } from './components/configuracion/producto/producto.component';
import { DatosColegioEscribanoComponent } from './components/configuracion/datos-colegio-escribano/datos-colegio-escribano.component';
import { RubroProductoComponent } from './components/configuracion/rubro-producto/rubro-producto.component';
import { RubroProveedorComponent } from './components/configuracion/rubro-proveedor/rubro-proveedor.component';
import { SectorComponent } from './components/configuracion/sector/sector.component';
import { SeguridadComponent } from './components/configuracion/seguridad/seguridad.component';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';
import { ProveedorComponent } from './components/configuracion/proveedor/proveedor.component';
import { ProveedorAbmComponent } from './components/configuracion/proveedor/proveedor-abm/proveedor-abm.component';
import { AgenteAbmComponent } from './components/agente/agente-abm/agente-abm.component';
import { ProductoCuComponent } from './components/configuracion/producto/producto-cu/producto-cu.component';
import { CategoriaCuComponent } from './components/configuracion/categoria/categoria-cu/categoria-cu.component';
import { FuncionCuComponent } from './components/configuracion/funcion/funcion-cu/funcion-cu.component';
import { RubroProveedorModalCuComponent } from './components/configuracion/rubro-proveedor/rubro-proveedor-modal-cu/rubro-proveedor-modal-cu.component';
import { SectorModalCuComponent } from './components/configuracion/sector/sector-modal-cu/sector-modal-cu.component';
import { CuentaCuComponent } from './components/configuracion/cuenta/cuenta-cu/cuenta-cu.component';
import { RubroProductoModalCuComponent } from './components/configuracion/rubro-producto/rubro-producto-modal-cu/rubro-producto-modal-cu.component';
import { SolCompraCuComponent } from './components/sol-compra/sol-compra-cu/sol-compra-cu.component';
import { PresupuestoComponent } from './components/presupuesto/presupuesto.component';
import { PresupuestoAbmComponent } from './components/presupuesto/presupuesto-abm/presupuesto-abm.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    PageNotFoundComponent,
    AgenteComponent,
    InformeComponent,
    SolCompraComponent,
    OrdenPagoComponent,
    DialogoComponent,   
    DialogoDeleteComponent, 
    AuthComponent, 
    CategoriaComponent,
    CuentaComponent,
    FuncionComponent,
    ProductoComponent,
    DatosColegioEscribanoComponent,
    RubroProductoComponent,
    RubroProveedorComponent,
    SectorComponent,
    SeguridadComponent,
    SpinnerComponent,
    CustomSnackBarComponent,
    ProveedorComponent,
    ProveedorAbmComponent,
    ProductoCuComponent,
    CategoriaCuComponent,
    FuncionCuComponent,
    RubroProveedorModalCuComponent,
    SectorModalCuComponent,
    AgenteAbmComponent,
    CuentaCuComponent,
    RubroProductoModalCuComponent,
    SolCompraCuComponent,
    PresupuestoComponent,
    PresupuestoAbmComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
      NgFallimgModule.forRoot({
      default: '/assets/img/sagb.png'
    }),
     
  ],
  providers: [],
  entryComponents: [   
    DialogoComponent, 
    DialogoDeleteComponent,    
    CustomSnackBarComponent, 
    ProductoCuComponent,
    CategoriaCuComponent,
    FuncionCuComponent,
    RubroProveedorModalCuComponent,
    SectorModalCuComponent, 
    CuentaCuComponent,  
    RubroProductoModalCuComponent,
    
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

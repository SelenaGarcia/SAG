import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgenteComponent } from './components/agente/agente.component';
import { SolCompraComponent } from './components/sol-compra/sol-compra.component';
import { OrdenPagoComponent } from './components/orden-pago/orden-pago.component';
import { PresupuestoComponent } from './components/presupuesto/presupuesto.component';
import { InformeComponent } from './components/informe/informe.component';
import { CategoriaComponent } from './components/configuracion/categoria/categoria.component';
import { CuentaComponent } from './components/configuracion/cuenta/cuenta.component';
import { DatosColegioEscribanoComponent } from './components/configuracion/datos-colegio-escribano/datos-colegio-escribano.component';
import { SectorComponent } from './components/configuracion/sector/sector.component';
import { FuncionComponent } from './components/configuracion/funcion/funcion.component';
import { RubroProductoComponent } from './components/configuracion/rubro-producto/rubro-producto.component';
import { RubroProveedorComponent } from './components/configuracion/rubro-proveedor/rubro-proveedor.component';
import { SeguridadComponent } from './components/configuracion/seguridad/seguridad.component';
import { ProductoComponent } from './components/configuracion/producto/producto.component';
import { ProveedorComponent } from './components/configuracion/proveedor/proveedor.component';
import { AgenteAbmComponent } from './components/agente/agente-abm/agente-abm.component';
import { ProveedorAbmComponent } from './components/configuracion/proveedor/proveedor-abm/proveedor-abm.component';
import { PresupuestoAbmComponent } from './components/presupuesto/presupuesto-abm/presupuesto-abm.component';
import { SolCompraCuComponent } from './components/sol-compra/sol-compra-cu/sol-compra-cu.component';

const routes: Routes = [
  /*rutas principales*/
  { path: '', component: SolCompraComponent },
  { path: 'agente', component: AgenteComponent },
  { path: 'sol-compra', component: SolCompraComponent },
  { path: 'orden-pago', component: OrdenPagoComponent },
  { path: 'informe', component: InformeComponent },
  { path: 'categoria', component: CategoriaComponent },
  { path: 'cuenta', component: CuentaComponent },
  { path: 'datos-colegio-escribano', component: DatosColegioEscribanoComponent },
  { path: 'sector', component: SectorComponent },
  { path: 'producto', component: ProductoComponent },
  { path: 'funcion', component: FuncionComponent },
  { path: 'rubro-producto', component: RubroProductoComponent },
  { path: 'rubro-proveedor', component: RubroProveedorComponent },
  { path: 'sol-compra/presupuesto', component: PresupuestoComponent },
  { path: 'sol-compra/nuevo-presupuesto', component: PresupuestoAbmComponent,data: { titulo: 'Nuevo Presupuesto', operacion: 1 }},
 //{ path: 'presupuesto/modificar-presupuesto/:id', component: PresupuestoAbmComponent, data: { titulo: 'Modificar Presupuesto', operacion: 2 } },

  { path: 'proveedor', component: ProveedorComponent },
  { path: 'proveedor/nuevo-proveedor', component: ProveedorAbmComponent,data: { titulo: 'Nuevo Proveedor', operacion: 1 }},
  { path: 'proveedor/modificar-proveedor/:id', component: ProveedorAbmComponent, data: { titulo: 'Modificar Proveedor', operacion: 2 } },
  

  { path: 'seguridad', component: SeguridadComponent },

  { path: 'agente/agenteabm', component: AgenteAbmComponent },
  { path: 'agente/modificar-agente/:id', component: AgenteAbmComponent, data: { titulo: 'Modificar Agente', operacion: 2 } },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },

  /*rutas internas*/
  { path: 'agenteabm', component: AgenteAbmComponent },
  { path: 'sol-compra/nueva-solicitud/:id', component: SolCompraCuComponent },

];

@NgModule({
  imports: [    
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
}



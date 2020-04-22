import { NgModule } from '@angular/core';


import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatMenuModule} from '@angular/material/menu';



@NgModule({
    imports: [
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatSelectModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatStepperModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMenuModule,
         
    ],
    exports: [
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatSelectModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatStepperModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMenuModule,
     
    ],
    declarations: [],
    providers: [
        {provide: 
            MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 5000}},
            {provide: MAT_DATE_LOCALE, useValue: 'es'},
    ]
})
export class MaterialModule {}
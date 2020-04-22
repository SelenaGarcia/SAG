import { FormControl } from '@angular/forms';

export function validaCuit(control:FormControl): {[key:string]: boolean} {
    let cuit = control.value.toString().replace(/[-_]/g, "");
    if (control.dirty && control.value !== ''){
        var calculado = calcularDigitoCuil(cuit);
        var digito = parseInt(cuit[10]);
        var resultado = calculado == digito;

        return resultado ? null : {'cuitInvalido': true} ;
    }        
}

function calcularDigitoCuil(cuit) {    
    const mult = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let total = 0;
    for (var i = 0; i < mult.length; i++) {
        total += parseInt(cuit[i]) * mult[i];
    }
    var mod = total % 11;
    return mod == 0 ? 0 : mod == 1 ? 9 : 11 - mod;
}
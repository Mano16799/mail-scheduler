import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms"

var password:string

export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        password = control.value
        return null
    }
}

export function confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if(control.value===password){
            return null
        }
        return{invalidPassword:{value:control.value}}
    }
}
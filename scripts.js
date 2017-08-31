let error         = document.createElement('div');
    error.classList.add('error__contain')
let agregarButton = document.querySelector('#agregarMateria');

class Lista {
    constructor(listaID){
        this.lista = document.querySelector(`#${listaID}`);
        this.totales = document.querySelector('#unidadesTotales');
        this.materias = [];
        this.unidades = [];
        this.notas    = [];

        this.lista.addEventListener('change', (e) => {
            let elementoEvento = e.target;
            let trElemento     = elementoEvento.parentElement.parentElement;
            let elementoIndex  = trElemento.rowIndex - 1;

            if(elementoEvento.classList.contains('materiaClass')) {
                if(  elementoEvento.checkValidity() === false  ) {
                    showError('Escriba el nombre de la materia');
                } 
                this.validarValor(this.materias, elementoEvento.value, elementoIndex);
                
            } else if(  elementoEvento.classList.contains('unidadesClass')  ){
                if(elementoEvento.validity.rangeOverflow || elementoEvento.validity.rangeUnderflow) {
                    showError('Escriba la cantidad de unidades en el rango 1 - 4');
                    elementoEvento.value = "";
                } 
                this.validarValor(this.unidades, elementoEvento.value, elementoIndex, 1);

            } else if(  elementoEvento.classList.contains('notaClass')  ) {
                if(elementoEvento.validity.rangeOverflow || elementoEvento.validity.rangeUnderflow) {
                    showError('Escriba una nota en el rango 1 - 9');
                    elementoEvento.value = "";
                } 
                this.validarValor(this.notas, elementoEvento.value, elementoIndex, 1);
            }
            let validarCompletos = [...elementoEvento.parentElement.parentElement.children];

            if(validarCompletos[0].firstElementChild.value !== "" &&
                validarCompletos[1].firstElementChild.value !== "" &&
                validarCompletos[2].firstElementChild.value !== "") {
                 this.calcular();
            }
        });

        this.lista.addEventListener('click', e => {
            let botonInterno = e.target;
            let trElemento     = botonInterno.parentElement.parentElement;
            let elementoIndex  = trElemento.rowIndex - 1;

            if(botonInterno.classList.contains('inner-button')) {
                trElemento.remove();
                this.materias[elementoIndex] = "";
                this.unidades[elementoIndex] = "";
                this.notas[elementoIndex] = "";
                this.calcular();
            }
        });
    }

    validarValor(array, valor, indice, number = 0){
        if(valor === "") {
            array[indice] = "";
            console.log(array.filter( e => e != ""));
        } else {
            if(number != 0) array[indice] = parseInt(valor);
            else array[indice] = valor;
        }
    }

    agregarMateria(materia, unidades, nota) {
        let componente = document.createElement('tr');
        componente.classList.add('lista__row');
        componente.innerHTML = `
            <td class="lista__comp">
                <input type="text" placeholder="${materia}" class="inner-input materiaClass" required>
            </td>
            <td class="lista__comp">
                <input type="number" class="inner-input unidadesClass" min="1" max="4" required>
            </td>
            <td class="lista__comp">
                <input type="number" class="inner-input notaClass" min="1" max="9" required>
            </td>
            <td class="lista__comp">
                <button class="inner-button" id="removeButton">X</button>
            </td>
        `;
        this.lista.appendChild(componente);
    }

    calcular(){
        if(this.materias[0] != null) {
            let unidadesTotales = this.unidades.reduce( (a,b) => a + b);
            let notasCalculo    = this.notas.map( (a,i) => {
                return a * this.unidades[i];
            });

            notasCalculo = notasCalculo.reduce( (a,b) => a + b );
            let val = (notasCalculo / unidadesTotales).toFixed(2);
            console.log(val);
            if(isNaN(val)) {
                this.totales.innerHTML = "";
            } else {
                this.totales.innerHTML = `${val}`;
            }
        }
    }
}

let miLista = new Lista('lista');

agregarButton.addEventListener('click', () => {
    miLista.agregarMateria('Nombre', 'Unidades', 'Nota');
});


function showError(errorMessage) {
    error.innerHTML = `
        <button class="error__button"> x </button>
        <p class="error__message"> ${errorMessage} </p>
    `;
    document.body.appendChild(error);
    let exitButton = document.querySelector('.error__button');
    exitButton.addEventListener('click', () => document.body.removeChild(error));
    
}

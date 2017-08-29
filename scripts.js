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
            if(elementoEvento.classList.contains('materiaClass')) {
                if(elementoEvento.checkValidity() === false) {
                    showError('Escriba el nombre de la materia');
                    elementoEvento.value = "";
                    return false;
                }
                this.materias.push(elementoEvento.value);
            } else if(elementoEvento.classList.contains('unidadesClass')){
                if(elementoEvento.validity.rangeOverflow || elementoEvento.validity.rangeUnderflow) {
                    showError('Escriba la cantidad de unidades en el rango 1 - 4');
                    elementoEvento.value = "";
                    return false;
                }
                this.unidades.push(parseInt(elementoEvento.value));
            } else if(elementoEvento.classList.contains('notaClass')) {
                if(elementoEvento.validity.rangeOverflow || elementoEvento.validity.rangeUnderflow) {
                    showError('Escriba una nota en el rango 1 - 9');
                    elementoEvento.value = "";
                    return false;
                }
                this.notas.push(parseInt(elementoEvento.value));
            }
            let validarCompletos = [...elementoEvento.parentElement.parentElement.children];
            //console.dir(validarCompletos[0].firstElementChild.value);

            if(validarCompletos[0].firstElementChild.value !== "" &&
               validarCompletos[1].firstElementChild.value !== "" &&
               validarCompletos[2].firstElementChild.value !== "") {
                this.calcular();
            }
        });
    }

    agregarMateria(materia, unidades, nota) {
        let componente = document.createElement('tr');
        componente.innerHTML = `
            <td class="lista__comp">
                <input type="text" placeholder="${materia}" class="inner-input materiaClass" required>
            </td>
            <td class="lista__comp">
                <input type="number" placeholder="${unidades}" class="inner-input unidadesClass" min="1" max="4" required>
            </td>
            <td class="lista__comp">
                <input type="number" placeholder="${nota}" class="inner-input notaClass" min="1" max="9" required>
            </td>
        `;
        this.lista
            .firstElementChild.insertBefore(
                componente, 
                this.lista.firstElementChild.lastElementChild);
    }

    calcular(){
        if(this.materias[0] != null) {
            let unidadesTotales = this.unidades.reduce( (a,b) => a + b);
            let notasCalculo    = this.notas.map( (a,i) => {
                return a * this.unidades[i];
            });

            notasCalculo = notasCalculo.reduce( (a,b) => a + b );
            this.totales.innerHTML = `${(notasCalculo / unidadesTotales).toFixed(2)}`;
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

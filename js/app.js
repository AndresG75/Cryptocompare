const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const moneda = document.querySelector('#moneda');
const criptomoneda = document.querySelector('#criptomonedas');

const obtenerCriptoMonedas = (criptos)=> new Promise(resolve => {
    resolve(criptos);
});

const MonedaObj = {
    moneda : '',
    criptomoneda : ''
}



window.onload = ()=>{
    formulario.addEventListener('submit',validarFormulario);
    cargarCriptoMonedas();
    moneda.addEventListener('change',cargarObjeto);
    criptomoneda.addEventListener('change',cargarObjeto);
}

function cargarCriptoMonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(resultado => resultado.json())
        .then(data => obtenerCriptoMonedas(data.Data))
        .then(selecciones => cargarSelect(selecciones))
        .catch(error=> console.log(error))
}

function cargarSelect(criptos){
    console.log(criptos);

    criptos.forEach(cripto => {
        const {Name, FullName} = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;

        criptomoneda.appendChild(option);
        
    });
}

function validarFormulario(e){
    e.preventDefault();

    if (criptomoneda.value === '' || moneda.value === '') {
        mostrarAlerta('Rellena todos los campos');
        return
    }
    Spinner();


    consultarAPI();
}

function consultarAPI(){
    const {moneda,criptomoneda} = MonedaObj;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    fetch(url)
    .then(respuesta=>respuesta.json())
    .then(cotizacion=>{
        mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda]);
    })    
}

function cargarObjeto(e){
    MonedaObj[e.target.name] = e.target.value;
}

function mostrarAlerta(mensaje){

    const alerta = document.querySelector('.error');

    if (!alerta) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
    
        divMensaje.textContent = mensaje;
    
        formulario.appendChild(divMensaje);
    
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

}

function mostrarCotizacion(cotizacion){

    limpiarHTML();
    const  { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: <span> ${PRICE} </span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio más alto del día: <span>${HIGHDAY}</span> </p>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio más bajo del día: <span>${LOWDAY}</span> </p>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Última Actualización: <span>${LASTUPDATE}</span></p>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);

    formulario.appendChild(resultado);

}

function limpiarHTML(){
    while (resultado.firstChild) {
        resultado.firstChild.remove();   
    }
}

function Spinner(){
    limpiarHTML();
    spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `  <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>`;

    resultado.appendChild(spinner);
}
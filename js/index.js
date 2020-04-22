let datosCoronavirus;

fetch("https://www.datos.gov.co/resource/gt2j-8ykr.json?$limit=5000", {
        method: "GET"
    })
    .then(respuesta => {
        return respuesta.json();
    })
    .then(myJson => {
        datosCoronavirus = myJson;
        mostrarDatos(myJson);
    })
    .catch(err => {
        console.log(err);
    });

let mostrarDatos = function(datosCoronavirus) {

    /* Mostrart datos de coronavirus en colombia */
    document.getElementById('total').append(datosCoronavirus.length)
    document.getElementById('hombres').append(datosCoronavirus.filter(item => item.sexo == 'M').length)
    document.getElementById('mujeres').append(datosCoronavirus.filter(item => item.sexo == 'F').length)
    document.getElementById('recuperados').append(datosCoronavirus.filter(({ atenci_n }) => atenci_n == 'Recuperado').length)
    document.getElementById('muertes').append(datosCoronavirus.filter(({ atenci_n }) => atenci_n == 'Fallecido').length)
    document.getElementById("muertes-menores-50").append(datosCoronavirus.filter((item) => item.atenci_n === "Fallecido" && item.edad <= 50).length);

    /*Lista de departamentos */
    let departamentos = datosCoronavirus.map(item => item.departamento);
    departamentos = departamentos.filter((item, indice) => departamentos.indexOf(item) === indice);

    let contenedorDatalist = document.getElementById('datalist-departamentos')
    departamentos.sort().forEach((elm) => {
        opcion = document.createElement('option')
        opcion.value = elm
        contenedorDatalist.append(opcion)
    })

}


let calcularProbabilidad = function() {

    let persona = {}

    let inputs = document.querySelectorAll('#formularioProbabilidad input')
    Array.from(inputs).forEach((elm) => {
        if(elm.type=='radio'){
            if(elm.checked) {persona[elm.name] = elm.value}
        } else {
            persona[elm.name] = elm.value
        }
    })

}


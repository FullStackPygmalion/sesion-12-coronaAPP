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
        dibujarGraficas(myJson)
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
        if (elm.type == 'radio') {
            if (elm.checked) { persona[elm.name] = elm.value }
        } else {
            persona[elm.name] = elm.value
        }
    })

    let contagio;

    let casosDepartamento = datosCoronavirus.filter(({ departamento }) => persona.departamento == departamento)

    contagio = (casosDepartamento.length * 100 / datosCoronavirus.length)


    switch (persona.salidas) {
        case 'ninguna':
            break;
        case '1 a 3':
            contagio *= 4
            break;
        case '4 a 10':
            contagio *= 8
            break;
        case 'mas de 10':
            contagio *= 16
            break;
        default:
            break;
    }

    if (contagio < 0) contagio = 0
    if (contagio > 100) contagio = 100
    contagio = Math.floor(contagio)

    let mensaje = `Señor ${persona.nombre} siga teniendo en cuentra las medidas propiestas por las organizaciones de salud `

    let estadisticas = `<br><p>Los casos en su departamento son: <br><span class = "big-text-3">${casosDepartamento.length} <span></p>`

    document.getElementById('probabilidad').innerText = contagio + '%'
    document.getElementById('mensaje').innerText = mensaje
    document.getElementById('estadisticas-resultados').innerHTML = estadisticas

}


let dibujarGraficas = function(datosCoronavirus) {

    let fechasContagio = datosCoronavirus.map(({ fecha_diagnostico }) => fecha_diagnostico)

    let aumentoXdia = []
    let indice = 0,
        dia = 0,
        contagios = 0


    fechasContagio.forEach(fecha => {
        if (fechasContagio.indexOf(fecha) == indice) {
            contagios++
            aumentoXdia[dia] = contagios
            dia++;
        } else {
            contagios++
            aumentoXdia[dia] = contagios
        }
        indice++;
    })

    console.log(aumentoXdia)



    new Chartist.Line('.ct-chart', {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        series: [
            aumentoXdia

        ]
    }, {
        fullWidth: true,
        chartPadding: {
            right: 40
        }
    });


}
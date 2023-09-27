// creo una funcion el cual tiene la funcion de mostrar la imagen que se suba para analizar
document.getElementById('img').addEventListener('change', function() { //capturo y creo un evento click
    var reader = new FileReader(); //creo una instancia FileReader para leer el archivo
    reader.onload = function(e) { //creo una funcion que que se ejecuta cuando el FileReader termine de leer el archivo
        var img = document.createElement('img'); //creo una etiqueta img
        img.className = ('imagen') //le doy la clase 'imagen' a la etiqueta img creada
        img.src = e.target.result; //establesco el valor src de la imagnen con el resultado de la lectura del archivo de la instancia FileReader
        document.getElementById('mostrar-img').appendChild(img); //capturo el contenedor de la imagen y le agrego el contenido de la variable img, que seria la imagen
    }
    reader.readAsDataURL(this.files[0]); //se inicializa la lectura del archivo subido 
});

// creo una funcion la cual le da un evento click a un boton, el cual eliminara todos los datos obtenidos de la API y la imagen cargada
document.getElementById('limpiar').addEventListener('click', function() { //capturo y creo el evento click
    document.getElementById('img').value = ''; //restablesco el valor del imput en limpio
    document.getElementById('resultado-clasificacion').innerHTML = "";
    var imgContainer = document.getElementById('mostrar-img'); //capturo el contenedor de la imagen 
    while (imgContainer.firstChild) {
        imgContainer.removeChild(imgContainer.firstChild); 
    } // verifico que el contenedor de la imagen tenga algun contenido y si es asi elimino el nodo hijo que tenia el contenedor de la imagen
    document.getElementById('results').value = "";
});

// hago llamado a la API utilizando XMLHttpRequest y muestro los resultaos devueltos por esta
document.getElementById('estilo-boton').addEventListener('click', function() { // capturo el boton para llamar a la API y le agrego un evento click
    var imgEntrada = document.getElementById('img'); //capturo la imagen que se suba 
    if (imgEntrada.files.length > 0) { //condiciono para que no se ejecute si esta vacia
        var reader = new FileReader(); //creo una instancia FileReader para leer el archivo
        reader.onload = function(e) { //creo una funcion que que se ejecuta cuando el FileReader termine de leer el archivo
            var lecturaResul = reader.result; //creo una variable y le asigno el resultado de la lectura del archivo
            var api = new XMLHttpRequest(); // implemento XMLHttpRequest  para realizar la peticion a la API de custom vision
            api.open('POST', 'https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/edb69521-fde2-4272-9d75-9afb93eeb0ac/classify/iterations/modelo/image', true); //usando el metodo POST hago el llamado a la API
            api.setRequestHeader('Prediction-Key', '7575c83fb4fe49798d79be9ddeb66d54'); // implemento la Prediction-Key de mi API 
            api.onreadystatechange = function () { //despues de llamada a la API se crea la funccion para mostrar los resultados devueltos
                if (api.readyState === 4 && api.status === 200) { //verificacion si lia solicitud fue exitosa 
                    var respuestaJson = JSON.parse(api.responseText); //guardo los resultados devueltos por la API 
                    var prediccion = respuestaJson.predictions[0]; // Extraigo las predicciones de la respuesta
                    var probabilidad = Math.round(prediccion.probability * 100); //redondeo la probabilidad al entero mas cercano
                    if(probabilidad <= 60){
                        alert("conflicto de deteccion") //si la probabilidad es menor o igual a 60 no detectara nada
                    }else{
                        document.getElementById('resultado-clasificacion').innerText = 'Clase: ' + prediccion.tagName + ', Probabilidad: ' + probabilidad+ '%'; //muestro los resultados en el contenedor con id resultado-clasificacion que es una etiqueta <p>
                    }
                    xhrTraduccion.send(JSON.stringify([{ 'Text': prediccion.tagName }]));
                }
            };
            api.send(lecturaResul); // Envio la solicitud a la API con los datos de la imagen
        }
        reader.readAsArrayBuffer(imgEntrada.files[0]); //Inicio la lectura del archivo de la imagen como un ArrayBuffer

        // Creo una nueva solicitud HTTP para hacer una petición a la API de traducción
        var xhrTraduccion = new XMLHttpRequest();
        xhrTraduccion.open('POST', 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=en,fr,it,ko,ru', true);
        xhrTraduccion.setRequestHeader('Ocp-Apim-Subscription-Key', '4cfa4d9c8be143b98089561423c86b7d');
        xhrTraduccion.setRequestHeader('Ocp-Apim-Subscription-Region', 'eastus');
        xhrTraduccion.setRequestHeader('Content-Type', 'application/json');
        xhrTraduccion.onreadystatechange = function () {
            // Verifico si la solicitud se completó y fue exitosa
            if (xhrTraduccion.readyState === 4 && xhrTraduccion.status === 200) {
                // Parseo la respuesta de la API a un objeto JSON
                var respuestaTraduccion = JSON.parse(xhrTraduccion.responseText);
                console.log(respuestaTraduccion)
                // Creo una variable para almacenar los resultados de las traducciones
                var resultadosTraducciones = '';
        
                // Itero sobre cada traducción y agrego los resultados a la variable
                for (var i = 0; i < respuestaTraduccion.length; i++) {
                    for (var j = 0; j < respuestaTraduccion[i].translations.length; j++) {
                        resultadosTraducciones += respuestaTraduccion[i].translations[j].to + ': ' + respuestaTraduccion[i].translations[j].text + '\n';
                    }
                }
                // Muestro los resultados en el área de texto con id 'results'
                document.getElementById('results').value = resultadosTraducciones;
            }
        };
       
    }
});

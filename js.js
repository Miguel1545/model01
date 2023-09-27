document.getElementById('img').addEventListener('change', function() { 
    var reader = new FileReader(); 
    reader.onload = function(e) { 
        var img = document.createElement('img'); 
        img.className = ('imagen') 
        img.src = e.target.result; 
        document.getElementById('mostrar-img').appendChild(img); 
    }
    reader.readAsDataURL(this.files[0]); 
});

document.getElementById('limpiar').addEventListener('click', function() { 
    document.getElementById('img').value = ''; 
    document.getElementById('resultado-clasificacion').innerHTML = "";
    var imgContainer = document.getElementById('mostrar-img');  
    while (imgContainer.firstChild) {
        imgContainer.removeChild(imgContainer.firstChild); 
    } 
    document.getElementById('results').value = "";
});

document.getElementById('estilo-boton').addEventListener('click', function() { 
    var imgEntrada = document.getElementById('img');  
    if (imgEntrada.files.length > 0) { 
        var reader = new FileReader(); 
        reader.onload = function(e) { 
            var lecturaResul = reader.result; 
            var api = new XMLHttpRequest(); 
            api.open('POST', 'https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/edb69521-fde2-4272-9d75-9afb93eeb0ac/classify/iterations/modelo/image', true); 
            api.setRequestHeader('Prediction-Key', '7575c83fb4fe49798d79be9ddeb66d54'); 
            api.onreadystatechange = function () { 
                if (api.readyState === 4 && api.status === 200) {  
                    var respuestaJson = JSON.parse(api.responseText); 
                    var prediccion = respuestaJson.predictions[0]; 
                    var probabilidad = Math.round(prediccion.probability * 100); 
                    if(probabilidad <= 60){
                        alert("conflicto de deteccion") 
                    }else{
                        document.getElementById('resultado-clasificacion').innerText = 'Clase: ' + prediccion.tagName + ', Probabilidad: ' + probabilidad+ '%'; 
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


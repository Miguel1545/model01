
document.getElementById('en').addEventListener('click', function() {
    var textoEntrada = document.getElementById('entrada').innerText;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=fr,en', true);
    xhr.setRequestHeader('Ocp-Apim-Subscription-Key', '4cfa4d9c8be143b98089561423c86b7d');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Ocp-Apim-Subscription-Region', 'eastus')
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var jsonResponse = JSON.parse(xhr.responseText);
            document.getElementById('salida').innerText = jsonResponse[0].translations[0,1].text;
        }
    };
    xhr.send(JSON.stringify([{ Text: textoEntrada }]));
});




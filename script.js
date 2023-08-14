document.addEventListener("DOMContentLoaded", async function () {
    const direccionInput = document.getElementById("direccionInput");
    const sugerenciasDiv = document.getElementById("sugerencias");
    const consultarButton = document.getElementById("consultar");
    const resultadoDiv = document.getElementById("resultado");

    const spreadsheetId = '1B54exoYwmwj2hVP0Dg8-jp-UY0XS4v2e0dZVZYbkuS4';
    const range = 'Registros!A2:A';
    const apiKey = 'AIzaSyCVzYHipbDSB-SfFXkfZbcivcPMj-ABw14';

    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        const direcciones = data.values.flat();

        direccionInput.addEventListener("input", function () {
            const inputValue = direccionInput.value.toLowerCase();
            const suggestions = direcciones.filter(direccion =>
                direccion.toLowerCase().includes(inputValue)
            );

            sugerenciasDiv.innerHTML = ""; // Limpiar sugerencias anteriores

            suggestions.forEach(suggestion => {
                const suggestionDiv = document.createElement("div");
                suggestionDiv.textContent = suggestion;
                suggestionDiv.addEventListener("click", function () {
                    direccionInput.value = suggestion;
                    sugerenciasDiv.innerHTML = ""; // Limpiar sugerencias al seleccionar
                });
                sugerenciasDiv.appendChild(suggestionDiv);
            });
        });

        direccionInput.addEventListener("blur", function () {
            setTimeout(() => {
                sugerenciasDiv.innerHTML = "";
            }, 300);
        });

        consultarButton.addEventListener("click", async function () {
            const selectedDireccion = direccionInput.value;

            const consultaRange = 'Registros!A:D';
            const consultaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${consultaRange}?key=${apiKey}`;

            try {
                const consultaResponse = await fetch(consultaUrl);
                const consultaData = await consultaResponse.json();

                const matchingRows = consultaData.values.filter(row => row[0] === selectedDireccion);
                const lastMatchingRow = matchingRows[matchingRows.length - 1];

                if (lastMatchingRow) {
                    const registro = lastMatchingRow[1];
                    const nombre = lastMatchingRow[2];
                    const fechaHora = lastMatchingRow[3];

                    const respuesta = `Último registro: ${registro}, ${nombre}, el ${fechaHora}`;
                    resultadoDiv.textContent = respuesta;
                } else {
                    resultadoDiv.textContent = "No hay registros para esta dirección.";
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        });
    } catch (error) {
        console.error('Error al obtener las direcciones:', error);
    }
});


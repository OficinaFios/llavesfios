document.addEventListener("DOMContentLoaded", async function () {
    const direccionSelect = document.getElementById("direccion");
    const consultarButton = document.getElementById("consultar");
    const resultadoDiv = document.getElementById("resultado");

    const spreadsheetId = '1B54exoYwmwj2hVP0Dg8-jp-UY0XS4v2e0dZVZYbkuS4'; // ID de tu hoja de cálculo
    const range = 'Registros!A2:A'; // Rango que incluye las direcciones (excluyendo la primera fila con encabezados)
    const apiKey = 'AIzaSyCVzYHipbDSB-SfFXkfZbcivcPMj-ABw14';

    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        const direcciones = data.values.flat(); // Convierte el array de arrays en un array plano

        direcciones.forEach(direccion => {
            const option = document.createElement("option");
            option.textContent = direccion;
            direccionSelect.appendChild(option);
        });

        consultarButton.addEventListener("click", async function () {
            const selectedDireccion = direccionSelect.value;

            const consultaRange = 'Registros!A:D'; // Cambia el rango según tus necesidades
            const consultaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${consultaRange}?key=${apiKey}`;

            try {
                const consultaResponse = await fetch(consultaUrl);
                const consultaData = await consultaResponse.json();

                // Encuentra la última fila que coincida con la dirección seleccionada
                const matchingRows = consultaData.values.filter(row => row[0] === selectedDireccion);
                const lastMatchingRow = matchingRows[matchingRows.length - 1];

                if (lastMatchingRow) {
                    const registro = lastMatchingRow[1]; // Columna "Registro"
                    const nombre = lastMatchingRow[2];   // Columna "Nombre"
                    const fechaHora = lastMatchingRow[3]; // Columna "Fecha/Hora"

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

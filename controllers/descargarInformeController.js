const XLSX = require("xlsx");
const path = require("path");

const descargarInforme = async (req, res) => {
    try {
        const filePath = path.join(__dirname, "../public/patron_informe.xlsx"); // Ruta al archivo original
        const workbook = XLSX.readFile(filePath); // Leer el archivo Excel

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Rellena datos en el Excel (personalización)
        XLSX.utils.sheet_add_json(worksheet, [
            { ID: 1, Nombre: "Equipo1", Marca: "Marca1" },
            { ID: 2, Nombre: "Equipo2", Marca: "Marca2" }
        ], { origin: "A10" }); // Ajusta según sea necesario

        // Genera un archivo temporal para la descarga
        const tempPath = path.join(__dirname, "../public/informe_generado.xlsx");
        XLSX.writeFile(workbook, tempPath);

        // Enviar el archivo generado para su descarga
        res.download(tempPath, "informe_generado.xlsx", (err) => {
            if (err) {
                console.error("Error al enviar el archivo:", err);
                res.status(500).send("Error al descargar el archivo.");
            }
        });
    } catch (error) {
        console.error("Error al generar el informe:", error);
        res.status(500).send("Error al generar el informe.");
    }
};

module.exports = { descargarInforme };
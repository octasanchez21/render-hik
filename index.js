import pkg from "@tago-io/sdk";
import { DigestClient } from "digest-fetch";
import express from "express";

const { Utils, Analysis, Device } = pkg;

// Credenciales de autenticación
const username = "admin";
const password = "Inteliksa6969";

// Función principal del análisis
async function index(context) {
  const env = Utils.envToJson(context.environment);
  const device = new Device({ token: env.device_token });

  const url =
    "http://34.221.158.219/ISAPI/AccessControl/UserInfo/Search?format=json&devIndex=F5487AA0-2485-4CFB-9304-835DCF118B43";
  const client = new DigestClient(username, password);

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      UserInfoSearchCond: {
        searchID: "1",
        searchResultPosition: 0,
        maxResults: 50,
      },
    }),
  };

  try {
    const response = await client.fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }
    const data = await response.json();
    context.log("Respuesta completa:", data);

    if (data.UserInfoSearch && data.UserInfoSearch.UserInfo) {
      data.UserInfoSearch.UserInfo.forEach((user) => {
        context.log("Contenido completo de UserInfo:");

        const userInfo = JSON.stringify(user, null, 2);
        /*  context.log(userInfo); */

        const name = user.name;
        const data = { variable: "name", value: name };
        device.sendData(data);
      });
    }
  } catch (error) {
    context.log("Error:", error.message);
    throw error; // Para que TagoIO registre el error si es necesario
  }
}

// Configuración del servidor Express
const app = express();
const port = process.env.PORT || 10000; // Puerto definido por Render o el predeterminado

// Ruta principal para verificar el estado
app.get("/", (req, res) => {
  res.send("¡El servidor del análisis de TagoIO está activo!");
});

// Ruta para ejecutar el análisis manualmente
app.get("/run-analysis", async (req, res) => {
  const context = {
    log: console.log,
  };

  try {
    await index(context); // Llama al análisis de TagoIO
    res.send("El análisis de TagoIO se ejecutó correctamente.");
  } catch (error) {
    res.status(500).send(`Error al ejecutar el análisis: ${error.message}`);
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

// Exporta el análisis para TagoIO
export default new Analysis(index, {
  token: "a-e5b12b85-f078-4bb6-8220-89502414f2f9",
});

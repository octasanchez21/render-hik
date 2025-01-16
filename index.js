import pkg from "@tago-io/sdk";
import { DigestClient } from "digest-fetch";

const { Analysis, Services } = pkg;

// Credenciales de autenticación
const username = "admin";
const password = "Inteliksa6969";

async function index(context) {
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

  client
    .fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Respuesta completa:", data);

      if (data.UserInfoSearch && data.UserInfoSearch.UserInfo) {
        data.UserInfoSearch.UserInfo.forEach((user) => {
          console.log("Contenido completo de UserInfo:");
          console.log(JSON.stringify(user, null, 2));
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

export default new Analysis(index, {
  token: "a-1cfce699-af67-4351-a927-cb0a87b903fa",
});

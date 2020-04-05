import React, { useEffect, useState } from "react";
import { alphabet, returnCrypto } from "../../utils";
import api, { token } from "../../services/api";
import "./styles.css";

export default function Home() {
  const [obj, setObj] = useState({});
  const [responseObject, setResponseObject] = useState({});
  const [file, setFile] = useState();

  useEffect(() => {
    function fetchData() {
      return api.get(`/generate-data?token=${token}`);
    }

    fetchData().then((res) => setObj(res.data));
  }, []);

  useEffect(() => {
    if (obj.hasOwnProperty("cifrado")) {
      const step = obj.numero_casas;
      const secretMessage = obj.cifrado;
      const messageArray = secretMessage.split("");

      function replaceChar(char, index, array) {
        const position = alphabet.findIndex((element) => element === char);
        if (position >= 0) {
          array[index] = alphabet[position + step];
        } else {
          array[index] = char;
        }
      }

      messageArray.forEach((char, index, array) =>
        replaceChar(char.toLocaleLowerCase(), index, array)
      );

      let newObj = {
        ...obj,
        decifrado: messageArray.join(""),
        resumo_criptografico: returnCrypto(obj.decifrado),
      };

      setResponseObject(newObj);

      download(JSON.stringify(newObj), "answer.json", "text/plain");

      function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.text = "Baixar arquivo JSON";
        document.getElementsByClassName("container")[0].appendChild(a);
      }
    }
  }, [obj]);

  function onSelectArchive(e) {
    setFile(e.target.files[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      alert("selecione um arquivo para enviar!");
    }
    let formData = new FormData();
    formData.append("answer", file);

    api
      .post(`/submit-solution?token=${token}`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then(alert("JSON enviado com sucesso!"))
      .catch((e) => console.log(e));
  }

  return (
    <div className="container">
      <h1>Cifra de César</h1>
      <form action="post" onSubmit={handleSubmit}>
        <p>Numero de casas para criptografar: {responseObject.numero_casas}</p>
        <p>Cifra: {responseObject.cifrado}</p>
        <p>Decifrado: {responseObject.decifrado}</p>
        <p>Sha1: {responseObject.resumo_criptografico}</p>
        <label>Escolha o arquivo para enviar</label>
        <input type="file" accept=".json" onChange={onSelectArchive} />
        <div>
          <button>Enviar!</button>
        </div>
      </form>
    </div>
  );
}

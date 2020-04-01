import React, { useEffect, useState } from "react";
import { alphabet, returnCrypto } from "../../utils";

import api, { token } from "../../services/api";

export default function Home() {
  const [obj, setObj] = useState({});

  useEffect(() => {
    function fetchData() {
      return api.get(`/generate-data?token=${token}`);
    }

    fetchData().then(res => setObj(res.data));
  }, []);

  useEffect(() => {
    if (obj.hasOwnProperty("cifrado")) {
      const step = obj.numero_casas;
      const secretMessage = obj.cifrado;
      const messageArray = secretMessage.split("");

      function replaceChar(char, index, array) {
        const position = alphabet.findIndex(element => element === char);
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
        resumo_criptografico: returnCrypto(obj.decifrado)
      }

      setObj(newObj)
      

      // fs.writeFile(`${__dirname}/answer.json`, JSON.stringify(obj), err => {
      //   console.log(err || 'Arquivo salvo!');
      // });
    }
  }, [obj]);

  function sendFile(e) {
    e.preventDefault();
    alert("enviado!!");
  }

  return (
    <form method="post" onSubmit={sendFile}>
      <div>
        <p>Numero de casas para criptografar: {obj.numero_casas}</p>
        <p>Cifra: {obj.cifrado}</p>
        <p>Decifrado: {obj.decifrado}</p>
        <p>Sha1: {obj.resumo_criptografico}</p>
        <label for="file">Escolha o arquivo para enviar</label>
        <input type="file" id="1" name="answer" accept=".json" />
      </div>
      <div>
        <button>Submit</button>
      </div>
    </form>
  );
}

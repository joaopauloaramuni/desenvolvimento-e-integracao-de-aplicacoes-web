// _gtfsrt.js
// Lê o feed GTFS-Realtime (vehicle-positions) da PBH, que vem em Protocol Buffers.
//
// Por que não usar uma biblioteca? A oficial (gtfs-realtime-bindings) instala junto
// ferramentas de geração de código (protobufjs-cli, jsdoc...) só para ler 10 campos.
// O formato binário do protobuf é simples: cada campo é uma "etiqueta" (número do
// campo + tipo) seguida do valor. Aqui decodificamos só o que o mapa usa e pulamos
// o resto, seguindo o esquema oficial:
// https://gtfs.org/documentation/realtime/proto/
//
//   FeedMessage { header = 1 { timestamp = 3 }, entity = 2 (repetido) }
//   FeedEntity  { id = 1, vehicle = 4 }
//   VehiclePosition {
//     trip = 1     { trip_id = 1, route_id = 5, direction_id = 6 }
//     position = 2 { latitude = 1 (float), longitude = 2 (float), bearing = 3 (float), speed = 5 (float, m/s) }
//     timestamp = 5
//     vehicle = 8  { id = 1, label = 2 }
//   }
//
// O nome começa com "_" para a Vercel NÃO transformar o arquivo em rota.

// Tipos de fio (wire types) do protobuf
const VARINT = 0;
const FIXED64 = 1;
const LEN = 2;
const FIXED32 = 5;

class Leitor {
  constructor(bytes, inicio = 0, fim = bytes.length) {
    this.bytes = bytes;
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    this.pos = inicio;
    this.fim = fim;
  }

  get acabou() {
    return this.pos >= this.fim;
  }

  // Inteiro de tamanho variável: 7 bits por byte, o 8º diz se continua.
  // Usamos multiplicação (e não <<) para não estourar os 32 bits do JavaScript.
  varint() {
    let valor = 0;
    let fator = 1;
    for (let i = 0; i < 10; i += 1) {
      if (this.pos >= this.fim) throw new Error("Protobuf truncado (varint)");
      const byte = this.bytes[this.pos];
      this.pos += 1;
      valor += (byte & 0x7f) * fator;
      if (byte < 0x80) return valor;
      fator *= 128;
    }
    throw new Error("Varint inválido");
  }

  float() {
    const valor = this.view.getFloat32(this.pos, true);
    this.pos += 4;
    return valor;
  }

  // Campo de tamanho fixo pelo prefixo: devolve um sub-leitor só com o conteúdo
  bloco() {
    const tamanho = this.varint();
    const inicio = this.pos;
    this.pos += tamanho;
    if (this.pos > this.fim) throw new Error("Protobuf truncado (bloco)");
    return new Leitor(this.bytes, inicio, this.pos);
  }

  texto() {
    const b = this.bloco();
    return new TextDecoder().decode(this.bytes.subarray(b.pos, b.fim));
  }

  pular(tipo) {
    if (tipo === VARINT) this.varint();
    else if (tipo === FIXED64) this.pos += 8;
    else if (tipo === LEN) {
      // Em duas linhas de propósito: em "this.pos += this.varint()" o JavaScript lê
      // this.pos ANTES de o varint avançar a posição, e o salto sai errado.
      const tamanho = this.varint();
      this.pos += tamanho;
    }
    else if (tipo === FIXED32) this.pos += 4;
    else throw new Error(`Tipo de campo protobuf desconhecido: ${tipo}`);
  }

  // Percorre os campos chamando aoCampo(numero, tipo). Se ele devolver false, o campo é pulado.
  campos(aoCampo) {
    while (!this.acabou) {
      const etiqueta = this.varint();
      const numero = Math.floor(etiqueta / 8);
      const tipo = etiqueta % 8;
      if (aoCampo(numero, tipo) === false) this.pular(tipo);
    }
  }
}

function lerViagem(l) {
  const viagem = {};
  l.campos((n, t) => {
    if (n === 1 && t === LEN) viagem.tripId = l.texto();
    else if (n === 5 && t === LEN) viagem.routeId = l.texto();
    else if (n === 6 && t === VARINT) viagem.directionId = l.varint();
    else return false;
  });
  return viagem;
}

function lerPosicao(l) {
  const p = {};
  l.campos((n, t) => {
    if (t !== FIXED32) return false;
    if (n === 1) p.lat = l.float();
    else if (n === 2) p.lon = l.float();
    else if (n === 3) p.rumo = l.float();
    else if (n === 5) p.velocidade = l.float();
    else return false;
  });
  return p;
}

function lerVeiculoDescritor(l) {
  const v = {};
  l.campos((n, t) => {
    if (n === 1 && t === LEN) v.id = l.texto();
    else if (n === 2 && t === LEN) v.rotulo = l.texto();
    else return false;
  });
  return v;
}

function lerVehiclePosition(l) {
  const vp = { viagem: {}, posicao: {}, veiculo: {}, timestamp: null };
  l.campos((n, t) => {
    if (n === 1 && t === LEN) vp.viagem = lerViagem(l.bloco());
    else if (n === 2 && t === LEN) vp.posicao = lerPosicao(l.bloco());
    else if (n === 5 && t === VARINT) vp.timestamp = l.varint();
    else if (n === 8 && t === LEN) vp.veiculo = lerVeiculoDescritor(l.bloco());
    else return false;
  });
  return vp;
}

/**
 * Decodifica o feed e devolve { timestamp, veiculos: [...] } (só entidades com posição).
 * @param {Uint8Array} bytes
 */
export function decodificarFeed(bytes) {
  const l = new Leitor(bytes);
  let timestamp = null;
  const veiculos = [];
  l.campos((n, t) => {
    if (n === 1 && t === LEN) {
      const h = l.bloco();
      h.campos((hn, ht) => {
        if (hn === 3 && ht === VARINT) timestamp = h.varint();
        else return false;
      });
    } else if (n === 2 && t === LEN) {
      const e = l.bloco();
      let id = null;
      let vp = null;
      e.campos((en, et) => {
        if (en === 1 && et === LEN) id = e.texto();
        else if (en === 4 && et === LEN) vp = lerVehiclePosition(e.bloco());
        else return false;
      });
      if (vp && Number.isFinite(vp.posicao.lat) && Number.isFinite(vp.posicao.lon)) {
        veiculos.push({ entidade: id, ...vp });
      }
    } else return false;
  });
  return { timestamp, veiculos };
}

import "./HowItWorks.css";

// O caminho do jogo Pygame até esta página. É uma sequência de verdade, por isso os números.
const PASSOS = [
  {
    titulo: "Deixe o laço principal assíncrono",
    texto:
      "O pygbag roda o Python dentro do navegador, que precisa de um respiro a cada quadro para desenhar a tela. O laço vai para uma função async e ganha um await no final.",
    codigo: `import asyncio

async def main():
    while rodando:
        ...  # eventos, regras e desenho
        pygame.display.flip()
        await asyncio.sleep(0)

asyncio.run(main())`,
  },
  {
    titulo: "Teste com o pygbag",
    texto:
      "Instale o pygbag e rode com o nome da pasta do jogo. Ele abre um servidor em localhost:8000 com o jogo funcionando no navegador.",
    codigo: `pip install -r game/requirements.txt
pygbag game/cobrinha`,
  },
  {
    titulo: "Gere o build e copie para public/",
    texto:
      "O script roda o pygbag --build e copia o resultado para public/games/. O Vite entrega essa pasta do jeito que está, sem mexer em nada.",
    codigo: `npm run game:build
# public/games/cobrinha/
#   index.html  cobrinha.apk  favicon.png`,
  },
  {
    titulo: "Cadastre o jogo na página",
    texto:
      "Um objeto no src/data/games.js e o componente GamePlayer abre o index.html do pygbag num iframe, só depois do clique em Jogar.",
    codigo: `{
  pasta: "cobrinha",
  titulo: "Cobrinha",
  largura: 640,
  altura: 480,
  ...
}`,
  },
];

export default function HowItWorks() {
  return (
    <section className="passos" aria-labelledby="passos-titulo">
      <h2 id="passos-titulo">Do Pygame para o site</h2>
      <p className="passos-intro">
        O mesmo main.py roda no computador com <code>python main.py</code> e aqui na página. O
        caminho tem quatro passos; o README do projeto explica cada um com mais detalhes.
      </p>
      <ol>
        {PASSOS.map((passo) => (
          <li key={passo.titulo}>
            <h3>{passo.titulo}</h3>
            <p>{passo.texto}</p>
            <pre>
              <code>{passo.codigo}</code>
            </pre>
          </li>
        ))}
      </ol>
    </section>
  );
}

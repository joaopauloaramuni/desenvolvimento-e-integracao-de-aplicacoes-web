// Lista de portfólios da turma (2026/2).
//
// Campos:
//   id          nome do arquivo de captura em public/previews/<id>.png
//   nome        nome do aluno (a busca usa este campo)
//   site        endereço publicado do portfólio
//   github      usuário do GitHub (null quando ainda não foi informado)
//   repo        repositório do portfólio dentro do GitHub do aluno (null se não encontrado)
//   embeddable  false quando o site bloqueia iframe (X-Frame-Options / CSP):
//               nesse caso o preview mostra a captura em vez do site ao vivo

const PORTFOLIOS = [
  { id: "bicalho", nome: "Arthur Bicalho Angelo", site: "https://bicalho.dev", github: "Arthur-Bicalho", repo: "bicalho-portfolio", embeddable: false },
  { id: "nicolasdealmeida", nome: "Nicolas de Almeida", site: "https://nicolasdealmeida.dev", github: "Nicolas-De-Almeida", repo: "portfolio", embeddable: true },
  { id: "pedrobastos", nome: "Pedro Felipe Bastos", site: "https://pedrobastos.dev", github: "pedrobastosdev", repo: "pedrobastosdev.github.io", embeddable: true },
  { id: "evelyncosta", nome: "Evelyn Costa", site: "https://evelyncosta.dev", github: "Evycostzocn", repo: "PortfolioProfissional", embeddable: true },
  { id: "armandosmoreira", nome: "Armando Moreira", site: "https://armandosmoreira.dev", github: "Armando-Schoenstatt", repo: "PortifolioDiaw", embeddable: true },
  { id: "dvdaurelio", nome: "David Aurélio", site: "https://dvdaurelio.dev", github: "DavidAurelio07", repo: "Portfolio", embeddable: true },
  { id: "elidias", nome: "Eli Dias", site: "https://elidias.dev", github: "elijuniordd", repo: "portfolio", embeddable: true },
  { id: "lukasgomes", nome: "Lucas Gomes", site: "https://lukasgomes.dev", github: "LukasGom3s", repo: "LukasGomesPortfolio", embeddable: true },
  { id: "arthurgabriel", nome: "Arthur Gabriel", site: "https://arthurgabriel.dev", github: "arturity7", repo: "arthur-portifolio", embeddable: true },
  { id: "bernardoguedes", nome: "Bernardo Guedes", site: "https://bernardoguedes.dev", github: "Bernardo-Guedes", repo: "portfolio", embeddable: true },
  { id: "diegoportella", nome: "Diego Portella", site: "https://diegoportella.dev", github: "diegovitorportella", repo: "portifolio-profissional-dportella", embeddable: true },
  { id: "paulo-cesar", nome: "Paulo César", site: "https://paulo-cesar.dev", github: "PauloCesar0709", repo: "portfolio-paulocesar", embeddable: true },
  { id: "victorcandido", nome: "Victor Cândido Leite", site: "https://victorcandido.dev", github: "thevictorcandido", repo: "portfolio-victor", embeddable: true },
  { id: "davisollar", nome: "Davi Sollar", site: "https://davisollar.me", github: "HyperSonic3608", repo: "portfolio", embeddable: true },
  { id: "engsoftmarcelo", nome: "Marcelo Gomes", site: "https://engsoftmarcelo.dev", github: "engsoftmarcelo", repo: "engsoftmarcelo", embeddable: false },
  { id: "arturbomtempo", nome: "Artur Bomtempo", site: "https://arturbomtempo.dev", github: "arturbomtempo-dev", repo: "portfolio", embeddable: false },
  { id: "warlleys", nome: "Warlley Silva", site: "https://warlleys.dev", github: "warlleyz", repo: "portfolio-warlley", embeddable: false },
  { id: "abneralmeida", nome: "Abner Almeida", site: "https://abneralmeida.dev", github: "abneralmeidacord", repo: "abneralmeida-portfolio", embeddable: true },
  { id: "ryanferreira", nome: "Ryan Ferreira", site: "https://ryanferreira.dev", github: "ferreiraryan", repo: "portfolio", embeddable: true },
  { id: "fernandoleitepagani", nome: "Fernando Leite Pagani", site: "https://fernandoleitepagani.dev", github: "fernandoleitepagani", repo: "fernandoleitepagani-portfolio", embeddable: true },
  { id: "flausino", nome: "Pedro Flausino", site: "https://flausino.dev", github: "PedroFlau", repo: "pedroflausino-portifolio", embeddable: true },
  { id: "danielolv", nome: "Daniel Oliveira", site: "https://danielolv.dev", github: "Danielolv14", repo: "portfolio-3d", embeddable: true },
  { id: "presot", nome: "Guilherme Presot", site: "https://presot.dev", github: "gpresot", repo: "Portif-lio", embeddable: true },
  { id: "l4r1ss4cr4v0", nome: "Larissa Cravo", site: "https://l4r1ss4cr4v0.dev", github: "L4r1ss4Cr4v0", repo: "Portifolio-Dev", embeddable: true },
  { id: "carolinasouza", nome: "Carolina Souza", site: "https://carolinasouza.dev", github: "Carolinasouza456", repo: "portf-lio-profissional", embeddable: true },
  { id: "matheuscamp", nome: "Matheus Campos", site: "https://matheuscamp.dev", github: "Matheuscamp", repo: "MyPortfolio", embeddable: true },
  { id: "arthurdomingos", nome: "Arthur Domingos", site: "https://arthurdomingos.dev", github: "thuzada", repo: "LAB1-DIW", embeddable: true },
  { id: "enzofernandesnz", nome: "Enzo Fernandes", site: "https://enzofernandesnz.dev", github: "enzofernandesnz", repo: "portfolio-nz", embeddable: true },
  { id: "samuelmatos", nome: "Samuel Matos", site: "https://samuelmatos.dev", github: "SamuelMatos78", repo: "portfolio", embeddable: true },
  { id: "arthurmoraes", nome: "Arthur Moraes", site: "https://arthurmoraes.dev", github: "ArthurMoraesBraga", repo: "Portfolio", embeddable: true },
  { id: "franciscofilipeee", nome: "Francisco Filipe", site: "https://franciscofilipeee.dev", github: "franciscofilipeee", repo: "portfolio", embeddable: true },
  { id: "leopettersen", nome: "Leonardo Pettersen", site: "https://leopettersen.dev", github: "leopettersen", repo: "portfolio", embeddable: true },
  { id: "sophiafernandes", nome: "Sophia Fernandes", site: "https://sophiafernandes.dev", github: "sophiafernandesc", repo: "sophiafernandes-portfolio", embeddable: true },
  { id: "md101", nome: "Kelvin Mendes", site: "https://md101.dev", github: "Md1o1", repo: "portfolio", embeddable: true },
  { id: "joaomario", nome: "João Mário", site: "https://joaomario.dev", github: "joaomariofm", repo: "portfolio-website", embeddable: true },
  { id: "jprodrigues", nome: "João Paulo Rodrigues", site: "https://jprodrigues.me", github: "joaopauloferreirarodrigues", repo: "jprodrigues.me", embeddable: true },
  { id: "leomartinsdev", nome: "Leonardo Martins", site: "https://leomartinsdev.me", github: "leomartinsdev", repo: "leomartinsdev.github.io", embeddable: true },
  { id: "kevenlino", nome: "Keven Lino", site: "https://kevenlino.me", github: "Tuzfi", repo: "Portfolio", embeddable: true },
  { id: "lucasmaf", nome: "Lucas Mafia", site: "https://lucasmaf.ia.br", github: "lucasomafia", repo: "Meu-Portfolio", embeddable: true },
  { id: "emanuelphillipe", nome: "Emanuel Phillipe", site: "https://space.emanuelphillipe.com", github: "emanuel-phillipe", repo: "space-emanuel", embeddable: true },
];

export default PORTFOLIOS;

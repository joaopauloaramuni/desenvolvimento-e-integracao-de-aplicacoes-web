// Lista de portfólios da turma (2026/2).
//
// Campos:
//   id          nome do arquivo de captura em public/previews/<id>.png
//   nome        nome do aluno (a busca usa este campo)
//   site        endereço publicado do portfólio
//   vercel      endereço .vercel.app do portfólio ("" quando não está na Vercel ou não foi encontrado)
//   github      usuário do GitHub (null quando ainda não foi informado)
//   repo        repositório do portfólio dentro do GitHub do aluno (null se não encontrado)
//   embeddable  false quando o site bloqueia iframe (X-Frame-Options / CSP):
//               nesse caso o preview mostra a captura em vez do site ao vivo

const PORTFOLIOS = [
  { id: "bicalho", nome: "Arthur Bicalho Angelo", site: "https://bicalho.dev", vercel: "https://bicalho-portfolio-idfxzv1s6-arthur-bicalho.vercel.app", github: "Arthur-Bicalho", repo: "bicalho-portfolio", embeddable: false },
  { id: "nicolasdealmeida", nome: "Nicolas de Almeida", site: "https://nicolasdealmeida.dev", vercel: "https://nicolasdealmeida.vercel.app", github: "Nicolas-De-Almeida", repo: "portfolio", embeddable: true },
  { id: "pedrobastos", nome: "Pedro Felipe Bastos", site: "https://pedrobastos.dev", vercel: "", github: "pedrobastosdev", repo: "pedrobastosdev.github.io", embeddable: true },
  { id: "evelyncosta", nome: "Evelyn Costa", site: "https://evelyncosta.dev", vercel: "https://portifolio-evelyn.vercel.app", github: "Evycostzocn", repo: "PortfolioProfissional", embeddable: true },
  { id: "armandosmoreira", nome: "Armando Moreira", site: "https://armandosmoreira.dev", vercel: "", github: "Armando-Schoenstatt", repo: "PortifolioDiaw", embeddable: true },
  { id: "dvdaurelio", nome: "David Aurélio", site: "https://dvdaurelio.dev", vercel: "https://davidaurelio-portfolio.vercel.app", github: "DavidAurelio07", repo: "Portfolio", embeddable: true },
  { id: "elidias", nome: "Eli Dias", site: "https://elidias.dev", vercel: "https://portfolio-6ssu7uldi-eli-portifolio.vercel.app", github: "elijuniordd", repo: "portfolio", embeddable: true },
  { id: "lukasgomes", nome: "Lucas Gomes", site: "https://lukasgomes.dev", vercel: "https://lukasgom3s.vercel.app", github: "LukasGom3s", repo: "LukasGomesPortfolio", embeddable: true },
  { id: "arthurgabriel", nome: "Arthur Gabriel", site: "https://arthurgabriel.dev", vercel: "https://arthur-portifolio-taupe.vercel.app", github: "arturity7", repo: "arthur-portifolio", embeddable: true },
  { id: "bernardoguedes", nome: "Bernardo Guedes", site: "https://bernardoguedes.dev", vercel: "https://bernardo-guedes-portfolio.vercel.app", github: "Bernardo-Guedes", repo: "portfolio", embeddable: true },
  { id: "diegoportella", nome: "Diego Portella", site: "https://diegoportella.dev", vercel: "https://diego-portella.vercel.app", github: "diegovitorportella", repo: "portifolio-profissional-dportella", embeddable: true },
  { id: "paulo-cesar", nome: "Paulo César", site: "https://paulo-cesar.dev", vercel: "https://paulocesar.vercel.app", github: "PauloCesar0709", repo: "portfolio-paulocesar", embeddable: true },
  { id: "victorcandido", nome: "Victor Cândido Leite", site: "https://victorcandido.dev", vercel: "https://portfolio-victor-j83rs02ki-victor-projects9.vercel.app", github: "thevictorcandido", repo: "portfolio-victor", embeddable: true },
  { id: "davisollar", nome: "Davi Sollar", site: "https://davisollar.me", vercel: "https://portfolio-mjzrt1s56-thehyper.vercel.app", github: "HyperSonic3608", repo: "portfolio", embeddable: true },
  { id: "engsoftmarcelo", nome: "Marcelo Gomes", site: "https://engsoftmarcelo.dev", vercel: "", github: "engsoftmarcelo", repo: "engsoftmarcelo", embeddable: false },
  { id: "arturbomtempo", nome: "Artur Bomtempo", site: "https://arturbomtempo.dev", vercel: "https://portfolio-eftfq7dp8-arturcolens-projects.vercel.app", github: "arturbomtempo-dev", repo: "portfolio", embeddable: false },
  { id: "warlleys", nome: "Warlley Silva", site: "https://warlleys.dev", vercel: "", github: "warlleyz", repo: "portfolio-warlley", embeddable: false },
  { id: "abneralmeida", nome: "Abner Almeida", site: "https://abneralmeida.dev", vercel: "https://abneralmeida-portfolio.vercel.app", github: "abneralmeidacord", repo: "abneralmeida-portfolio", embeddable: true },
  { id: "ryanferreira", nome: "Ryan Ferreira", site: "https://ryanferreira.dev", vercel: "https://ryanferreira.vercel.app", github: "ferreiraryan", repo: "portfolio", embeddable: true },
  { id: "fernandoleitepagani", nome: "Fernando Leite Pagani", site: "https://fernandoleitepagani.dev", vercel: "https://fernandoleitepagani-portfolio.vercel.app", github: "fernandoleitepagani", repo: "fernandoleitepagani-portfolio", embeddable: true },
  { id: "flausino", nome: "Pedro Flausino", site: "https://flausino.dev", vercel: "", github: "PedroFlau", repo: "pedroflausino-portifolio", embeddable: true },
  { id: "danielolv", nome: "Daniel Oliveira", site: "https://danielolv.dev", vercel: "https://portfolio-3d-three-chi.vercel.app", github: "Danielolv14", repo: "portfolio-3d", embeddable: true },
  { id: "presot", nome: "Guilherme Presot", site: "https://presot.dev", vercel: "https://portif-lio-presot.vercel.app", github: "gpresot", repo: "Portif-lio", embeddable: true },
  { id: "l4r1ss4cr4v0", nome: "Larissa Cravo", site: "https://l4r1ss4cr4v0.dev", vercel: "https://portifoliodev-73uuol4ix-larissa-cravos-projects.vercel.app", github: "L4r1ss4Cr4v0", repo: "Portifolio-Dev", embeddable: true },
  { id: "carolinasouza", nome: "Carolina Souza", site: "https://carolinasouza.dev", vercel: "https://portf-lio-profissional-seven.vercel.app", github: "Carolinasouza456", repo: "portf-lio-profissional", embeddable: true },
  { id: "matheuscamp", nome: "Matheus Campos", site: "https://matheuscamp.dev", vercel: "https://my-portfolio-navy-one-51.vercel.app", github: "Matheuscamp", repo: "MyPortfolio", embeddable: true },
  { id: "arthurdomingos", nome: "Arthur Domingos", site: "https://arthurdomingos.dev", vercel: "https://portfolio-rho-blond-nuvcwsmpx2.vercel.app", github: "thuzada", repo: "LAB1-DIW", embeddable: true },
  { id: "enzofernandesnz", nome: "Enzo Fernandes", site: "https://enzofernandesnz.dev", vercel: "https://portfolio-nz-ten.vercel.app", github: "enzofernandesnz", repo: "portfolio-nz", embeddable: true },
  { id: "samuelmatos", nome: "Samuel Matos", site: "https://samuelmatos.dev", vercel: "https://portfolio-matos6.vercel.app", github: "SamuelMatos78", repo: "portfolio", embeddable: true },
  { id: "arthurmoraes", nome: "Arthur Moraes", site: "https://arthurmoraes.dev", vercel: "https://portfolio-three-bay-64.vercel.app", github: "ArthurMoraesBraga", repo: "Portfolio", embeddable: true },
  { id: "franciscofilipeee", nome: "Francisco Filipe", site: "https://franciscofilipeee.dev", vercel: "https://portfolio-jszqm8so0-franciscofilipeees-projects.vercel.app", github: "franciscofilipeee", repo: "portfolio", embeddable: true },
  { id: "leopettersen", nome: "Leonardo Pettersen", site: "https://leopettersen.dev", vercel: "https://leopettersen.vercel.app", github: "leopettersen", repo: "portfolio", embeddable: true },
  { id: "sophiafernandes", nome: "Sophia Fernandes", site: "https://sophiafernandes.dev", vercel: "https://sophiafernandes-portfolio-mxdhsjtzt-sophia-f050.vercel.app", github: "sophiafernandesc", repo: "sophiafernandes-portfolio", embeddable: true },
  { id: "md101", nome: "Kelvin Mendes", site: "https://md101.dev", vercel: "https://portfolio-byqrbhn2v-md1o1s-projects.vercel.app", github: "Md1o1", repo: "portfolio", embeddable: true },
  { id: "joaomario", nome: "João Mário", site: "https://joaomario.dev", vercel: "", github: "joaomariofm", repo: "portfolio-website", embeddable: true },
  { id: "jprodrigues", nome: "João Paulo Rodrigues", site: "https://jprodrigues.me", vercel: "https://jprodrigues-nwc8w1uva-joaopauloferreirarodrigues.vercel.app", github: "joaopauloferreirarodrigues", repo: "jprodrigues.me", embeddable: true },
  { id: "leomartinsdev", nome: "Leonardo Martins", site: "https://leomartinsdev.me", vercel: "", github: "leomartinsdev", repo: "leomartinsdev.github.io", embeddable: true },
  { id: "kevenlino", nome: "Keven Lino", site: "https://kevenlino.me", vercel: "https://portfolio-a0sg66qub-tz-eb47.vercel.app", github: "Tuzfi", repo: "Portfolio", embeddable: true },
  { id: "lucasmaf", nome: "Lucas Mafia", site: "https://lucasmaf.ia.br", vercel: "https://meu-portfolio-chi-lilac.vercel.app", github: "lucasomafia", repo: "Meu-Portfolio", embeddable: true },
  { id: "emanuelphillipe", nome: "Emanuel Phillipe", site: "https://space.emanuelphillipe.com", vercel: "https://space-emanuel-gaosre0os.vercel.app", github: "emanuel-phillipe", repo: "space-emanuel", embeddable: true },
  { id: "gustavoryan", nome: "Gustavo Ryan Gomes Guedes", site: "https://www.gustavoryan.me", vercel: "https://gustavoryan.vercel.app", github: "gustavoryandev", repo: "Portfolio-Profissional-Interativo", embeddable: true },
  { id: "lucasdiasm", nome: "Lucas Dias Melo", site: "https://lucasdiasm.dev", vercel: "https://lucas-dias-dev.vercel.app", github: "lucasdiasmz", repo: "lucas-portfolio", embeddable: true },
  { id: "davirocha", nome: "Davi Campolina Rocha", site: "https://www.davirocha.dev", vercel: "https://diw-lab-1.vercel.app", github: "davicampolina", repo: "DIW-LAB1", embeddable: true },
  { id: "leticias", nome: "Leticia Abreu", site: "https://leticias.dev", vercel: "https://leticiaabreu.vercel.app", github: "xabreuleticia", repo: "portfolio-profissional", embeddable: true },
  { id: "sferreira", nome: "Samuel Ferreira", site: "https://sferreira.dev", vercel: "https://sferreira.vercel.app", github: "SamuelFerr0", repo: "SamuelFerreira_Portifolio", embeddable: true },
  { id: "joaodantas", nome: "João Pedro Dantas", site: "https://joaodantas.dev", vercel: "https://joaodantas.vercel.app", github: "joaodantas-eng", repo: "portfolio", embeddable: true },
  { id: "alexandreribeiro", nome: "Alexandre Sampaio Guimarães Ribeiro", site: "https://alexandreribeiro.dev", vercel: "https://alexandresampaio.vercel.app", github: "AlexandreSampaioGuimaraesRibeiro", repo: "Portfolio-front", embeddable: true },
];

export default PORTFOLIOS;
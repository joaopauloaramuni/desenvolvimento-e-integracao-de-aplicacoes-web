// Elenco do Atlético Mineiro na temporada 2026.
// As fotos ficam em public/jogadores/.
// O campo "situacao" indica a situação do jogador NESTE jogo:
//   'indicado' -> foi indicado ao prêmio de Craque do Jogo e pode receber votos
//   'suspenso' -> cumpriu suspensão e não entrou em campo (não pode receber votos)
//   'elenco'   -> demais jogadores do elenco (não podem receber votos)
// Atenção: o id de cada jogador é um TEXTO (ex.: 'fred'), e não um número.

const jogadores = [
  { id: 'gabriel-delfim', nome: 'Gabriel Delfim', numero: 1, posicao: 'GOL', foto: '/jogadores/gabriel-delfim.webp', situacao: 'elenco' },
  { id: 'everson', nome: 'Everson', numero: 22, posicao: 'GOL', foto: '/jogadores/everson.webp', situacao: 'indicado' },
  { id: 'robert-alves', nome: 'Robert Alves', numero: 31, posicao: 'GOL', foto: '/jogadores/robert-alves.webp', situacao: 'elenco' },
  { id: 'pedro-cobra', nome: 'Pedro Cobra', numero: 46, posicao: 'GOL', foto: '/jogadores/pedro-cobra.webp', situacao: 'elenco' },
  { id: 'leo-duarte', nome: 'Léo Duarte', numero: 3, posicao: 'ZAG', foto: '/jogadores/leo-duarte.webp', situacao: 'elenco' },
  { id: 'ruan', nome: 'Ruan', numero: 4, posicao: 'ZAG', foto: '/jogadores/ruan.webp', situacao: 'elenco' },
  { id: 'lyanco', nome: 'Lyanco', numero: 13, posicao: 'ZAG', foto: '/jogadores/lyanco.webp', situacao: 'suspenso' },
  { id: 'vitor-hugo', nome: 'Vitor Hugo', numero: 14, posicao: 'ZAG', foto: '/jogadores/vitor-hugo.webp', situacao: 'elenco' },
  { id: 'vitao', nome: 'Vitão', numero: 40, posicao: 'ZAG', foto: '/jogadores/vitao.webp', situacao: 'elenco' },
  { id: 'natanael', nome: 'Natanael', numero: 2, posicao: 'LD', foto: '/jogadores/natanael.webp', situacao: 'elenco' },
  { id: 'renan-lodi', nome: 'Renan Lodi', numero: 6, posicao: 'LE', foto: '/jogadores/renan-lodi.webp', situacao: 'indicado' },
  { id: 'angelo-preciado', nome: 'Ángelo Preciado', numero: 23, posicao: 'LD', foto: '/jogadores/angelo-preciado.webp', situacao: 'elenco' },
  { id: 'kaua-pascini', nome: 'Kauã Pascini', numero: 36, posicao: 'LE', foto: '/jogadores/kaua-pascini.webp', situacao: 'elenco' },
  { id: 'alexsander', nome: 'Alexsander', numero: 5, posicao: 'VOL', foto: '/jogadores/alexsander.webp', situacao: 'elenco' },
  { id: 'fred', nome: 'Fred', numero: 7, posicao: 'VOL', foto: '/jogadores/fred.webp', situacao: 'elenco' },
  { id: 'maycon', nome: 'Maycon', numero: 8, posicao: 'MC', foto: '/jogadores/maycon.webp', situacao: 'elenco' },
  { id: 'gustavo-scarpa', nome: 'Gustavo Scarpa', numero: 10, posicao: 'MEI', foto: '/jogadores/gustavo-scarpa.webp', situacao: 'indicado' },
  { id: 'bernard', nome: 'Bernard', numero: 11, posicao: 'MEI', foto: '/jogadores/bernard.webp', situacao: 'elenco' },
  { id: 'kevin-castano', nome: 'Kevin Castaño', numero: 15, posicao: 'VOL', foto: '/jogadores/kevin-castano.webp', situacao: 'elenco' },
  { id: 'igor-gomes', nome: 'Igor Gomes', numero: 17, posicao: 'MC', foto: '/jogadores/igor-gomes.webp', situacao: 'elenco' },
  { id: 'reinier', nome: 'Reinier', numero: 19, posicao: 'MEI', foto: '/jogadores/reinier.webp', situacao: 'elenco' },
  { id: 'alan-franco', nome: 'Alan Franco', numero: 21, posicao: 'VOL', foto: '/jogadores/alan-franco.webp', situacao: 'elenco' },
  { id: 'tomas-perez', nome: 'Tomás Pérez', numero: 25, posicao: 'MC', foto: '/jogadores/tomas-perez.webp', situacao: 'elenco' },
  { id: 'victor-hugo', nome: 'Victor Hugo', numero: 30, posicao: 'MEI', foto: '/jogadores/victor-hugo.webp', situacao: 'elenco' },
  { id: 'indio', nome: 'Índio', numero: 38, posicao: 'MC', foto: '/jogadores/indio.webp', situacao: 'elenco' },
  { id: 'cisse', nome: 'Cissé', numero: 39, posicao: 'VOL', foto: '/jogadores/cisse.webp', situacao: 'elenco' },
  { id: 'mateo-cassierra', nome: 'Mateo Cassierra', numero: 9, posicao: 'ATA', foto: '/jogadores/mateo-cassierra.webp', situacao: 'indicado' },
  { id: 'borbas', nome: 'Borbas', numero: 18, posicao: 'ATA', foto: '/jogadores/borbas.webp', situacao: 'elenco' },
  { id: 'alan-minda', nome: 'Alan Minda', numero: 27, posicao: 'PD', foto: '/jogadores/alan-minda.webp', situacao: 'elenco' },
  { id: 'caua-soares', nome: 'Cauã Soares', numero: 29, posicao: 'PE', foto: '/jogadores/caua-soares.webp', situacao: 'elenco' },
  { id: 'tomas-cuello', nome: 'Tomás Cuello', numero: 28, posicao: 'PE', foto: '/jogadores/tomas-cuello.webp', situacao: 'elenco' },
  { id: 'dudu', nome: 'Dudu', numero: 92, posicao: 'PE', foto: '/jogadores/dudu.webp', situacao: 'elenco' },
];

export default jogadores;

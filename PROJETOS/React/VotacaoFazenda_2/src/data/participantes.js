// Lista oficial de participantes de A Fazenda 2026 (temporada 18).
// As fotos ficam em public/participantes/.
// O campo "situacao" indica a situação do peão nesta semana:
//   'roca'       -> está na roça e pode receber votos para FICAR na fazenda
//   'fazendeiro' -> é o Fazendeiro da semana (está imune, não pode receber votos)
//   'peao'       -> está fora da roça (não pode receber votos)

const participantes = [
  { id: 1, nome: 'Adryana Ribeiro', foto: '/participantes/adryana-ribeiro.jpg', situacao: 'peao' },
  { id: 2, nome: 'Alfredo Amaral', foto: '/participantes/alfredo-amaral.jpg', situacao: 'peao' },
  { id: 3, nome: 'Ana Bruna Avila', foto: '/participantes/ana-bruna-avila.jpg', situacao: 'peao' },
  { id: 4, nome: 'Ariela Carasso', foto: '/participantes/ariela-carasso.jpg', situacao: 'peao' },
  { id: 5, nome: 'Catherine Bascoy', foto: '/participantes/catherine-bascoy.jpg', situacao: 'peao' },
  { id: 6, nome: 'Daniel Erthal', foto: '/participantes/daniel-erthal.jpg', situacao: 'peao' },
  { id: 7, nome: 'Darlin Ferrattry', foto: '/participantes/darlin-ferrattry.jpg', situacao: 'peao' },
  { id: 8, nome: 'Eduarda Braum', foto: '/participantes/eduarda-braum.jpg', situacao: 'peao' },
  { id: 9, nome: 'Fran Almeida', foto: '/participantes/fran-almeida.jpg', situacao: 'roca' },
  { id: 10, nome: 'Gabriel Torres', foto: '/participantes/gabriel-torres.jpg', situacao: 'peao' },
  { id: 11, nome: 'Giovanna Gold', foto: '/participantes/giovanna-gold.jpg', situacao: 'peao' },
  { id: 12, nome: 'Igor Monteiro', foto: '/participantes/igor-monteiro.jpg', situacao: 'roca' },
  { id: 13, nome: 'Jottapê', foto: '/participantes/jottape.jpg', situacao: 'peao' },
  { id: 14, nome: 'Jônatas Faro', foto: '/participantes/jonatas-faro.jpg', situacao: 'peao' },
  { id: 15, nome: 'Lucas Bissoli', foto: '/participantes/lucas-bissoli.jpg', situacao: 'fazendeiro' },
  { id: 16, nome: 'Maíra Charken', foto: '/participantes/maira-charken.jpg', situacao: 'peao' },
  { id: 17, nome: 'Mayk Leão', foto: '/participantes/mayk-leao.jpg', situacao: 'peao' },
  { id: 18, nome: 'Mônica Fonseca', foto: '/participantes/monica-fonseca.jpg', situacao: 'roca' },
  { id: 19, nome: 'Murilo Dias', foto: '/participantes/murilo-dias.jpg', situacao: 'peao' },
  { id: 20, nome: 'Renata del Bianco', foto: '/participantes/renata-del-bianco.jpg', situacao: 'peao' },
  { id: 21, nome: 'Renê Thristan', foto: '/participantes/rene-thristan.jpg', situacao: 'peao' },
  { id: 22, nome: 'Ricardo Negro', foto: '/participantes/ricardo-negro.jpg', situacao: 'roca' },
  { id: 23, nome: 'Sérgio Hondjakoff', foto: '/participantes/sergio-hondjakoff.jpg', situacao: 'peao' },
  { id: 24, nome: 'Stephanie Gomes', foto: '/participantes/stephanie-gomes.jpg', situacao: 'peao' },
  { id: 25, nome: 'Thaíde', foto: '/participantes/thaide.jpg', situacao: 'peao' },
  { id: 26, nome: 'Tina Calamba', foto: '/participantes/tina-calamba.jpg', situacao: 'peao' },
];

export default participantes;

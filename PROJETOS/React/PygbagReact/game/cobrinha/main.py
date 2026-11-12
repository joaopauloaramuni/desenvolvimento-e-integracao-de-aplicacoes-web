"""
Cobrinha - o clássico Snake feito com Pygame e empacotado com o pygbag.

Coma as maçãs para crescer. Não bata nas paredes nem no próprio corpo.
A cada 5 maçãs a cobrinha fica mais rápida.

Controles
    Setas / WASD .......... mudar a direção
    Deslizar o dedo ....... mudar a direção (celular)
    Toque / clique ........ vira para o lado do toque
    Espaço / Enter ........ começar e jogar de novo
    P ou Esc .............. pausar

O que muda em relação a um jogo Pygame "normal" (desktop):
    1. O arquivo precisa se chamar main.py.
    2. O laço principal fica dentro de uma função async.
    3. No fim de cada volta do laço vem `await asyncio.sleep(0)`:
       é ali que o navegador ganha a vez de desenhar a tela.
    4. Não use sys.exit() nem pygame.quit() para fechar: no navegador o jogo
       simplesmente continua rodando (volta para o menu).
O mesmo arquivo continua rodando no computador com `python main.py`.
"""

import asyncio
import random
import sys

import pygame

# ------------------------------------------------------------------ configuração
LARGURA, ALTURA = 640, 480
CELULA = 20                         # tamanho de cada quadradinho do tabuleiro
ALTURA_PLACAR = 40                  # faixa de cima com pontos e recorde
COLUNAS = LARGURA // CELULA         # 32
LINHAS = (ALTURA - ALTURA_PLACAR) // CELULA  # 22
FPS = 60

VELOCIDADE_INICIAL = 8              # passos por segundo
VELOCIDADE_MAXIMA = 20
MACAS_POR_NIVEL = 5

# Cores: a cobrinha é uma "python", com o azul e o amarelo do logo
COR_FUNDO = (14, 20, 44)
COR_CASA_A = (22, 30, 62)
COR_CASA_B = (26, 35, 70)
COR_PLACAR = (10, 14, 32)
COR_TEXTO = (236, 241, 255)
COR_TEXTO_SUAVE = (150, 162, 200)
COR_AZUL = (55, 118, 171)
COR_AZUL_ESCURO = (38, 84, 128)
COR_AMARELO = (255, 212, 59)
COR_MACA = (226, 72, 72)
COR_FOLHA = (90, 190, 110)

CIMA, BAIXO, ESQUERDA, DIREITA = (0, -1), (0, 1), (-1, 0), (1, 0)
TECLAS_DIRECAO = {
    pygame.K_UP: CIMA, pygame.K_w: CIMA,
    pygame.K_DOWN: BAIXO, pygame.K_s: BAIXO,
    pygame.K_LEFT: ESQUERDA, pygame.K_a: ESQUERDA,
    pygame.K_RIGHT: DIREITA, pygame.K_d: DIREITA,
}

NO_NAVEGADOR = sys.platform == "emscripten"  # True quando roda pelo pygbag

pygame.init()
tela = pygame.display.set_mode((LARGURA, ALTURA))
pygame.display.set_caption("Cobrinha")
relogio = pygame.time.Clock()

fonte_titulo = pygame.font.Font(None, 72)
fonte_media = pygame.font.Font(None, 34)
fonte_pequena = pygame.font.Font(None, 24)


# ------------------------------------------------------------------ desenho


def criar_tabuleiro():
    """Tabuleiro quadriculado, desenhado uma vez só (fica guardado numa Surface)."""
    fundo = pygame.Surface((LARGURA, ALTURA))
    fundo.fill(COR_FUNDO)
    pygame.draw.rect(fundo, COR_PLACAR, (0, 0, LARGURA, ALTURA_PLACAR))
    for linha in range(LINHAS):
        for coluna in range(COLUNAS):
            cor = COR_CASA_A if (linha + coluna) % 2 == 0 else COR_CASA_B
            pygame.draw.rect(fundo, cor, retangulo_da_casa((coluna, linha)))
    return fundo


def retangulo_da_casa(posicao):
    coluna, linha = posicao
    return pygame.Rect(coluna * CELULA, ALTURA_PLACAR + linha * CELULA, CELULA, CELULA)


def texto_centralizado(superficie, texto, fonte, cor, y):
    imagem = fonte.render(texto, True, cor)
    superficie.blit(imagem, imagem.get_rect(center=(LARGURA // 2, y)))


def desenhar_maca(superficie, posicao, tempo):
    r = retangulo_da_casa(posicao)
    pulso = 1 if int(tempo * 4) % 2 == 0 else 0  # a maçã "pulsa" de leve
    pygame.draw.circle(superficie, COR_MACA, (r.centerx, r.centery + 1), CELULA // 2 - 2 + pulso)
    pygame.draw.circle(superficie, (255, 150, 150), (r.centerx - 3, r.centery - 2), 2)
    pygame.draw.ellipse(superficie, COR_FOLHA, (r.centerx, r.top + 1, 7, 5))


# ------------------------------------------------------------------ a cobrinha


class Cobrinha:
    def __init__(self):
        meio = (COLUNAS // 2, LINHAS // 2)
        # corpo[0] é a cabeça
        self.corpo = [meio, (meio[0] - 1, meio[1]), (meio[0] - 2, meio[1])]
        self.direcao = DIREITA
        self.fila_de_direcoes = []  # guarda as teclas apertadas entre um passo e outro
        self.crescer = 0

    @property
    def cabeca(self):
        return self.corpo[0]

    def virar(self, nova):
        # compara com a última direção da fila (ou a atual), para não dar meia-volta
        ultima = self.fila_de_direcoes[-1] if self.fila_de_direcoes else self.direcao
        if nova == ultima or (nova[0] == -ultima[0] and nova[1] == -ultima[1]):
            return
        if len(self.fila_de_direcoes) < 3:
            self.fila_de_direcoes.append(nova)

    def proxima_cabeca(self):
        if self.fila_de_direcoes:
            self.direcao = self.fila_de_direcoes.pop(0)
        return (self.cabeca[0] + self.direcao[0], self.cabeca[1] + self.direcao[1])

    def andar(self, nova_cabeca):
        self.corpo.insert(0, nova_cabeca)
        if self.crescer > 0:
            self.crescer -= 1
        else:
            self.corpo.pop()

    def bateu(self, posicao):
        coluna, linha = posicao
        fora = not (0 <= coluna < COLUNAS and 0 <= linha < LINHAS)
        # a ponta do rabo sai do lugar neste passo, então não conta (a não ser que esteja crescendo)
        corpo = self.corpo if self.crescer else self.corpo[:-1]
        return fora or posicao in corpo

    def desenhar(self, superficie):
        # corpo: uma faixa contínua (liga cada parte à seguinte) com listras escuras
        for i in range(len(self.corpo) - 1, 0, -1):
            atual = retangulo_da_casa(self.corpo[i]).inflate(-4, -4)
            seguinte = retangulo_da_casa(self.corpo[i - 1]).inflate(-4, -4)
            pygame.draw.rect(superficie, COR_AZUL, atual.union(seguinte), border_radius=6)
        for i, parte in enumerate(self.corpo[1:], start=1):
            if i % 2 == 0:
                pygame.draw.circle(superficie, COR_AZUL_ESCURO, retangulo_da_casa(parte).center, 3)

        cabeca = retangulo_da_casa(self.cabeca).inflate(-1, -1)
        pygame.draw.rect(superficie, COR_AMARELO, cabeca, border_radius=7)
        # olhos olhando para a direção do movimento
        dx, dy = self.direcao
        for lado in (-1, 1):
            ox = cabeca.centerx + dx * 4 + (dy * 4 * lado)
            oy = cabeca.centery + dy * 4 + (dx * 4 * lado)
            pygame.draw.circle(superficie, (20, 24, 40), (ox, oy), 2)


# ------------------------------------------------------------------ o jogo


class Jogo:
    def __init__(self):
        self.tabuleiro = criar_tabuleiro()
        self.recorde = 0
        self.estado = "menu"  # menu -> jogando <-> pausa -> fim -> jogando ...
        self.tempo = 0.0
        self.toque_inicio = None
        self.reiniciar()

    def reiniciar(self):
        self.cobra = Cobrinha()
        self.pontos = 0
        self.acumulado = 0.0
        self.maca = self.sortear_maca()

    @property
    def velocidade(self):
        return min(VELOCIDADE_MAXIMA, VELOCIDADE_INICIAL + self.pontos // MACAS_POR_NIVEL)

    def sortear_maca(self):
        livres = [
            (c, l) for c in range(COLUNAS) for l in range(LINHAS) if (c, l) not in self.cobra.corpo
        ]
        return random.choice(livres)

    # ---------------- entrada
    def tratar_evento(self, evento):
        if evento.type == pygame.KEYDOWN:
            if evento.key in (pygame.K_SPACE, pygame.K_RETURN) and self.estado in ("menu", "fim"):
                self.comecar()
            elif evento.key in (pygame.K_p, pygame.K_ESCAPE):
                if self.estado == "jogando":
                    self.estado = "pausa"
                elif self.estado == "pausa":
                    self.estado = "jogando"
            elif evento.key in TECLAS_DIRECAO and self.estado == "jogando":
                self.cobra.virar(TECLAS_DIRECAO[evento.key])

        # no navegador, o toque na tela chega como evento de mouse
        elif evento.type == pygame.MOUSEBUTTONDOWN:
            self.toque_inicio = evento.pos
        elif evento.type == pygame.MOUSEBUTTONUP and self.toque_inicio:
            inicio, self.toque_inicio = self.toque_inicio, None
            if self.estado in ("menu", "fim"):
                self.comecar()
            elif self.estado == "pausa":
                self.estado = "jogando"
            else:
                self.tratar_toque(inicio, evento.pos)

    def tratar_toque(self, inicio, fim):
        dx, dy = fim[0] - inicio[0], fim[1] - inicio[1]
        if abs(dx) > 24 or abs(dy) > 24:
            # deslizou o dedo: vale a direção do movimento
            direcao = (1 if dx > 0 else -1, 0) if abs(dx) > abs(dy) else (0, 1 if dy > 0 else -1)
        else:
            # só tocou: a cobrinha vira para o lado do toque, em relação à cabeça
            cabeca = retangulo_da_casa(self.cobra.cabeca).center
            tx, ty = fim[0] - cabeca[0], fim[1] - cabeca[1]
            if self.cobra.direcao[0] != 0:  # andando na horizontal: vira para cima/baixo
                direcao = (0, 1 if ty > 0 else -1)
            else:                           # andando na vertical: vira para os lados
                direcao = (1 if tx > 0 else -1, 0)
        self.cobra.virar(direcao)

    def comecar(self):
        self.reiniciar()
        self.estado = "jogando"

    # ---------------- regras
    def atualizar(self, dt):
        self.tempo += dt
        if self.estado != "jogando":
            return

        # passo fixo: a cobrinha anda uma casa a cada 1/velocidade segundos,
        # não importa quantos quadros por segundo o navegador consegue desenhar
        self.acumulado += dt
        intervalo = 1 / self.velocidade
        while self.acumulado >= intervalo and self.estado == "jogando":
            self.acumulado -= intervalo
            self.passo()

    def passo(self):
        nova = self.cobra.proxima_cabeca()
        if self.cobra.bateu(nova):
            self.recorde = max(self.recorde, self.pontos)
            self.estado = "fim"
            return
        if nova == self.maca:
            self.pontos += 1
            self.cobra.crescer += 1
            self.cobra.andar(nova)
            self.maca = self.sortear_maca()
        else:
            self.cobra.andar(nova)

    # ---------------- desenho
    def desenhar(self, superficie):
        superficie.blit(self.tabuleiro, (0, 0))
        self.desenhar_placar(superficie)

        if self.estado == "menu":
            self.desenhar_menu(superficie)
            return

        desenhar_maca(superficie, self.maca, self.tempo)
        self.cobra.desenhar(superficie)

        if self.estado == "pausa":
            self.escurecer(superficie)
            texto_centralizado(superficie, "Pausado", fonte_titulo, COR_TEXTO, ALTURA // 2 - 10)
            texto_centralizado(superficie, "P, Esc ou toque para continuar", fonte_pequena, COR_TEXTO, ALTURA // 2 + 36)
        elif self.estado == "fim":
            self.escurecer(superficie)
            texto_centralizado(superficie, "Fim de jogo", fonte_titulo, COR_TEXTO, ALTURA // 2 - 50)
            texto_centralizado(superficie, f"{self.pontos} maçãs", fonte_media, COR_AMARELO, ALTURA // 2 + 4)
            texto_centralizado(superficie, f"Recorde: {self.recorde}", fonte_pequena, COR_TEXTO, ALTURA // 2 + 38)
            texto_centralizado(superficie, "Espaço ou toque para jogar de novo", fonte_pequena, COR_TEXTO, ALTURA // 2 + 84)

    def desenhar_menu(self, superficie):
        # uma cobrinha de enfeite que anda em círculo no menu
        passo = int(self.tempo * 8)
        enfeite = Cobrinha()
        trilha = [(12 + i, 6) for i in range(8)] + [(19, 6 + i) for i in range(1, 3)]
        trilha += [(19 - i, 8) for i in range(1, 8)] + [(12, 8 - i) for i in range(1, 2)]
        enfeite.corpo = [trilha[(passo - i) % len(trilha)] for i in range(7)]
        a, b = enfeite.corpo[0], enfeite.corpo[1]
        enfeite.direcao = (a[0] - b[0], a[1] - b[1])
        desenhar_maca(superficie, (21, 7), self.tempo)
        enfeite.desenhar(superficie)

        texto_centralizado(superficie, "Cobrinha", fonte_titulo, COR_TEXTO, 270)
        texto_centralizado(superficie, "Coma as maçãs e não bata nas paredes", fonte_pequena, COR_TEXTO_SUAVE, 310)
        if int(self.tempo * 2) % 2 == 0:
            texto_centralizado(superficie, "Espaço ou toque para começar", fonte_media, COR_AMARELO, 360)
        texto_centralizado(superficie, "Setas ou WASD mudam a direção  |  P pausa", fonte_pequena, COR_TEXTO_SUAVE, 404)
        onde = "no navegador (pygbag)" if NO_NAVEGADOR else "no computador (Python)"
        texto_centralizado(superficie, f"Rodando {onde}", fonte_pequena, (110, 122, 165), ALTURA - 20)

    def desenhar_placar(self, superficie):
        superficie.blit(fonte_media.render(f"Maçãs: {self.pontos}", True, COR_TEXTO), (16, 10))
        recorde = fonte_media.render(f"Recorde: {self.recorde}", True, COR_AMARELO)
        superficie.blit(recorde, recorde.get_rect(topright=(LARGURA - 16, 10)))

    @staticmethod
    def escurecer(superficie):
        sombra = pygame.Surface((LARGURA, ALTURA - ALTURA_PLACAR), pygame.SRCALPHA)
        sombra.fill((5, 8, 24, 175))
        superficie.blit(sombra, (0, ALTURA_PLACAR))


# ------------------------------------------------------------------ laço principal (async!)


async def main():
    jogo = Jogo()
    rodando = True

    while rodando:
        dt = relogio.tick(FPS) / 1000
        dt = min(dt, 0.1)  # evita vários passos de uma vez se a aba ficou parada

        for evento in pygame.event.get():
            if evento.type == pygame.QUIT:
                rodando = False  # no navegador este evento não acontece
            else:
                jogo.tratar_evento(evento)

        jogo.atualizar(dt)
        jogo.desenhar(tela)
        pygame.display.flip()

        await asyncio.sleep(0)  # OBRIGATÓRIO no pygbag: devolve o controle ao navegador

    pygame.quit()


asyncio.run(main())

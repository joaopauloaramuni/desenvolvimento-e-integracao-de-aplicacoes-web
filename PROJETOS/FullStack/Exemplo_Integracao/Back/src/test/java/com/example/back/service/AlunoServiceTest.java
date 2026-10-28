package com.example.back.service;

import com.example.back.exception.AlunoNaoEncontradoException;
import com.example.back.exception.DadosInvalidosException;
import com.example.back.model.Aluno;
import com.example.back.repository.AlunoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Testes unitários das regras de negócio do CRUD de alunos.
 * O AlunoRepository é simulado com Mockito: nenhum MongoDB é necessário.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AlunoService")
class AlunoServiceTest {

    @Mock
    private AlunoRepository alunoRepository;

    @InjectMocks
    private AlunoService alunoService;

    private Aluno alunoValido;

    @BeforeEach
    void setUp() {
        alunoValido = new Aluno(null, "Maria", "maria@sga.pucminas.br", "Engenharia de Software");
    }

    private static Aluno aluno(String id, String nome) {
        return new Aluno(id, nome, nome.toLowerCase() + "@sga.pucminas.br", "Engenharia de Software");
    }

    // ------------------------------------------------------------------
    @Nested
    @DisplayName("listar(nome)")
    class Listar {

        @Test
        @DisplayName("sem filtro: busca todos ordenados por nome")
        void semFiltro() {
            List<Aluno> todos = List.of(aluno("1", "Ana"), aluno("2", "Bruno"));
            when(alunoRepository.findAll(Sort.by("nome"))).thenReturn(todos);

            List<Aluno> resultado = alunoService.listar(null);

            assertEquals(todos, resultado);
            verify(alunoRepository).findAll(Sort.by("nome"));
            verifyNoMoreInteractions(alunoRepository);
        }

        @ParameterizedTest(name = "nome = \"{0}\" é ignorado")
        @ValueSource(strings = {"", "   ", "\t"})
        void filtroEmBranco(String nome) {
            when(alunoRepository.findAll(Sort.by("nome"))).thenReturn(List.of());

            alunoService.listar(nome);

            verify(alunoRepository).findAll(Sort.by("nome"));
            verifyNoMoreInteractions(alunoRepository);
        }

        @Test
        @DisplayName("com nome: busca por nome (com trim)")
        void comNome() {
            List<Aluno> esperado = List.of(aluno("1", "Ana"));
            when(alunoRepository.findByNomeContainingIgnoreCaseOrderByNomeAsc("ana")).thenReturn(esperado);

            List<Aluno> resultado = alunoService.listar("  ana  ");

            assertEquals(esperado, resultado);
            verify(alunoRepository).findByNomeContainingIgnoreCaseOrderByNomeAsc("ana");
            verifyNoMoreInteractions(alunoRepository);
        }
    }

    // ------------------------------------------------------------------
    @Nested
    @DisplayName("buscarPorId(id)")
    class BuscarPorId {

        @Test
        @DisplayName("devolve o aluno quando o id existe")
        void encontrado() {
            Aluno a = aluno("abc", "Maria");
            when(alunoRepository.findById("abc")).thenReturn(Optional.of(a));

            assertSame(a, alunoService.buscarPorId("abc"));
        }

        @Test
        @DisplayName("lança AlunoNaoEncontradoException quando o id não existe")
        void naoEncontrado() {
            when(alunoRepository.findById("xyz")).thenReturn(Optional.empty());

            AlunoNaoEncontradoException ex = assertThrows(AlunoNaoEncontradoException.class,
                    () -> alunoService.buscarPorId("xyz"));
            assertEquals("Aluno com id xyz não encontrado.", ex.getMessage());
        }
    }

    // ------------------------------------------------------------------
    @Nested
    @DisplayName("inserir(aluno)")
    class Inserir {

        @Test
        @DisplayName("salva um aluno válido e devolve o que o repositório retornou")
        void inserirValido() {
            Aluno salvo = new Aluno("novo-id", "Maria", "maria@sga.pucminas.br", "Engenharia de Software");
            when(alunoRepository.save(any(Aluno.class))).thenReturn(salvo);

            Aluno resultado = alunoService.inserir(alunoValido);

            assertSame(salvo, resultado);
            verify(alunoRepository).save(alunoValido);
        }

        @Test
        @DisplayName("ignora o id enviado: quem gera o id é o MongoDB")
        void zeraId() {
            alunoValido.setId("id-do-cliente");
            when(alunoRepository.save(any(Aluno.class))).thenAnswer(inv -> inv.getArgument(0));

            Aluno resultado = alunoService.inserir(alunoValido);

            assertNull(resultado.getId());
        }

        @Test
        @DisplayName("remove espaços dos textos e deixa o e-mail em minúsculas")
        void limpaCampos() {
            Aluno sujo = new Aluno(null, "  Maria Silva  ", "  Maria@SGA.PucMinas.br  ", "  Engenharia de Software  ");
            when(alunoRepository.save(any(Aluno.class))).thenAnswer(inv -> inv.getArgument(0));

            alunoService.inserir(sujo);

            ArgumentCaptor<Aluno> captor = ArgumentCaptor.forClass(Aluno.class);
            verify(alunoRepository).save(captor.capture());
            Aluno gravado = captor.getValue();

            assertEquals("Maria Silva", gravado.getNome());
            assertEquals("maria@sga.pucminas.br", gravado.getEmail());
            assertEquals("Engenharia de Software", gravado.getCurso());
        }

        @Test
        @DisplayName("curso nulo vira texto vazio")
        void cursoNulo() {
            alunoValido.setCurso(null);
            when(alunoRepository.save(any(Aluno.class))).thenAnswer(inv -> inv.getArgument(0));

            assertEquals("", alunoService.inserir(alunoValido).getCurso());
        }

        @Test
        @DisplayName("curso só com espaços vira texto vazio (curso é opcional)")
        void cursoEmBranco() {
            alunoValido.setCurso("   ");
            when(alunoRepository.save(any(Aluno.class))).thenAnswer(inv -> inv.getArgument(0));

            assertEquals("", alunoService.inserir(alunoValido).getCurso());
        }

        @ParameterizedTest(name = "e-mail \"{0}\" é aceito")
        @ValueSource(strings = {"maria@sga.pucminas.br", "a@b.c", "joao.silva+aula@gmail.com", "  ana@puc.br  "})
        void emailsValidos(String email) {
            alunoValido.setEmail(email);
            when(alunoRepository.save(any(Aluno.class))).thenAnswer(inv -> inv.getArgument(0));

            assertEquals(email.trim().toLowerCase(), alunoService.inserir(alunoValido).getEmail());
        }
    }

    // ------------------------------------------------------------------
    @Nested
    @DisplayName("validação (400 - DadosInvalidosException)")
    class Validacao {

        private void assertInvalido(Aluno aluno, String mensagemEsperada) {
            DadosInvalidosException ex = assertThrows(DadosInvalidosException.class,
                    () -> alunoService.inserir(aluno));
            assertEquals(mensagemEsperada, ex.getMessage());
            verify(alunoRepository, never()).save(any());
        }

        @Test
        @DisplayName("aluno nulo")
        void alunoNulo() {
            assertInvalido(null, "Envie os dados do aluno no corpo da requisição.");
        }

        @ParameterizedTest(name = "nome = \"{0}\"")
        @NullAndEmptySource
        @ValueSource(strings = {"   ", "\t"})
        void nomeObrigatorio(String nome) {
            alunoValido.setNome(nome);
            assertInvalido(alunoValido, "O nome do aluno é obrigatório.");
        }

        @ParameterizedTest(name = "e-mail = \"{0}\"")
        @NullAndEmptySource
        @ValueSource(strings = {"   ", "\t"})
        void emailObrigatorio(String email) {
            alunoValido.setEmail(email);
            assertInvalido(alunoValido, "O e-mail do aluno é obrigatório.");
        }

        @ParameterizedTest(name = "e-mail inválido = \"{0}\"")
        @ValueSource(strings = {"maria", "maria@", "@sga.pucminas.br", "maria@pucminas",
                "maria@@puc.br", "maria silva@puc.br", "maria@puc .br"})
        void emailInvalido(String email) {
            alunoValido.setEmail(email);
            assertInvalido(alunoValido, "Informe um e-mail válido (ex.: maria@sga.pucminas.br).");
        }

        @Test
        @DisplayName("o nome é validado antes do e-mail")
        void ordemDaValidacao() {
            Aluno vazio = new Aluno(null, "", "", "");
            assertInvalido(vazio, "O nome do aluno é obrigatório.");
        }
    }

    // ------------------------------------------------------------------
    @Nested
    @DisplayName("atualizar(id, dados)")
    class Atualizar {

        @Test
        @DisplayName("copia os dados para o aluno existente, mantém o id e salva")
        void atualizaExistente() {
            Aluno existente = new Aluno("abc", "Antigo", "antigo@puc.br", "Antigo curso");
            Aluno dados = new Aluno("outro-id", "  Maria  ", "  MARIA@PUC.BR ", " Ciência da Computação ");
            when(alunoRepository.findById("abc")).thenReturn(Optional.of(existente));
            when(alunoRepository.save(any(Aluno.class))).thenAnswer(inv -> inv.getArgument(0));

            Aluno resultado = alunoService.atualizar("abc", dados);

            assertSame(existente, resultado);
            assertEquals("abc", resultado.getId());
            assertEquals("Maria", resultado.getNome());
            assertEquals("maria@puc.br", resultado.getEmail());
            assertEquals("Ciência da Computação", resultado.getCurso());
            verify(alunoRepository).save(existente);
        }

        @Test
        @DisplayName("curso nulo nos dados vira texto vazio")
        void cursoNulo() {
            Aluno existente = new Aluno("abc", "Antigo", "antigo@puc.br", "Antigo curso");
            when(alunoRepository.findById("abc")).thenReturn(Optional.of(existente));
            when(alunoRepository.save(any(Aluno.class))).thenAnswer(inv -> inv.getArgument(0));
            alunoValido.setCurso(null);

            assertEquals("", alunoService.atualizar("abc", alunoValido).getCurso());
        }

        @Test
        @DisplayName("lança 404 quando o id não existe e não salva nada")
        void naoEncontrado() {
            when(alunoRepository.findById("xyz")).thenReturn(Optional.empty());

            assertThrows(AlunoNaoEncontradoException.class,
                    () -> alunoService.atualizar("xyz", alunoValido));
            verify(alunoRepository, never()).save(any());
        }

        @Test
        @DisplayName("lança 400 quando os dados são inválidos e não altera o existente")
        void dadosInvalidos() {
            Aluno existente = new Aluno("abc", "Antigo", "antigo@puc.br", "Antigo curso");
            when(alunoRepository.findById("abc")).thenReturn(Optional.of(existente));
            alunoValido.setEmail("email-invalido");

            assertThrows(DadosInvalidosException.class, () -> alunoService.atualizar("abc", alunoValido));

            assertEquals("Antigo", existente.getNome());
            assertEquals("antigo@puc.br", existente.getEmail());
            verify(alunoRepository, never()).save(any());
        }

        @Test
        @DisplayName("lança 400 quando o corpo é nulo")
        void corpoNulo() {
            when(alunoRepository.findById("abc")).thenReturn(Optional.of(aluno("abc", "X")));

            assertThrows(DadosInvalidosException.class, () -> alunoService.atualizar("abc", null));
            verify(alunoRepository, never()).save(any());
        }
    }

    // ------------------------------------------------------------------
    @Nested
    @DisplayName("excluir(id)")
    class Excluir {

        @Test
        @DisplayName("exclui quando o id existe")
        void excluiExistente() {
            when(alunoRepository.existsById("abc")).thenReturn(true);

            alunoService.excluir("abc");

            verify(alunoRepository).deleteById("abc");
        }

        @Test
        @DisplayName("lança 404 quando o id não existe e não chama deleteById")
        void naoEncontrado() {
            when(alunoRepository.existsById("xyz")).thenReturn(false);

            AlunoNaoEncontradoException ex = assertThrows(AlunoNaoEncontradoException.class,
                    () -> alunoService.excluir("xyz"));
            assertTrue(ex.getMessage().contains("xyz"));
            verify(alunoRepository, never()).deleteById(anyString());
        }
    }
}

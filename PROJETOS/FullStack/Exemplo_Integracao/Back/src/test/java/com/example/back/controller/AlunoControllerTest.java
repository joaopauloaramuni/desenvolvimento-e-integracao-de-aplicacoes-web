package com.example.back.controller;

import com.example.back.exception.AlunoNaoEncontradoException;
import com.example.back.exception.DadosInvalidosException;
import com.example.back.exception.GlobalExceptionHandler;
import com.example.back.model.Aluno;
import com.example.back.service.AlunoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Testa os endpoints REST de /api/alunos com MockMvc em modo "standalone":
 * sem subir o contexto do Spring e sem MongoDB. O AlunoService é um mock do Mockito
 * e o GlobalExceptionHandler é registrado para conferir os códigos HTTP de erro.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AlunoController")
class AlunoControllerTest {

    private static final String URL = "/api/alunos";

    @Mock
    private AlunoService alunoService;

    @InjectMocks
    private AlunoController alunoController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(alunoController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .defaultResponseCharacterEncoding(StandardCharsets.UTF_8)
                .build();
    }

    private static Aluno maria() {
        return new Aluno("1", "Maria", "maria@sga.pucminas.br", "Engenharia de Software");
    }

    private static Aluno joao() {
        return new Aluno("2", "João", "joao@sga.pucminas.br", "Ciência da Computação");
    }

    private static final String JSON_VALIDO = """
            {
              "nome": "Maria",
              "email": "maria@sga.pucminas.br",
              "curso": "Engenharia de Software"
            }
            """;

    // ------------------------------------------------------------------
    @Nested
    @DisplayName("GET /api/alunos")
    class Listar {

        @Test
        @DisplayName("200 com a lista de alunos (sem filtro)")
        void listarTodos() throws Exception {
            when(alunoService.listar(null)).thenReturn(List.of(joao(), maria()));

            mockMvc.perform(get(URL))
                    .andExpect(status().isOk())
                    .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$", hasSize(2)))
                    .andExpect(jsonPath("$[0].id").value("2"))
                    .andExpect(jsonPath("$[0].nome").value("João"))
                    .andExpect(jsonPath("$[0].email").value("joao@sga.pucminas.br"))
                    .andExpect(jsonPath("$[0].curso").value("Ciência da Computação"))
                    .andExpect(jsonPath("$[1].nome").value("Maria"));

            verify(alunoService).listar(null);
        }

        @Test
        @DisplayName("repassa o filtro nome ao service")
        void listarComFiltro() throws Exception {
            when(alunoService.listar("mar")).thenReturn(List.of(maria()));

            mockMvc.perform(get(URL).param("nome", "mar"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)))
                    .andExpect(jsonPath("$[0].nome").value("Maria"));

            verify(alunoService).listar("mar");
        }

        @Test
        @DisplayName("200 com lista vazia")
        void listaVazia() throws Exception {
            when(alunoService.listar(any())).thenReturn(List.of());

            mockMvc.perform(get(URL))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(0)));
        }

        @Test
        @DisplayName("503 quando o MongoDB está indisponível")
        void mongoIndisponivel() throws Exception {
            when(alunoService.listar(any()))
                    .thenThrow(new DataAccessResourceFailureException("timeout"));

            mockMvc.perform(get(URL))
                    .andExpect(status().isServiceUnavailable())
                    .andExpect(jsonPath("$.status").value(503))
                    .andExpect(jsonPath("$.caminho").value(URL))
                    .andExpect(jsonPath("$.mensagem").value(
                            "Não foi possível conectar ao MongoDB Atlas. Confira a connection string no "
                                    + "application.properties e o Network Access do Atlas."));
        }
    }

    // ------------------------------------------------------------------
    @Nested
    @DisplayName("GET /api/alunos/{id}")
    class BuscarPorId {

        @Test
        @DisplayName("200 com o aluno")
        void encontrado() throws Exception {
            when(alunoService.buscarPorId("1")).thenReturn(maria());

            mockMvc.perform(get(URL + "/1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value("1"))
                    .andExpect(jsonPath("$.nome").value("Maria"))
                    .andExpect(jsonPath("$.email").value("maria@sga.pucminas.br"))
                    .andExpect(jsonPath("$.curso").value("Engenharia de Software"));
        }

        @Test
        @DisplayName("404 com ErroResposta quando não existe")
        void naoEncontrado() throws Exception {
            when(alunoService.buscarPorId("999")).thenThrow(new AlunoNaoEncontradoException("999"));

            mockMvc.perform(get(URL + "/999"))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404))
                    .andExpect(jsonPath("$.erro").value("Not Found"))
                    .andExpect(jsonPath("$.mensagem").value("Aluno com id 999 não encontrado."))
                    .andExpect(jsonPath("$.caminho").value(URL + "/999"))
                    .andExpect(jsonPath("$.timestamp", notNullValue()));
        }
    }

    // ------------------------------------------------------------------
    @Nested
    @DisplayName("POST /api/alunos")
    class Inserir {

        @Test
        @DisplayName("201 com o aluno criado")
        void criado() throws Exception {
            when(alunoService.inserir(any(Aluno.class))).thenReturn(maria());

            mockMvc.perform(post(URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .characterEncoding(StandardCharsets.UTF_8)
                            .content(JSON_VALIDO))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value("1"))
                    .andExpect(jsonPath("$.nome").value("Maria"));
        }

        @Test
        @DisplayName("converte o JSON do corpo em Aluno")
        void converteCorpo() throws Exception {
            when(alunoService.inserir(any(Aluno.class))).thenReturn(maria());

            mockMvc.perform(post(URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .characterEncoding(StandardCharsets.UTF_8)
                            .content(JSON_VALIDO))
                    .andExpect(status().isCreated());

            ArgumentCaptor<Aluno> captor = ArgumentCaptor.forClass(Aluno.class);
            verify(alunoService).inserir(captor.capture());
            Aluno recebido = captor.getValue();
            assertNull(recebido.getId());
            assertEquals("Maria", recebido.getNome());
            assertEquals("maria@sga.pucminas.br", recebido.getEmail());
            assertEquals("Engenharia de Software", recebido.getCurso());
        }

        @Test
        @DisplayName("aceita JSON sem o campo curso (fica nulo)")
        void semCurso() throws Exception {
            when(alunoService.inserir(any(Aluno.class))).thenReturn(maria());

            mockMvc.perform(post(URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .characterEncoding(StandardCharsets.UTF_8)
                            .content("{\"nome\":\"Maria\",\"email\":\"maria@sga.pucminas.br\"}"))
                    .andExpect(status().isCreated());

            ArgumentCaptor<Aluno> captor = ArgumentCaptor.forClass(Aluno.class);
            verify(alunoService).inserir(captor.capture());
            assertNull(captor.getValue().getCurso());
        }

        @Test
        @DisplayName("400 quando o service rejeita os dados")
        void dadosInvalidos() throws Exception {
            when(alunoService.inserir(any(Aluno.class)))
                    .thenThrow(new DadosInvalidosException("O nome do aluno é obrigatório."));

            mockMvc.perform(post(URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .characterEncoding(StandardCharsets.UTF_8)
                            .content("{\"nome\":\"\",\"email\":\"maria@sga.pucminas.br\"}"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400))
                    .andExpect(jsonPath("$.erro").value("Bad Request"))
                    .andExpect(jsonPath("$.mensagem").value("O nome do aluno é obrigatório."))
                    .andExpect(jsonPath("$.caminho").value(URL));
        }

        @Test
        @DisplayName("400 quando o corpo não é um JSON válido (service não é chamado)")
        void jsonInvalido() throws Exception {
            mockMvc.perform(post(URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .characterEncoding(StandardCharsets.UTF_8)
                            .content("{ isso não é json"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.mensagem").value("O corpo da requisição não é um JSON válido."));

            verifyNoInteractions(alunoService);
        }

        @Test
        @DisplayName("400 quando o corpo está vazio (service não é chamado)")
        void corpoVazio() throws Exception {
            mockMvc.perform(post(URL).contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.mensagem").value("O corpo da requisição não é um JSON válido."));

            verifyNoInteractions(alunoService);
        }
    }

    // ------------------------------------------------------------------
    @Nested
    @DisplayName("PUT /api/alunos/{id}")
    class Atualizar {

        @Test
        @DisplayName("200 com o aluno atualizado")
        void atualizado() throws Exception {
            Aluno atualizado = new Aluno("1", "Maria Silva", "maria.silva@sga.pucminas.br", "Sistemas de Informação");
            when(alunoService.atualizar(eq("1"), any(Aluno.class))).thenReturn(atualizado);

            mockMvc.perform(put(URL + "/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .characterEncoding(StandardCharsets.UTF_8)
                            .content("{\"nome\":\"Maria Silva\",\"email\":\"maria.silva@sga.pucminas.br\","
                                    + "\"curso\":\"Sistemas de Informação\"}"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value("1"))
                    .andExpect(jsonPath("$.nome").value("Maria Silva"))
                    .andExpect(jsonPath("$.email").value("maria.silva@sga.pucminas.br"))
                    .andExpect(jsonPath("$.curso").value("Sistemas de Informação"));

            ArgumentCaptor<Aluno> captor = ArgumentCaptor.forClass(Aluno.class);
            verify(alunoService).atualizar(eq("1"), captor.capture());
            assertEquals("Maria Silva", captor.getValue().getNome());
        }

        @Test
        @DisplayName("404 quando o id não existe")
        void naoEncontrado() throws Exception {
            when(alunoService.atualizar(eq("999"), any(Aluno.class)))
                    .thenThrow(new AlunoNaoEncontradoException("999"));

            mockMvc.perform(put(URL + "/999")
                            .contentType(MediaType.APPLICATION_JSON)
                            .characterEncoding(StandardCharsets.UTF_8)
                            .content(JSON_VALIDO))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.mensagem").value("Aluno com id 999 não encontrado."));
        }

        @Test
        @DisplayName("400 quando os dados são inválidos")
        void dadosInvalidos() throws Exception {
            when(alunoService.atualizar(eq("1"), any(Aluno.class)))
                    .thenThrow(new DadosInvalidosException("Informe um e-mail válido (ex.: maria@sga.pucminas.br)."));

            mockMvc.perform(put(URL + "/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .characterEncoding(StandardCharsets.UTF_8)
                            .content("{\"nome\":\"Maria\",\"email\":\"maria\"}"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.mensagem").value("Informe um e-mail válido (ex.: maria@sga.pucminas.br)."));
        }
    }

    // ------------------------------------------------------------------
    @Nested
    @DisplayName("DELETE /api/alunos/{id}")
    class Excluir {

        @Test
        @DisplayName("204 sem corpo quando exclui")
        void excluido() throws Exception {
            doNothing().when(alunoService).excluir("1");

            mockMvc.perform(delete(URL + "/1"))
                    .andExpect(status().isNoContent())
                    .andExpect(content().string(""));

            verify(alunoService).excluir("1");
        }

        @Test
        @DisplayName("404 quando o id não existe")
        void naoEncontrado() throws Exception {
            doThrow(new AlunoNaoEncontradoException("999")).when(alunoService).excluir("999");

            mockMvc.perform(delete(URL + "/999"))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404));
        }
    }

    // ------------------------------------------------------------------
    @Nested
    @DisplayName("Erros genéricos")
    class ErrosGenericos {

        @Test
        @DisplayName("405 para método HTTP não suportado")
        void metodoNaoPermitido() throws Exception {
            mockMvc.perform(patch(URL))
                    .andExpect(status().isMethodNotAllowed())
                    .andExpect(jsonPath("$.status").value(405))
                    .andExpect(jsonPath("$.mensagem").value("Método PATCH não é permitido neste endpoint."));

            verifyNoInteractions(alunoService);
        }

        @Test
        @DisplayName("500 para erro inesperado")
        void erroInesperado() throws Exception {
            when(alunoService.buscarPorId("1")).thenThrow(new IllegalStateException("bug"));

            mockMvc.perform(get(URL + "/1"))
                    .andExpect(status().isInternalServerError())
                    .andExpect(jsonPath("$.status").value(500))
                    .andExpect(jsonPath("$.mensagem").value("Erro interno no servidor."));
        }
    }

    // ------------------------------------------------------------------
    @Nested
    @DisplayName("Chamada direta (sem MockMvc)")
    class ChamadaDireta {

        @Test
        @DisplayName("inserir devolve ResponseEntity 201")
        void inserir() {
            Aluno a = maria();
            when(alunoService.inserir(a)).thenReturn(a);

            var resposta = alunoController.inserir(a);

            assertEquals(201, resposta.getStatusCode().value());
            assertSame(a, resposta.getBody());
        }

        @Test
        @DisplayName("excluir devolve ResponseEntity 204 sem corpo")
        void excluir() {
            var resposta = alunoController.excluir("1");

            assertEquals(204, resposta.getStatusCode().value());
            assertNull(resposta.getBody());
            verify(alunoService).excluir("1");
        }
    }
}

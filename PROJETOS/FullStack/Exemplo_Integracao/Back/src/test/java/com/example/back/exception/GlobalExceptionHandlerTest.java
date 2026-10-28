package com.example.back.exception;

import com.mongodb.MongoException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

/**
 * Chama cada @ExceptionHandler diretamente e confere o código HTTP
 * e o corpo (ErroResposta) devolvido ao front-end.
 */
@DisplayName("GlobalExceptionHandler")
class GlobalExceptionHandlerTest {

    private static final String MSG_MONGO = "Não foi possível conectar ao MongoDB Atlas. Confira a connection string no "
            + "application.properties e o Network Access do Atlas.";

    private GlobalExceptionHandler handler;
    private MockHttpServletRequest request;

    @BeforeEach
    void setUp() {
        handler = new GlobalExceptionHandler();
        request = new MockHttpServletRequest("GET", "/api/alunos/123");
    }

    private static void assertErro(ResponseEntity<ErroResposta> resposta, HttpStatus status,
                                   String mensagem, String caminho) {
        assertEquals(status, resposta.getStatusCode());
        ErroResposta corpo = resposta.getBody();
        assertNotNull(corpo);
        assertEquals(status.value(), corpo.getStatus());
        assertEquals(status.getReasonPhrase(), corpo.getErro());
        assertEquals(mensagem, corpo.getMensagem());
        assertEquals(caminho, corpo.getCaminho());
        assertNotNull(corpo.getTimestamp());
    }

    @Test
    @DisplayName("AlunoNaoEncontradoException -> 404")
    void naoEncontrado() {
        var resposta = handler.handleNaoEncontrado(new AlunoNaoEncontradoException("123"), request);

        assertErro(resposta, HttpStatus.NOT_FOUND, "Aluno com id 123 não encontrado.", "/api/alunos/123");
    }

    @Test
    @DisplayName("DadosInvalidosException -> 400 com a mensagem da exceção")
    void dadosInvalidos() {
        var resposta = handler.handleDadosInvalidos(
                new DadosInvalidosException("O nome do aluno é obrigatório."), request);

        assertErro(resposta, HttpStatus.BAD_REQUEST, "O nome do aluno é obrigatório.", "/api/alunos/123");
    }

    @Test
    @DisplayName("HttpMessageNotReadableException -> 400 com mensagem fixa")
    void jsonInvalido() {
        var resposta = handler.handleJsonInvalido(mock(HttpMessageNotReadableException.class), request);

        assertErro(resposta, HttpStatus.BAD_REQUEST,
                "O corpo da requisição não é um JSON válido.", "/api/alunos/123");
    }

    @Test
    @DisplayName("NoResourceFoundException -> 404 'Endpoint não encontrado.'")
    void rotaInexistente() {
        request.setRequestURI("/api/alunoz");

        var resposta = handler.handleRotaInexistente(mock(NoResourceFoundException.class), request);

        assertErro(resposta, HttpStatus.NOT_FOUND, "Endpoint não encontrado.", "/api/alunoz");
    }

    @Test
    @DisplayName("HttpRequestMethodNotSupportedException -> 405 citando o método")
    void metodoNaoPermitido() {
        var resposta = handler.handleMetodo(new HttpRequestMethodNotSupportedException("PATCH"), request);

        assertErro(resposta, HttpStatus.METHOD_NOT_ALLOWED,
                "Método PATCH não é permitido neste endpoint.", "/api/alunos/123");
    }

    @Test
    @DisplayName("DataAccessResourceFailureException -> 503")
    void mongoIndisponivelSpring() {
        var resposta = handler.handleMongoIndisponivel(
                new DataAccessResourceFailureException("timeout"), request);

        assertErro(resposta, HttpStatus.SERVICE_UNAVAILABLE, MSG_MONGO, "/api/alunos/123");
    }

    @Test
    @DisplayName("MongoException -> 503")
    void mongoIndisponivelDriver() {
        var resposta = handler.handleMongoIndisponivel(new MongoException("timeout"), request);

        assertErro(resposta, HttpStatus.SERVICE_UNAVAILABLE, MSG_MONGO, "/api/alunos/123");
    }

    @Test
    @DisplayName("qualquer outra exceção -> 500 sem expor detalhes")
    void generico() {
        var resposta = handler.handleGenerico(new RuntimeException("detalhe interno secreto"), request);

        assertErro(resposta, HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno no servidor.", "/api/alunos/123");
        assertFalse(resposta.getBody().getMensagem().contains("secreto"));
    }

    @Test
    @DisplayName("ErroResposta guarda os campos e gera um timestamp ISO válido")
    void erroResposta() {
        LocalDateTime antes = LocalDateTime.now();
        ErroResposta erro = new ErroResposta(404, "Not Found", "mensagem", "/caminho");
        LocalDateTime depois = LocalDateTime.now();

        assertEquals(404, erro.getStatus());
        assertEquals("Not Found", erro.getErro());
        assertEquals("mensagem", erro.getMensagem());
        assertEquals("/caminho", erro.getCaminho());

        LocalDateTime gerado = LocalDateTime.parse(erro.getTimestamp());
        assertFalse(gerado.isBefore(antes));
        assertFalse(gerado.isAfter(depois));
    }

    @Test
    @DisplayName("exceções de negócio são RuntimeException e carregam a mensagem")
    void excecoesDeNegocio() {
        RuntimeException naoEncontrado = new AlunoNaoEncontradoException("abc");
        RuntimeException invalido = new DadosInvalidosException("inválido");

        assertEquals("Aluno com id abc não encontrado.", naoEncontrado.getMessage());
        assertEquals("inválido", invalido.getMessage());
    }
}

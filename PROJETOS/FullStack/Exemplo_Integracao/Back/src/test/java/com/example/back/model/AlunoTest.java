package com.example.back.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Modelo: Aluno")
class AlunoTest {

    @Test
    @DisplayName("construtor vazio: todos os campos começam nulos")
    void construtorVazio() {
        Aluno a = new Aluno();

        assertNull(a.getId());
        assertNull(a.getNome());
        assertNull(a.getEmail());
        assertNull(a.getCurso());
    }

    @Test
    @DisplayName("construtor completo preenche todos os campos")
    void construtorCompleto() {
        Aluno a = new Aluno("1", "Maria", "maria@sga.pucminas.br", "Engenharia de Software");

        assertEquals("1", a.getId());
        assertEquals("Maria", a.getNome());
        assertEquals("maria@sga.pucminas.br", a.getEmail());
        assertEquals("Engenharia de Software", a.getCurso());
    }

    @Test
    @DisplayName("setters alteram os campos")
    void setters() {
        Aluno a = new Aluno();
        a.setId("2");
        a.setNome("João");
        a.setEmail("joao@sga.pucminas.br");
        a.setCurso("Ciência da Computação");

        assertEquals("2", a.getId());
        assertEquals("João", a.getNome());
        assertEquals("joao@sga.pucminas.br", a.getEmail());
        assertEquals("Ciência da Computação", a.getCurso());
    }
}

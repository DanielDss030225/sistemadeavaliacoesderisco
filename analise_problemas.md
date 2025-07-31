# Análise dos Problemas Identificados

## Problema 1: Questão 15 - Acesso a Armas
**Localização:** formulario.html (linha ~2730) e avRisco.html (linha ~540)

**Problema:** As opções não estão sendo preenchidas corretamente.

**Análise do código:**
- No formulario.html, a questão 15 usa radio buttons com name="acessoArma"
- No avRisco.html, os checkboxes têm IDs como "acessoArma_sim-usou", "acessoArma_sim-ameacou", etc.
- No avRisco.js, o código tenta marcar checkboxes baseado em um array, mas o formulario.html usa radio buttons

**Problema identificado:** 
- O formulario.html coleta dados como radio button (valor único)
- O avRisco.js tenta processar como array de valores
- Incompatibilidade entre a coleta e o processamento dos dados

## Problema 2: Questão 5 - Agressões Patrimoniais
**Localização:** formulario.html (linha ~1850) e avRisco.html (linha ~380)

**Problemas:**
a. O campo "Nenhuma agressão patrimonial" não está sendo preenchido corretamente
b. O campo "Outra(s): " não está preenchido corretamente

**Análise do código:**
- No formulario.html, usa checkboxes com name="agressaoPatrimonial"
- Tem checkbox com value="nenhuma-agressao-patrimonial" 
- Tem campo de texto para "outrasAgressoesPatrimoniais"
- No avRisco.html, tem checkbox com id="agressaoPatrimonial_nenhuma" (diferente do value)
- Tem checkbox com id="agressaoPatrimonial_outras" mas sem campo de texto associado

**Problemas identificados:**
- Inconsistência nos valores/IDs entre formulario.html e avRisco.html
- Campo "Outra(s): " não está sendo processado corretamente no avRisco.js


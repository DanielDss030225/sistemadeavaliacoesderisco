// Configuração do Firebase
import { firebaseConfig } from './firebaseConfig.js';


// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener("DOMContentLoaded", function() {
    // Obter ID da URL
    const urlParams = new URLSearchParams(window.location.search);
    const avaliacaoId = urlParams.get('id');
    
    if (avaliacaoId) {
        console.log("ID da avaliação recebido:", avaliacaoId);
        buscarDadosFirebase(avaliacaoId);
    } else {
        console.log("Nenhum ID fornecido na URL");
        alert("ID da avaliação não fornecido. Redirecionando para a página anterior.");
        window.location.href = "index.html";
    }
});

function buscarDadosFirebase(avaliacaoId) {
    // Buscar no Firebase por ID específico
    const avaliacaoRef = database.ref(`avaliacoes/${avaliacaoId}`);
    
    avaliacaoRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
            const dados = snapshot.val();
            console.log("Dados encontrados:", dados);
            preencherFormulario(dados);
        } else {
            console.log("Nenhum dado encontrado para o ID:", avaliacaoId);
            alert("Nenhuma avaliação encontrada para este ID.");
            window.location.href = "index.html";
        }
    }).catch((error) => {
        console.error("Erro ao buscar dados:", error);
        alert("Erro ao buscar dados no Firebase.");
    });
}

function preencherFormulario(dados) {
    // Função auxiliar para preencher campos de texto por ID
    function preencherCampoPorId(elementId, valor) {
        const element = document.getElementById(elementId);
        if (element && valor !== undefined && valor !== null && valor !== '') {
            element.textContent = valor;
        }
    }

    // Função auxiliar para marcar checkboxes por ID
    function marcarCheckboxPorId(elementId, checked) {
        const checkbox = document.getElementById(elementId);
        if (checkbox && checked) {
            checkbox.checked = true;
        }
    }

    // Função para formatar CPF
    function formatarCPF(cpf) {
        if (!cpf) return '';
        const cpfLimpo = cpf.replace(/\D/g, '');
        return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    // Função para formatar RG
    function formatarRG(rg) {
        if (!rg) return '';
        const rgLimpo = rg.replace(/\D/g, '');
        return rgLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    }

    // Função para formatar telefone
    function formatarTelefone(telefone) {
        if (!telefone) return '';
        const telLimpo = telefone.replace(/\D/g, '');
        if (telLimpo.length === 11) {
            return telLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (telLimpo.length === 10) {
            return telLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return telefone;
    }

    // Função para formatar data
    function formatarData(dataString) {
        if (!dataString) return { dia: '', mes: '', ano: '' };
        const data = new Date(dataString);
        return {
            dia: String(data.getDate()).padStart(2, '0'),
            mes: String(data.getMonth() + 1).padStart(2, '0'),
            ano: String(data.getFullYear())
        };
    }

    // Preenchendo dados da vítima
    preencherCampoPorId('nomeVitima', dados.nomeVitima);
    preencherCampoPorId('idadeVitima', dados.idadeVitima);
    preencherCampoPorId('telefoneVitima', formatarTelefone(dados.telefoneVitima));
    preencherCampoPorId('telefone2Vitima', formatarTelefone(dados.telefone2Vitima));
    preencherCampoPorId('profissaoVitima', dados.profissaoVitima);
    preencherCampoPorId('horarioTrabalhoVitima', dados.horarioTrabalhoVitima);
    preencherCampoPorId('emailVitima', dados.emailVitima);
    preencherCampoPorId('cpfVitima', formatarCPF(dados.cpfVitima));
    preencherCampoPorId('rgVitima', formatarRG(dados.rgVitima));
    preencherCampoPorId('paisEstrangeiroVitima', dados.paisEstrangeiroVitima);
    preencherCampoPorId('unidadePMVitima', dados.unidadePMVitima);
    preencherCampoPorId('enderecoVitima', dados.enderecoProfissionalVitima);


    // Estado civil da vítima
    if (dados.estadoCivilVitima) {
        marcarCheckboxPorId(`estadoCivilVitima_${dados.estadoCivilVitima}`, true);
    }

    // Escolaridade da vítima
    if (dados.escolaridadeVitima) {
        marcarCheckboxPorId(`escolaridadeVitima_${dados.escolaridadeVitima}`, true);
    }

    // Nacionalidade da vítima
    if (dados.nacionalidadeVitima) {
        marcarCheckboxPorId(`nacionalidadeVitima_${dados.nacionalidadeVitima}`, true);
    }

    // PM da vítima
    if (dados.pmVitima) {
        marcarCheckboxPorId(`pmVitima_${dados.pmVitima}`, true);
    }

    // Cor/raça da vítima
    if (dados.corRacaVitima) {
        marcarCheckboxPorId(`corRacaVitima_${dados.corRacaVitima}`, true);
    }

    // Relação vítima/autor
    if (dados.relacaoVitimaAutor) {
        marcarCheckboxPorId(`relacaoVitimaAutor_${dados.relacaoVitimaAutor}`, true);
    }

    // Preenchendo dados do agressor
    preencherCampoPorId('nomeAgressor', dados.nomeAgressor);
    preencherCampoPorId('idadeAgressor', dados.idadeAgressor);
    preencherCampoPorId('telefoneAgressor', formatarTelefone(dados.telefoneAgressor));
    preencherCampoPorId('telefone2Agressor', formatarTelefone(dados.telefone2Agressor));
    preencherCampoPorId('profissaoAgressor', dados.profissaoAgressor);
    preencherCampoPorId('horarioTrabalhoAgressor', dados.horarioTrabalhoAgressor);
    preencherCampoPorId('enderecoAgressor', dados.enderecoProfissionalAgressor);
    preencherCampoPorId('emailAgressor', dados.emailAgressor);
    preencherCampoPorId('cpfAgressor', formatarCPF(dados.cpfAgressor));
    preencherCampoPorId('rgAgressor', formatarRG(dados.rgAgressor));
    preencherCampoPorId('paisEstrangeiroAgressor', dados.paisEstrangeiroAgressor);
    preencherCampoPorId('unidadePMAgressor', dados.unidadePMAgressor);
    preencherCampoPorId('artigosAntecedentesAgressor', dados.artigosAntecedentesAgressor);

    // Estado civil do agressor
    if (dados.estadoCivilAgressor) {
        marcarCheckboxPorId(`estadoCivilAgressor_${dados.estadoCivilAgressor}`, true);
    }

    // Escolaridade do agressor
    if (dados.escolaridadeAgressor) {
        marcarCheckboxPorId(`escolaridadeAgressor_${dados.escolaridadeAgressor}`, true);
    }

    // Nacionalidade do agressor
    if (dados.nacionalidadeAgressor) {
        marcarCheckboxPorId(`nacionalidadeAgressor_${dados.nacionalidadeAgressor}`, true);
    }

    // PM do agressor
    if (dados.pmAgressor) {
        marcarCheckboxPorId(`pmAgressor_${dados.pmAgressor}`, true);
    }

    // Cor/raça do agressor
    if (dados.corRacaAgressor) {
        marcarCheckboxPorId(`corRacaAgressor_${dados.corRacaAgressor}`, true);
    }

    // Antecedentes criminais do agressor
    if (dados.antecedentesCriminaisAgressor) {
        marcarCheckboxPorId(`antecedentesCriminaisAgressor_${dados.antecedentesCriminaisAgressor}`, true);
    }

    // Informações sobre a situação atual
    preencherCampoPorId('tempoRelacionamento', dados.tempoRelacionamento);
    preencherCampoPorId('tempoSeparacao', dados.tempoSeparacao);
    preencherCampoPorId('tempoViolencia', dados.tempoViolencia);
    preencherCampoPorId('numeroProcesso', dados.numeroProcesso);

    // Separados
    if (dados.separados) {
        marcarCheckboxPorId(`separados_${dados.separados}`, true);
    }

    // MPU
    if (dados.mpu) {
        marcarCheckboxPorId(`mpu_${dados.mpu}`, true);
    }

    // Intimação da vítima
    if (dados.intimacaoVitima) {
        marcarCheckboxPorId(`intimacaoVitima_${dados.intimacaoVitima}`, true);
    }

    // Autor intimado
    if (dados.autorIntimado) {
        marcarCheckboxPorId(`autorIntimado_${dados.autorIntimado}`, true);
    }

    // Data de expedição
    if (dados.dataExpedicao) {
        const dataExp = formatarData(dados.dataExpedicao);
        preencherCampoPorId('dataExpedicaoDia', dataExp.dia);
        preencherCampoPorId('dataExpedicaoMes', dataExp.mes);
        preencherCampoPorId('dataExpedicaoAno', dataExp.ano);
    }

    // Representou
    if (dados.representou) {
        marcarCheckboxPorId(`representou_${dados.representou}`, true);
    }

    // Data de representação
    if (dados.dataRepresentacao) {
        const dataRep = formatarData(dados.dataRepresentacao);
        preencherCampoPorId('dataRepresentacaoDia', dataRep.dia);
        preencherCampoPorId('dataRepresentacaoMes', dataRep.mes);
        preencherCampoPorId('dataRepresentacaoAno', dataRep.ano);
    }

    // Histórico de violência - agressões físicas
    if (dados.agressaoFisica && Array.isArray(dados.agressaoFisica)) {
        dados.agressaoFisica.forEach(agressao => {
            marcarCheckboxPorId(`agressaoFisica_${agressao}`, true);
        });
    }

    // Outras agressões físicas
    preencherCampoPorId('outrasAgressoesFisicas', dados.outrasAgressoesFisicas);

    // Atendimento médico
    if (dados.atendimentoMedico) {
        marcarCheckboxPorId(`atendimentoMedico_${dados.atendimentoMedico}`, true);
    }

    // Violência psicológica
    if (dados.violenciaPsicologica && Array.isArray(dados.violenciaPsicologica)) {
        dados.violenciaPsicologica.forEach(violencia => {
            marcarCheckboxPorId(`violenciaPsicologica_${violencia}`, true);
        });
    }

    // Outras violências psicológicas
    preencherCampoPorId('outrasViolenciasPsicologicas', dados.outrasViolenciasPsicologicas);

    // Agressão sexual
    if (dados.agressaoSexual && Array.isArray(dados.agressaoSexual)) {
        dados.agressaoSexual.forEach(agressao => {
            marcarCheckboxPorId(`agressaoSexual_${agressao}`, true);
        });
    }

    // Outras agressões sexuais
    preencherCampoPorId('outrasAgressoesSexuais', dados.outrasAgressoesSexuais);

    // Agressão patrimonial
    if (dados.agressaoPatrimonial && Array.isArray(dados.agressaoPatrimonial)) {
        dados.agressaoPatrimonial.forEach(agressao => {
            marcarCheckboxPorId(`agressaoPatrimonial_${agressao}`, true);
        });
    }

    // Outras agressões patrimoniais
    preencherCampoPorId('outrasAgressoesPatrimoniais', dados.outrasAgressoesPatrimoniais);

        // Agressão moral
        if (dados.agressaoMoral && Array.isArray(dados.agressaoMoral)) {
            dados.agressaoMoral.forEach(agressao => {
                marcarCheckboxPorId(`agressaoMoral_${agressao}`, true);
            });
        }

    // Ocorrência policial
    if (dados.ocorrenciaPolicial) {
        marcarCheckboxPorId(`ocorrenciaPolicial_${dados.ocorrenciaPolicial}`, true);
    }

    // Ameaças frequentes
    if (dados.ameacasFrequentes) {
        marcarCheckboxPorId(`ameacasFrequentes_${dados.ameacasFrequentes}`, true);
    }

    // Sobre o agressor - uso de substâncias
    if (dados.usoSubstancias && Array.isArray(dados.usoSubstancias)) {
        dados.usoSubstancias.forEach(substancia => {
            marcarCheckboxPorId(`usoSubstancias_${substancia}`, true);
        });
    }

    // Doença mental do agressor
    if (dados.doencaMental) {
        marcarCheckboxPorId(`doencaMental_${dados.doencaMental}`, true);
    }

    // Acompanhamento psicológico do agressor
    if (dados.acompanhamentoPsicologico) {
        marcarCheckboxPorId(`acompanhamentoPsicologico_${dados.acompanhamentoPsicologico}`, true);
    }

    // Suicídio do agressor
    if (dados.suicidioAgressor) {
        marcarCheckboxPorId(`suicidioAgressor_${dados.suicidioAgressor}`, true);
    }

    // Descumpriu medida
    if (dados.descumpriuMedida) {
        marcarCheckboxPorId(`descumpriuMedida_${dados.descumpriuMedida}`, true);
    }

    // Dificuldades financeiras
    if (dados.dificuldadesFinanceiras) {
        marcarCheckboxPorId(`dificuldadesFinanceiras_${dados.dificuldadesFinanceiras}`, true);
    }


if (dados.acessoArma && Array.isArray(dados.acessoArma)) {
    dados.acessoArma.forEach(valor => {
        // Este seletor agora funcionará corretamente
        const checkbox = document.querySelector(`input[name="acessoArma"][value="${valor}"]`);
        if (checkbox) {
            checkbox.checked = true;
        } else {
            console.warn(`❗ Checkbox não encontrado para o valor: '${valor}'`);
        }
    });
}





    // Ameaça/agressão a filhos
    if (dados.ameacaAgressaoFilhos && Array.isArray(dados.ameacaAgressaoFilhos)) {
        dados.ameacaAgressaoFilhos.forEach(ameaca => {
            marcarCheckboxPorId(`ameacaAgressaoFilhos_${ameaca}`, true);
        });
    }

    // Meio utilizado
    if (dados.meioUtilizado && Array.isArray(dados.meioUtilizado)) {
        dados.meioUtilizado.forEach(meio => {
            marcarCheckboxPorId(`meioUtilizado_${meio}`, true);
        });
    }

    // Outro meio utilizado
    preencherCampoPorId('outroMeioUtilizado', dados.outroMeioUtilizado);

    // Sobre a vítima - separação recente
    if (dados.separacaoRecente) {
        marcarCheckboxPorId(`separacaoRecente_${dados.separacaoRecente}`, true);
    }

    // Tem filhos
    if (dados.temFilhos) {
        marcarCheckboxPorId(`temFilhos_${dados.temFilhos}`, true);
        
        // Se tem filhos, preencher os campos de quantidade e nomes
        if (dados.temFilhos === 'sim-com-agressor') {
            preencherCampoPorId('quantidadeFilhos', dados.quantidadeFilhos);
            preencherCampoPorId('nomesIdadesFilhos', dados.nomesIdadesFilhos);
        } else if (dados.temFilhos === 'sim-outro-relacionamento') {
            preencherCampoPorId('quantidadeFilhosOutro', dados.quantidadeFilhos);
            preencherCampoPorId('nomesIdadesFilhosOutro', dados.nomesIdadesFilhos);
        }
    }

    // Filho com deficiência
    if (dados.filhoDeficiencia) {
        marcarCheckboxPorId(`filhoDeficiencia_${dados.filhoDeficiencia}`, true);
    }

    // Conflito guarda filhos
    if (dados.conflitoGuardaFilhos) {
        marcarCheckboxPorId(`conflitoGuardaFilhos_${dados.conflitoGuardaFilhos}`, true);
    }

    // Filhos presenciaram violência
    if (dados.filhosPresenciaramViolencia) {
        marcarCheckboxPorId(`filhosPresenciaramViolencia_${dados.filhosPresenciaramViolencia}`, true);
    }

    // Violência na gravidez
    if (dados.violenciaGravidez) {
        marcarCheckboxPorId(`violenciaGravidez_${dados.violenciaGravidez}`, true);
    }

    // Grávida/bebê recente
    if (dados.gravidaBebeRecente) {
        marcarCheckboxPorId(`gravidaBebeRecente_${dados.gravidaBebeRecente}`, true);
    }

    // Acompanhamento psicológico da vítima
    if (dados.acompanhamentoPsicologicoVitima) {
        marcarCheckboxPorId(`acompanhamentoPsicologicoVitima_${dados.acompanhamentoPsicologicoVitima}`, true);
    }

    // Órgão de acompanhamento
    preencherCampoPorId('orgaoAcompanhamento', dados.orgaoAcompanhamento);

    // Reside com agressor
    if (dados.resideComAgressor) {
        marcarCheckboxPorId(`resideComAgressor_${dados.resideComAgressor}`, true);
    }

    // Local seguro
    if (dados.localSeguro) {
        marcarCheckboxPorId(`localSeguro_${dados.localSeguro}`, true);
    }

    // Detalhes do local seguro
    preencherCampoPorId('localSeguroDetalhes', dados.localSeguroDetalhes);

    // Outras informações importantes
    if (dados.localRisco) {
        marcarCheckboxPorId(`localRisco_${dados.localRisco}`, true);
    }

    // Situação de moradia
    if (dados.situacaoMoradia) {
        marcarCheckboxPorId(`situacaoMoradia_${dados.situacaoMoradia}`, true);
    }

    // Cedida por quem
    preencherCampoPorId('cedidaPorQuem', dados.cedidaPorQuem);

    // Dependência financeira
    if (dados.dependenciaFinanceira) {
        marcarCheckboxPorId(`dependenciaFinanceira_${dados.dependenciaFinanceira}`, true);
    }

    // Abrigamento temporário
    if (dados.abrigamentoTemporario) {
        marcarCheckboxPorId(`abrigamentoTemporario_${dados.abrigamentoTemporario}`, true);
    }

    // Agressor voltou à violência
    if (dados.agressorVoltouViolencia) {
        marcarCheckboxPorId(`agressorVoltouViolencia_${dados.agressorVoltouViolencia}`, true);
    }


    // Nome completo para assinatura
    preencherCampoPorId('nomeCompleto', dados.nomeCompleto);

    //img da assinatura
    const assinaturaImg = document.getElementById('assinaturaImg');
if (assinaturaImg && dados.signatureUrl) {
    assinaturaImg.src = dados.signatureUrl;
}


    // Preenchimento pelo policial
    if (dados.preenchimento) {
        marcarCheckboxPorId(`preenchimento_${dados.preenchimento}`, true);
    }

    // Grau de risco
    if (dados.grauRisco) {
        marcarCheckboxPorId(`grauRisco_${dados.grauRisco}`, true);
    }

    // Observações
    preencherCampoPorId('observacoes', dados.observacoes);

    console.log("Formulário preenchido com sucesso!");
}


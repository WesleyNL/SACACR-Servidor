/**
 * SistemaArduinoController
 *
 */

module.exports = {
	
    alterarPreferencia: function(req, res){
        var preferencia = req.param('preferencia');
        var responsavel = req.param('login');
                  
        var sql = 'UPDATE PARAMETROS  ' +
                  ' SET PREFERENCIA = ' + preferencia + ',' +
                  ' RESPONSAVEL = ' + responsavel + 
                  ' WHERE CODIGO = 1';

        Acesso.query(sql, function alterar(err, dados) {
            if (err) {
                res.json(500, {
                    retorno: '1',
                    result: 'ERROR', 
                    conteudo: err
                });
            }else {
                if(JSON.parse(JSON.stringify(dados)).affectedRows == 0){
                    res.json({
                        retorno: '1',
                        conteudo: 'Não foi possível alterar.'
                    });
                }else{
                   res.json({
                        retorno: '0',
                        conteudo: 'Alterado com sucesso.'
                    });
                }
            }
        });
    },

    pesquisarParametros: function(req, res){
                  
         var sql = ' SELECT RESPONSAVEL, PREFERENCIA, CASE WHEN NOME IS NULL THEN \'Não Cadastrado\' ELSE NOME END AS NOME_RESPONSAVEL ' + 
                   ' FROM PARAMETROS p ' +
                   ' LEFT JOIN ACESSO a ' +
                   ' ON p.RESPONSAVEL = a.CODIGO ' +  
                   ' WHERE p.CODIGO = 1';

        Acesso.query(sql, function pesquisar(err, dados) {
            if (err) {
                res.json(500, {
                    retorno: '1',
                    result: 'ERROR', 
                    conteudo: err
                });
            }else {
                if(dados.length == 0){
                    res.json({
                        retorno: '1',
                        conteudo: 'Parametros não encontrados.'
                    });
                }else{
                   res.json({
                        retorno: '0',
                        conteudo: dados
                    });
                }
            }
        });
    },

    pesquisar: function(req, res){
                  
        var dataInicial = req.param("data_inicial");
        var dataFinal = req.param("data_final");

        var sql = 'SELECT SUM(CASE WHEN TIPO_RESERVATORIO = 0 OR TIPO_RESERVATORIO IS NULL THEN QUANTIDADE ELSE 0 END) AS QTD_CONCESSIONARIA, ' +
                  ' SUM(CASE WHEN TIPO_RESERVATORIO = 1 THEN QUANTIDADE ELSE 0 END) AS QTD_CHUVA, ' +
                  ' MIN(PORCENTAGEM) AS NIVEL_CHUVA ' +
                  ' FROM LOG_UTILIZACAO u  ' +
                  ' LEFT JOIN LOG_NIVEL n ' +
                  ' ON u.CODIGO = n.CODIGO_UTILIZACAO ' +
                  ' WHERE u.DATA_HORA >= \'' + dataInicial + '\' AND u.DATA_HORA <= \'' + dataFinal + '\'';

        Acesso.query(sql, function pesquisar(err, dados) {
            if (err) {
                res.json(500, {
                    retorno: '1',
                    result: 'ERROR', 
                    conteudo: err
                });
            }else {
                if(dados.length == 0){
                    res.json({
                        retorno: '1',
                        conteudo: 'Dados de log não encontrados.'
                    });
                }else{
                   res.json({
                        retorno: '0',
                        conteudo: dados
                   });
                }
            }
        });
    },

    salvar: function(req, res){

        var nivel = req.param("nivel");
        var qtdConcessionaria = req.param("qtd_concessionaria");
        var qtdChuva = req.param("qtd_chuva");

        var dataHora =  (new Date()).toLocaleString().substring(0, 19).replace('T', ' ');

        /*
            Salvar concessionaria tipo 0
            Salvar chuva tipo 1
            Pegar codigo do último da chuva
            Salvar nivel
        */

        var sql = 'INSERT INTO LOG_UTILIZACAO (QUANTIDADE, TIPO_RESERVATORIO, DATA_HORA) ' +  
                  ' VALUES(' + qtdConcessionaria + ', 0, \'' + dataHora + '\')';

        var sql2 = 'INSERT INTO LOG_UTILIZACAO (QUANTIDADE, TIPO_RESERVATORIO, DATA_HORA) ' +  
                   ' VALUES(' + qtdChuva + ', 1, \'' + dataHora + '\')';

        Acesso.query(sql, function inserir(err, dados) {
            if (err) {
                res.json(500, {
                    retorno: '1',
                    result: 'ERROR', 
                    conteudo: err
                });
            }
        }); 

        Acesso.query(sql2, function inserir(err, dados) {
            if (err) {
                res.json(500, {
                    retorno: '1',
                    result: 'ERROR', 
                    conteudo: err
                });
            }else {
                var sql3 = 'SELECT MAX(CODIGO) AS CODIGO FROM LOG_UTILIZACAO ' +  
                           ' WHERE TIPO_RESERVATORIO = 1';

                Acesso.query(sql3, function pesquisar(err, dados) {
                    if (err) {
                        res.json(500, {
                            retorno: '1',
                            result: 'ERROR', 
                            conteudo: err
                        });
                    }else{
                        if(dados.length == 0){
                            res.json({
                                retorno: '1',
                                conteudo: 'Erro durante processo.'
                            });
                        }else{
                            var codigoUltimo = JSON.parse(JSON.stringify(dados[0])).CODIGO
                            var sql4 = 'INSERT INTO LOG_NIVEL (CODIGO_UTILIZACAO, PORCENTAGEM, DATA_HORA) ' +  
                                       ' VALUES(' + codigoUltimo + ', ' + nivel + ', \'' + dataHora + '\')';

                            console.log(sql4);

                            Acesso.query(sql4, function inserir(err, dados) {
                                if (err) {
                                    res.json(500, {
                                        retorno: '1',
                                        result: 'ERROR', 
                                        conteudo: err
                                    });
                                }else {
                                    res.json({
                                        retorno: '0',
                                        conteudo: 'Processo realizado com sucesso.'
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    },

};
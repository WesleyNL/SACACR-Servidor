/**
 * AcessoController
 *
 */

module.exports = {
	
    acessar: function(req, res){
        var login = req.param('login');
        var senha = req.param('senha');

        var sql = 'SELECT * FROM ACESSO ' +
                  ' WHERE LOGIN = \'' + login + '\'' +
                  ' AND SENHA = \'' + senha + '\'';

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
                        conteudo: 'Acesso não encontrado.'
                    });
                }else{
                    var codigo = JSON.parse(JSON.stringify(dados[0])).CODIGO;
                    var now = (new Date()).toLocaleString().substring(0, 19).replace('T', ' ');
                    //var diaMes = now.split("/");
                    //var anoHora = diaMes[2].split(' ');
                    //var dataAcesso = (anoHora[0] + '-' + diaMes[1] + '-' + diaMes[0] + " " + anoHora[1]);
                    var dataAcesso = now;

                    var sql = 'INSERT INTO LOG_ACESSO (CODIGO_USUARIO, DATA_ACESSO) ' +
                              ' VALUES(' + codigo + ',\'' + dataAcesso + '\')';

                    logGerado = false;

                    Acesso.query(sql, function inserir(err, dados){
                        if(err){
                            logGerado = false;
                        }else{
                           
                            logGerado = true;
                        }

                        res.json({
                            retorno: '0',
                            conteudo: 'Acesso encontrado.',
                            codigo: codigo,
                            log: logGerado ? 'Log de Acesso gravado com sucesso.' : 'Não foi possível gerar.'
                        });
                    });
                }
            }
        });
    },

    pesquisar: function(req, res){
        var codigo = req.param('codigo');
                  
         var sql = 'SELECT a.*, l.DATA_ACESSO FROM ACESSO a ' +  
                   ' LEFT JOIN LOG_ACESSO l ' +
                   ' ON a.CODIGO = l.CODIGO_USUARIO ' + 
                   ' WHERE a.CODIGO = ' + codigo +
                   ' ORDER BY l.DATA_ACESSO DESC ' +
                   ' LIMIT 1';

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
                        conteudo: 'Acesso não encontrado.'
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

    pesquisarGeral: function(req, res){
        var filtro = req.param('filtro');

        var sqlWhere = '';
        if(filtro.length > 0){
            sqlWhere = ' WHERE NOME LIKE \'%' + filtro + '%\' OR LOGIN LIKE \'%' + filtro + '%\''; 
        }
                  
         var sql = 'SELECT CODIGO, NOME FROM ACESSO ' + 
                   sqlWhere +
                   ' ORDER BY CODIGO ';

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
                        conteudo: 'Nenhum acesso encontrado.'
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

    excluir: function(req, res){
        var codigo = req.param('codigo');
                  
        var sql = 'DELETE FROM ACESSO  ' + 
                   ' WHERE CODIGO = ' + codigo;

        Acesso.query(sql, function pesquisar(err, dados) {
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
                        conteudo: 'Não foi possível excluir.'
                    });
                }else{
                   res.json({
                        retorno: '0',
                        conteudo: 'Excluído com sucesso.'
                    });
                }
            }
        });
    },

    salvar: function(req, res){
        var codigo = req.param("codigo");
        var nome = req.param("nome").replace(/.-./g, ' ');
        var login = req.param("login");
        var senha = req.param("senha");
        var now = (new Date()).toLocaleString().substring(0, 19).replace('T', ' ');
        //var diaMes = now.split("/");
        //var anoHora = diaMes[2].split(' ');
        //var dataAcesso = (anoHora[0] + '-' + diaMes[1] + '-' + diaMes[0] + " " + anoHora[1]);
        var dataInclusao = now;

        var isEdicao = req.param("operacao");

        if(isEdicao == 0){
            var sql = 'SELECT CODIGO FROM ACESSO' +  
                    ' WHERE LOGIN LIKE \'%' + login + '%\'';

            Acesso.query(sql, function pesquisar(err, dados) {
                if (err) {
                    res.json(500, {
                        retorno: '1',
                        result: 'ERROR', 
                        conteudo: err
                    });
                }else {
                    if(dados.length != 0){
                        res.json({
                            retorno: '1',
                            conteudo: 'Usuário já cadastrado.'
                        });
                    }else{
                        var sql = 'INSERT INTO ACESSO (NOME, LOGIN, SENHA, DATA_INCLUSAO) ' +
                                  ' VALUES(\'' + nome + '\',\'' + login + '\',\'' + senha + '\',\'' + dataInclusao + '\')';

                        Acesso.query(sql, function inserir(err, dados){
                            if(err){
                                res.json({
                                    retorno: '1',
                                    conteudo: 'Não foi possível cadastrar.',
                                });
                            }else{

                                 var sql = 'SELECT CODIGO FROM ACESSO' +  
                                           ' WHERE LOGIN LIKE \'%' + login + '%\'';

                                Acesso.query(sql, function pesquisar(err, dados) {
                                    if (err) {
                                        res.json(500, {
                                            retorno: '1',
                                            result: 'ERROR', 
                                            conteudo: err
                                        });
                                    }else{
                                        res.json({
                                            retorno: '0',
                                            conteudo: 'Usuario cadastrado com sucesso.',
                                            NOVO_CODIGO: JSON.parse(JSON.stringify(dados[0])).CODIGO
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }else{
            var sql = 'UPDATE ACESSO ' +
                      ' SET NOME = \'' + nome + '\',' +
                      ' SENHA = \'' + senha + '\'' +
                      ' WHERE CODIGO = ' + codigo;

            Acesso.query(sql, function atualizar(err, dados){
                if(err){
                    res.json({
                        retorno: '1',
                        conteudo: 'Não foi possível alterar o usuário.',
                    });
                }else{
                    res.json({
                        retorno: '0',
                        conteudo: 'Usuário alterado com sucesso.',
                    });
                }
            });
        }
    },

};
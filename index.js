// PARTE INICIAL
const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.static(__dirname + '/views'));

app.use(session({secret: 'conectado', saveUninitialized: true, resave: true}));

app.listen(3000, function(){
  console.log("Servidor no ar - Porta: 3000!")
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

// CLASSES
const PapelUsuario = require('./model/PapelUsuario');
const UsuarioPlataforma = require('./model/UsuarioPlataforma');
const CategoriaComunidade = require('./model/CategoriaComunidade');
const Comunidade = require('./model/Comunidade');
const Forum = require('./model/Forum');
const RespostaForum = require('./model/RespostaForum');
const RamoEmpresa = require('./model/RamoEmpresa');
const Empresa = require('./model/Empresa'); 

// BANCO DE DADOS
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "equipe-dev-dois",
  password: "12345678",
  database: "conecte_se"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Banco de dados conectado!");
});

// NAVEGAÇÕES PARA USUÁRIO DESLOGADO
app.get('/', function(req, res){
    req.session.apelido = "";
	res.sendFile(__dirname + '/views/paginas_deslogado/inicio_deslogado.html');
});

app.get('/empresas-deslogado', function(req, res){
    req.session.apelido = "";
	var e = new Empresa();  
                e.listar(con, function(result){
                    res.render('paginas_deslogado/empresas_deslogado.ejs', { empresas: result});
                });
});

app.get('/comunidades-deslogado', function(req, res){
    req.session.apelido = "";
    var co = new Comunidade();  
    
            co.listar(con, function(result2){
                res.render('paginas_deslogado/comunidades_deslogado.ejs', { comunidades: result2});
            });

});

app.get('/fale-conosco-deslogado', function(req, res){
    req.session.apelido = "";
	res.sendFile(__dirname + '/views/paginas_deslogado/faleConosco_deslogado.html');
});

app.get('/login', function(req, res){
    req.session.apelido = "";
	res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
});

app.get('/cadastro', function(req, res){
    req.session.apelido = "";
    var p = new PapelUsuario(); 
    
	p.listar(con, function(result){
		res.render('paginas_deslogado/cadastro_usuario.ejs', {papeisUsuario: result});
	});
    
});

// SISTEMA DE LOGIN
app.post('/entrar', function(req, res){
		var u = new UsuarioPlataforma();
	    u.setApelido(req.body.apelido);
        u.setSenha(req.body.senha);
 
	    u.listar(con, function(result){
            for (let i = 0; i < result.length; i++) {
                if (u.getApelido() == result[i].apelido && u.getSenha() == result[i].senha){
                    req.session.apelido = result[i].apelido;
                    switch (result[i].papel) {
                        case 1:{
                            res.render('paginas_administrador/inicio_administrador.ejs', {usuario: result[i].apelido});
                            break;
                        }
                        case 2:{
                            res.render('paginas_empreendedor/inicio_empreendedor.ejs', {usuario: result[i].apelido});
                            break;
                        }
                        case 3:{
                            res.render('paginas_outros/inicio_outros.ejs', {usuario: result[i].apelido});
                            break;
                        }
                    }
                }
            }
            if (req.session.apelido == ""){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Usuário ou senha incorretos!'});
            }    
	    });  
});

//SISTEMA DE CADASTRO
app.post('/cadastrar', function(req, res){
    try {
		var u = new UsuarioPlataforma();
		
		u.setApelido(req.body.apelido);
		u.setCpf(req.body.cpf);
		u.setNome(req.body.nome);
		u.setSobrenome(req.body.sobrenome);
		u.setPapel(req.body.papel);
		u.setEmail(req.body.email);
		u.setTelefone(req.body.telefone);
		u.setSenha(req.body.senha);
		
		var retorno = u.inserir(con);
        res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Cadastro concluído com sucesso'});
		console.log('Aqui: ' + retorno);
	} catch (e) {
        console.log('Erro: '+e.message);
        res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Há problemas nas informações fornecidas!'});
	}
});

// NAVEGAÇÕES PARA USUÁRIO ADMINISTRADOR 
app.get('/inicio-administrador', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 1){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                res.render('paginas_administrador/inicio_administrador.ejs', {usuario: req.session.apelido});
            }
    });
    }
});

app.get('/tipos-usuario-administrador', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 1){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                res.render('paginas_administrador/tiposUsuario_administrador.ejs', {usuario: req.session.apelido});
            }
    });
    }

});

app.get('/usuarios-administrador', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 1){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                var u = new UsuarioPlataforma();  
                u.listar(con, function(result){
                    res.render('paginas_administrador/usuarios_administrador.ejs', {usuario: req.session.apelido, usuariosPlataforma: result});
                });
                
            }
    });
    }
});

app.get('/empresas-administrador', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 1){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                var e = new Empresa();  
                e.listar(con, function(result){
                    res.render('paginas_administrador/empresas_administrador.ejs', {usuario: req.session.apelido, empresas: result});
                });
            }
    });
    }

});

app.get('/comunidades-administrador', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 1){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                var c = new CategoriaComunidade();
                var co = new Comunidade();  
                    c.listar(con, function(result1){
                        co.listar(con, function(result2){
                            res.render('paginas_administrador/comunidades_administrador.ejs', {usuario: req.session.apelido, categoriasComunidade: result1, comunidades: result2});
                        });
                    });
            }
    });
    }

});

app.get('/fale-conosco-administrador', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 1){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                res.render('paginas_administrador/faleConosco_administrador.ejs', {usuario: req.session.apelido});
            }
    });
    }

});

app.post('/foruns-administrador', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 1){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                var f = new Forum(); 
                f.setComunidade(req.body.comunidade);
                var co = new Comunidade();
                    f.buscarForuns(con, function(result1){
                        co.listar(con, function(result2){
                            res.render('paginas_administrador/foruns_administrador.ejs', {usuario: req.session.apelido, foruns: result1, comunidades: result2});
                        });
                    });
            }
    });
    }
});

app.post('/respostas-forum-administrador', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 1){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                var r = new RespostaForum(); 
                r.setForum(req.body.forum);
                var f = new Forum();
                f.setId(req.body.forum)
                    r.buscarRespostas(con, function(result1){
                        f.listar(con, function(result2){
                            f.pesquisarForum(con, function(result3){
                                res.render('paginas_administrador/respostasForum_administrador.ejs', {usuario: req.session.apelido, respostas: result1, foruns: result2, forum: result3});
                            });
                        });
                    });
            }
    });
    }
});

// NAVEGAÇÕES PARA USUÁRIO EMPREENDEDOR
app.get('/inicio-empreendedor', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 2){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                res.render('paginas_empreendedor/inicio_empreendedor.ejs', {usuario: req.session.apelido});
            }
    });
    }

});

app.get('/empresas-empreendedor', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 2){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                var e = new Empresa();  
                e.listar(con, function(result){
                    res.render('paginas_empreendedor/empresas_empreendedor.ejs', {usuario: req.session.apelido, empresas: result});
                });
            }
    });
    }
});

app.get('/comunidades-empreendedor', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 2){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                var c = new CategoriaComunidade();
                var co = new Comunidade();  
                    c.listar(con, function(result1){
                        co.listar(con, function(result2){
                            res.render('paginas_empreendedor/comunidades_empreendedor.ejs', {usuario: req.session.apelido, categoriasComunidade: result1, comunidades: result2});
                        });
                    });
            }
    });
    }

});

app.get('/fale-conosco-empreendedor', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 2){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                res.render('paginas_empreendedor/faleConosco_empreendedor.ejs', {usuario: req.session.apelido});
            }
    });
    }

});

app.get('/cadastro-empresa', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 2){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                var r = new RamoEmpresa();  
                    r.listar(con, function(result){
                        res.render('paginas_empreendedor/cadastro_empresa.ejs', {usuario: req.session.apelido, ramosEmpresas: result});
                    });
                
            }
    });
    }

});

app.get('/foruns-empreendedor', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 2){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                var f = new Forum(); 
                f.setComunidade(req.body.comunidade);
                var co = new Comunidade();
                    f.buscarForuns(con, function(result1){
                        co.listar(con, function(result2){
                            res.render('paginas_empreendedor/foruns_empreendedor.ejs', {usuario: req.session.apelido, foruns: result1, comunidades: result2});
                        });
                    });
            }
    });
    }
});

app.post('/respostas-forum-empreendedor', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 2){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                res.render('paginas_empreendedor/respostasForum_empreendedor.ejs', {usuario: req.session.apelido});
            }
    });
    }
});

//NAVEGAÇÕES PARA OUTROS USUÁRIOS 
app.get('/inicio-outros', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 3){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                res.render('paginas_outros/inicio_outros.ejs', {usuario: req.session.apelido});
            }
    });
    }

});

app.get('/empresas-outros', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 3){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                var e = new Empresa();  
                e.listar(con, function(result){
                    res.render('paginas_outros/empresas_outros.ejs', {usuario: req.session.apelido, empresas: result});
                });
            }
    });
    }


});

app.get('/comunidades-outros', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 3){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                var c = new CategoriaComunidade();
                var co = new Comunidade();  
                    c.listar(con, function(result1){
                        co.listar(con, function(result2){
                            res.render('paginas_outros/comunidades_outros.ejs', {usuario: req.session.apelido, categoriasComunidade: result1, comunidades: result2});
                        });
                    });
            }
    });
    }


});

app.get('/fale-conosco-outros', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 3){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                res.render('paginas_outros/faleConosco_outros.ejs', {usuario: req.session.apelido});
            }
    });
    }


});

app.get('/foruns-outros', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 3){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                var f = new Forum(); 
                f.setComunidade(req.body.comunidade);
                var co = new Comunidade();
                    f.buscarForuns(con, function(result1){
                        co.listar(con, function(result2){
                            res.render('paginas_outros/foruns_outros.ejs', {usuario: req.session.apelido, foruns: result1, comunidades: result2});
                        });
                    });
            }
    });
    }


});

app.post('/respostas-forum-outros', function(req, res){
    if(req.session.apelido == ""){
        res.sendFile(__dirname + '/views/paginas_deslogado/login.html');
    } else{
        var u = new UsuarioPlataforma();
        u.setApelido(req.session.apelido);
        u.pesquisarPapel(con, function(result){
            if(result[0].papel != 3){
                res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Ops! Você não possui permissão para acessar essa página'});
            } else{
                res.render('paginas_outros/respostasForum_outros.ejs', {usuario: req.session.apelido});
            }
    });
    }

});

//FUNÇÕES CRIAR / INSERIR
app.post('/criarPapelUsuario', function(req, res){
	try {
		var p = new PapelUsuario();
		
		p.setNome(req.body.nome);
		p.setDescricao(req.body.descricao);
		
		var retorno = p.inserir(con);
		console.log('Aqui: ' + retorno);
	} catch (e) {
		console.log('Erro: '+e.message);
	}
    res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Informações salvas com sucesso!'});
});

app.post('/criarCategoriaComunidade', function(req, res){
	try {
		var c = new CategoriaComunidade();
		
		c.setNome(req.body.nome);
		c.setDescricao(req.body.descricao);
		c.setCriador(req.session.apelido);
		
		var retorno = c.inserir(con);
		console.log('Aqui: ' + retorno);
	} catch (e) {
		console.log('Erro: '+e.message);
	}
    res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Informações salvas com sucesso!'});
});

app.post('/criarComunidade', function(req, res){
	try {
		var c = new Comunidade();
		
		c.setNome(req.body.nome);
		c.setDescricao(req.body.descricao);
		c.setCategoria(req.body.categoria);
		c.setDataCriacao(req.body.criacao);
		c.setCriador(req.session.apelido);
		c.setEstado(req.body.estado);
		
		var retorno = c.inserir(con);
		console.log('Aqui: ' + retorno);
	} catch (e) {
		console.log('Erro: '+e.message);
	}
    res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Informações salvas com sucesso!'});
});

app.post('/criarForum', function(req, res){
	try {
		var f = new Forum();
		
		f.setTitulo(req.body.titulo);
		f.setAssunto(req.body.assunto);
		f.setDataCriacao(req.body.criacao);
		f.setAutor(req.session.apelido);
		f.setComunidade(req.body.comunidade);
		f.setEstado(req.body.estado);
		
		var retorno = f.inserir(con);
		console.log('Aqui: ' + retorno);
	} catch (e) {
		console.log('Erro: '+e.message);
	}
    res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Informações salvas com sucesso!'});
});

app.post('/criarRespostaForum', function(req, res){
	try {
		var r = new RespostaForum();
		
		r.setMensagem(req.body.mensagem);
		r.setDataCriacao(req.body.criacao);
		r.setAutor(req.session.apelido);
		r.setForum(req.body.forum);
		
		var retorno = r.inserir(con);
		console.log('Aqui: ' + retorno);
	} catch (e) {
		console.log('Erro: '+e.message);
	}
    res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Informações salvas com sucesso!'});
});

app.post('/criarRamoEmpresa', function(req, res){
	try {
		var r = new RamoEmpresa();
		
		r.setNome(req.body.nome);
		r.setDescricao(req.body.descricao);
		
		var retorno = r.inserir(con);
		console.log('Aqui: ' + retorno);
	} catch (e) {
		console.log('Erro: '+e.message);
	}
    res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Informações salvas com sucesso!'});
});

app.post('/criarEmpresa', function(req, res){
	try {
		var e = new Empresa();
		
		e.setNome(req.body.nome);
		e.setCnpj(req.body.cnpj);
		e.setProprietario(req.session.apelido);
		e.setRamo(req.body.ramo);
		e.setSobre(req.body.sobre);
		e.setFundacao(req.body.fundacao);
		e.setNumFuncionarios(req.body.funcionarios);
		e.setTelefone(req.body.telefone);
		e.setEmail(req.body.email);

		var retorno = e.inserir(con);
		console.log('Aqui: ' + retorno);
	} catch (e) {
		console.log('Erro: '+e.message);
	}
    res.render('paginas_deslogado/resposta_formulario.ejs', {msg: 'Informações salvas com sucesso!'});
});

// FUNÇÕES PESQUISAR / FILTRAR
app.post('/pesquisar-usuario-administrador', function(req, res){
	var u = new UsuarioPlataforma();
	u.setNome(req.body.nome+'%');
	
	if (u.getNome() == '') {
		u.setNome('%');
	}
	
	u.pesquisar(con, function(result){
        res.render('paginas_administrador/usuarios_administrador.ejs', {usuario: req.session.apelido, usuariosPlataforma: result});
	});
});

app.post('/pesquisar-comunidade-administrador', function(req, res){
	var co = new Comunidade();
	co.setNome(req.body.nome+'%');
	
	if (co.getNome() == '') {
		co.setNome('%');
	}
    var c = new CategoriaComunidade(); 
                    c.listar(con, function(result1){
                        co.pesquisar(con, function(result2){
                            res.render('paginas_administrador/comunidades_administrador.ejs', {usuario: req.session.apelido, categoriasComunidade: result1, comunidades: result2});
                        });
                    });
});

app.post('/pesquisar-comunidade-empreendedor', function(req, res){
	var co = new Comunidade();
	co.setNome(req.body.nome+'%');
	
	if (co.getNome() == '') {
		co.setNome('%');
	}
    var c = new CategoriaComunidade(); 
                    c.listar(con, function(result1){
                        co.pesquisar(con, function(result2){
                            res.render('paginas_empreendedor/comunidades_empreendedor.ejs', {usuario: req.session.apelido, categoriasComunidade: result1, comunidades: result2});
                        });
                    });
});

app.post('/pesquisar-comunidade-outros', function(req, res){
	var co = new Comunidade();
	co.setNome(req.body.nome+'%');
	
	if (co.getNome() == '') {
		co.setNome('%');
	}
    var c = new CategoriaComunidade(); 
                    c.listar(con, function(result1){
                        co.pesquisar(con, function(result2){
                            res.render('paginas_outros/comunidades_outros.ejs', {usuario: req.session.apelido, categoriasComunidade: result1, comunidades: result2});
                        });
                    });
});

app.post('/pesquisar-comunidade-deslogado', function(req, res){
	var co = new Comunidade();
	co.setNome(req.body.nome+'%');
	
	if (co.getNome() == '') {
		co.setNome('%');
	}
                   
    co.pesquisar(con, function(result2){
        res.render('paginas_deslogado/comunidades_deslogado.ejs', { comunidades: result2});
    });
                   
});

app.post('/pesquisar-empresa-administrador', function(req, res){
	var e = new Empresa();
	e.setNome(req.body.nome+'%');
	
	if (e.getNome() == '') {
		e.setNome('%');
	}
                   
    e.pesquisar(con, function(result){
        res.render('paginas_administrador/empresas_administrador.ejs', {usuario: req.session.apelido, empresas: result});
    });
                   
});

app.post('/pesquisar-empresa-empreendedor', function(req, res){
	var e = new Empresa();
	e.setNome(req.body.nome+'%');
	
	if (e.getNome() == '') {
		e.setNome('%');
	}
                   
    e.pesquisar(con, function(result){
        res.render('paginas_empreendedor/empresas_empreendedor.ejs', {usuario: req.session.apelido, empresas: result});
    });
                   
});

app.post('/pesquisar-empresa-outros', function(req, res){
	var e = new Empresa();
	e.setNome(req.body.nome+'%');
	
	if (e.getNome() == '') {
		e.setNome('%');
	}
                   
    e.pesquisar(con, function(result){
        res.render('paginas_outros/empresas_outros.ejs', {usuario: req.session.apelido, empresas: result});
    });
                   
});

app.post('/pesquisar-empresa-deslogado', function(req, res){
	var e = new Empresa();
	e.setNome(req.body.nome+'%');
	
	if (e.getNome() == '') {
		e.setNome('%');
	}
                   
    e.pesquisar(con, function(result){
        res.render('paginas_deslogado/empresas_deslogado.ejs', { empresas: result});
    });
                   
});



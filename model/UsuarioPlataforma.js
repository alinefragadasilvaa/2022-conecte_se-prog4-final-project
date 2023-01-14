module.exports = class UsuarioPlataforma { 
  constructor() {
    this.apelido = "";
    this.cpf = "";
    this.nome = "";
    this.sobrenome = "";
    this.papel = 0;
    this.email = "";
    this.telefone = "";
    this.senha= "";
  }
  
  setApelido(a) {
    this.apelido = a;
  }
  
  getApelido() {
    return this.apelido;  
  }
  
  setCpf(c) {
    this.cpf = c;
  }
  
  geCpf() {
    return this.cpf;  
  }
  
  setNome(n) {
    this.nome = n;
  }
  
  getNome() {
    return this.nome;  
  }
  
  setSobrenome(s) {
    this.sobrenome = s;
  }
  
  getSobrenome() {
    return this.sobrenome;  
  }

  setPapel(p) {
      this.papel = p;
    }
    
    getPapel() {
      return this.papel;  
    }

    setEmail(e) {
      this.email = e;
    }
    
    getEmail() {
      return this.email;  
    }

    setTelefone(t) {
      this.telefone = t;
    }
    
    getTelefone() {
      return this.telefone;  
    }

    setSenha(s) {
      this.senha = s;
    }
    
    getSenha() {
      return this.senha;  
    }
          
  
  inserir(connection) {
    try {
        var sql = "INSERT INTO  usuarios_da_plataforma (apelido,cpf,nome,sobrenome,papel,email,telefone,senha) VALUES(?,?,?,?,?,?,?,?)";

        connection.query(sql, [this.apelido, this.cpf,  this.nome,  this.sobrenome, this.papel, this.email, this.telefone, this.senha ], function (err, result) {
          if (err) throw "teste";
          //if (err) console.error('err from callback: ' + err.stack);
          });
    } catch (e) {
        console.error('err from callback: ' + e.stack);
        throw e;
    }
  }
  
  listar(connection, callback) {
    var sql = "SELECT a.apelido, a.cpf, a.nome, a.sobrenome, a.papel, b.nome as papel_nome, a.email,"+
     "a.telefone, a.senha FROM usuarios_da_plataforma as a, papeis_usuario as b WHERE a.papel = b.papel_id";

    connection.query(sql, function (err, result) {
        if (err) throw err;
        return callback(result);
    });    
  }
  
  pesquisar(connection, callback) {
    var sql = "SELECT a.apelido, a.cpf, a.nome, a.sobrenome, a.papel, b.nome as papel_nome, a.email,"+
    "a.telefone, a.senha FROM usuarios_da_plataforma as a, papeis_usuario as b WHERE a.papel = b.papel_id AND a.nome like ?";

    connection.query(sql, [this.nome], function (err, result) {
        if (err) throw err;
        return callback(result);
    });    
  }

  deletar(connection) {
    var sql = "DELETE FROM usuarios_da_plataforma WHERE apelido =  ?";
  
    connection.query(sql, [this.apelido], function (err, result) {
      if (err) throw "teste";
      //if (err) console.error('err from callback: ' + err.stack);
      });
    }
  
  atualizar(connection) {
    try {
      var sql = "UPDATE usuarios_da_plataforma SET cpf = ?, nome = ?, sobrenome = ?, papel = ?, email = ?, telefone = ?, senha = ? WHERE apelido = ?";
    
      connection.query(sql, [this.cpf, this.nome, this.sobrenome, this.papel, this.email, this.telefone, this.senha, this.apelido], function (err, result) {
        if (err) throw "teste";
        //if (err) console.error('err from callback: ' + err.stack);
        });
    } catch (e) {
      console.error('err from callback: ' + e.stack);
      throw e;
    }
  }

  pesquisarPapel(connection, callback) {
    var sql = "SELECT papel FROM usuarios_da_plataforma WHERE apelido = ?";

    connection.query(sql, [this.apelido], function (err, result) {
        if (err) throw err;
        return callback(result);
    });    
  }
}
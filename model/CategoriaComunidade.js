module.exports = class CategoriaComunidade {
    constructor() {
      this.id = 0;
      this.nome = "";
      this.descricao = "";
      this.criador = "";
    }

    setId(i){
      this.id = i;
    }

    getId(){
      return this.id;
    }
  
    setNome(n) {
      this.nome = n;
    }
    getNome() {
      return this.nome;
    }
  
    setDescricao(d) {
      this.descricao = d;
    }
    getDescricao() {
      return this.descricao;
    }
  
    setCriador(c) {
      this.criador = c;
    }
    getCriador() {
      return this.criador;
    }
    
    inserir(connection) {
      try {
        var sql =
          "INSERT INTO  categorias_comunidades (nome, descricao,criador) VALUES(?,?,?)";
  
        connection.query(sql, [this.nome, this.descricao, this.criador],function (err, result) {
            if (err) throw "teste";
            //if (err) console.error('err from callback: ' + err.stack);
        });
      } catch (e) {
        console.error("err from callback: " + e.stack);
        throw e;
      }
    }
  
    listar(connection, callback) {
      var sql = "SELECT * FROM categorias_comunidades";
  
      connection.query(sql, function (err, result) {
        if (err) throw err;
        return callback(result);
      });
    }
  
    pesquisar(connection, callback) {
      var sql = "SELECT * FROM categorias_comunidades WHERE nome like ?";
  
      connection.query(sql, [this.nome], function (err, result) {
        if (err) throw err;
        return callback(result);
      });
    }
    consultarChave(connection, callback) {
      var sql = "SELECT * FROM categorias_comunidades WHERE a.id = ? ";

      connection.query(sql, [this.id], function (err, result) {
      if (err) throw err;
      return callback(result);
      });    
    }

    deletar(connection) {
      var sql = "DELETE FROM categorias_comunidade WHERE id =  ?";
    
      connection.query(sql, [this.id], function (err, result) {
        if (err) throw "teste";
        //if (err) console.error('err from callback: ' + err.stack);
        });
      }
    
    atualizar(connection) {
      try {
        var sql = "UPDATE categorias_comunidade SET nome = ?, descricao = ?, criador = ? WHERE categoria_id = ?";
      
        connection.query(sql, [this.nome, this.descricao, this.criador, this.id], function (err, result) {
          if (err) throw "teste";
          //if (err) console.error('err from callback: ' + err.stack);
          });
      } catch (e) {
        console.error('err from callback: ' + e.stack);
        throw e;
      }
    }
  };
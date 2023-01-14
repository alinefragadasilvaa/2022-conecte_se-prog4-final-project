module.exports = class RamoEmpresa {
    constructor() {
      this.id = 0;
      this.nome = "";
      this.descricao = "";
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
    inserir(connection) {
      try {
        var sql = "INSERT INTO ramos_empresas (nome, descricao) VALUES(?,?)";
  
        connection.query(
          sql,
          [this.nome, this.descricao],
          function (err, result) {
            if (err) throw "teste";
            //if (err) console.error('err from callback: ' + err.stack);
          }
        );
      } catch (e) {
        console.error("err from callback: " + e.stack);
        throw e;
      }
    }
  
    listar(connection, callback) {
      var sql = "SELECT * FROM ramos_empresas";
  
      connection.query(sql, function (err, result) {
        if (err) throw err;
        return callback(result);
      });
    }
  
    pesquisar(connection, callback) {
      var sql = "SELECT * FROM ramos_empresas WHERE nome like ?";
  
      connection.query(sql, [this.nome], function (err, result) {
        if (err) throw err;
        return callback(result);
      });
    }

    deletar(connection) {
      var sql = "DELETE FROM ramos_empresas WHERE id =  ?";
    
      connection.query(sql, [this.id], function (err, result) {
        if (err) throw "teste";
        //if (err) console.error('err from callback: ' + err.stack);
        });
      }
    
    atualizar(connection) {
      try {
        var sql = "UPDATE ramos_empresas SET nome = ?, descricao = ? WHERE ramo_id = ?";
      
        connection.query(sql, [this.nome, this.descricao, this.id], function (err, result) {
          if (err) throw "teste";
          //if (err) console.error('err from callback: ' + err.stack);
          });
      } catch (e) {
        console.error('err from callback: ' + e.stack);
        throw e;
      }
    }
  };
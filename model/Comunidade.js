module.exports = class Comunidade {
    constructor() {
      this.id = 0;
      this.nome = "";
      this.descricao = "";
      this.categoria = 0;
      this.dataCriacao = "";
      this.criador = "";
      this.estado = 0;
     
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
  
    setCategoria(c) {
      this.categoria = c;
    }
    getCategoria() {
      return this.categoria;
    }
  
    setCriador(c) {
      this.criador = c;
    }
    getCriador() {
      return this.criador;
    }
  
    setEstado(e) {
      this.estado = e;
    }
    getEstado() {
      return this.estado;
    }
  
    setDataCriacao(dc) {
      this.dataCriacao = dc;
    }
    getDataCriacao(dCc) {
      return this.dataCriacao;
    }
  
    inserir(connection) {
      try {
        var sql =
          "INSERT INTO comunidades (nome, descricao,categoria, data_criacao, criador, estado ) VALUES(?,?,?,?,?,?)";
  
        connection.query(
          sql,
          [
            this.nome,
            this.descricao,
            this.categoria,
            this.dataCriacao,
            this.criador,
            this.estado,
          ],
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
      var sql = "SELECT a.comunidade_id, a.nome, a.descricao, a.categoria, b.nome as categoria_nome, "+
      "date_format(a.data_criacao, '%d/%m/%Y') as data_criacao, a.criador, a.estado FROM " +
      "comunidades as a, categorias_comunidades as b " +
      "WHERE a.categoria = b.categoria_id";
  
      connection.query(sql, function (err, result) {
        if (err) throw err;
        return callback(result);
      });
    }
  
    pesquisar(connection, callback) {
      var sql = "SELECT a.comunidade_id, a.nome, a.descricao, a.categoria, b.nome as categoria_nome, "+
      "date_format(a.data_criacao, '%d/%m/%Y') as data_criacao, a.criador, a.estado FROM " +
      "comunidades as a, categorias_comunidades as b " +
      "WHERE a.categoria = b.categoria_id AND a.nome like ?";
  
      connection.query(sql, [this.nome], function (err, result) {
        if (err) throw err;
        return callback(result);
      });
    }

    deletar(connection) {
      var sql = "DELETE FROM comunidades WHERE id =  ?";
    
      connection.query(sql, [this.id], function (err, result) {
        if (err) throw "teste";
        //if (err) console.error('err from callback: ' + err.stack);
        });
      }
    
    atualizar(connection) {
      try {
        var sql = "UPDATE comunidades SET nome = ?, descricao = ?, categoria = ?, data_criacao = ?, criador = ?, estado = ? WHERE comunidade_id = ?";
      
        connection.query(sql, [this.nome, this.descricao, this.categoria, this.dataCriacao, this.criador, this.estado, this.id], function (err, result) {
          if (err) throw "teste";
          //if (err) console.error('err from callback: ' + err.stack);
          });
      } catch (e) {
        console.error('err from callback: ' + e.stack);
        throw e;
      }
    }
  };
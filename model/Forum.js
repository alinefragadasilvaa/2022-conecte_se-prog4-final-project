module.exports = class Forum {
    constructor() {
      this.id = 0;
      this.titulo = "";
      this.assunto = "";
      this.dataCriacao = "";
      this.autor = "";
      this.comunidade = 0;
      this.estado = 0;
    }

    setId(i){
      this.id = i;
    }

    getId(){
      return this.id;
    }

    setTitulo(t) {
      this.titulo = t;
    }
    getTitulo() {
      return this.titulo;
    }
  
    setAssunto(a) {
      this.assunto = a;
    }
    getAssunto() {
      return this.assunto;
    }
  
    setDataCriacao(d) {
      this.dataCriacao = d;
    }
    getDataCriacao() {
      return this.dataCriacao;
    }
  
    setAutor(a) {
      this.autor = a;
    }
    getAutor() {
      return this.autor;
    }
  
    setComunidade(c) {
      this.comunidade = c;
    }
    getComunidade() {
      return this.comunidade;
    }
  
    setEstado(e) {
      this.estado = e;
    }
    getEstado() {
      return this.estado;
    }
  
    inserir(connection) {
      try {
        var sql =
          "INSERT INTO foruns (titulo, assunto, data_criacao, autor, comunidade, estado) VALUES(?,?,?,?,?,?)";
  
        connection.query(
          sql,
          [
            this.titulo,
            this.assunto,
            this.dataCriacao,
            this.autor,
            this.comunidade,
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
      var sql = "SELECT a.forum_id, a.titulo, a.assunto, date_format(a.data_criacao, '%d/%m/%Y') as data_criacao,"+
       "a.autor, a.comunidade, b.nome as comunidade_nome, a.estado FROM foruns as a, comunidades as b WHERE a.comunidade = b.comunidade_id";
  
      connection.query(sql, function (err, result) {
        if (err) throw err;
        return callback(result);
      });
    }
  
    pesquisar(connection, callback) {
      var sql = "SELECT a.forum_id, a.titulo, a.assunto, date_format(a.data_criacao, '%d/%m/%Y') as data_criacao,"+
      "a.autor, a.comunidade, b.nome as comunidade_nome, a.estado FROM foruns as a, comunidades as b WHERE a.comunidade = b.comunidade_id AND a.titulo like ?";
  
      connection.query(sql, [this.titulo], function (err, result) {
        if (err) throw err;
        return callback(result);
      });
    }

    deletar(connection) {
      var sql = "DELETE FROM foruns WHERE id =  ?";
    
      connection.query(sql, [this.id], function (err, result) {
        if (err) throw "teste";
        //if (err) console.error('err from callback: ' + err.stack);
        });
      }
    
    atualizar(connection) {
      try {
        var sql = "UPDATE foruns SET titulo = ?, assunto = ?, data_criacao = ?, autor = ?, comunidade = ?, estado = ? WHERE forum_id = ?";
      
        connection.query(sql, [this.titulo, this.assunto, this.dataCriacao, this.autor, this.comunidade, this.estado, this.email, this.id], function (err, result) {
          if (err) throw "teste";
          //if (err) console.error('err from callback: ' + err.stack);
          });
      } catch (e) {
        console.error('err from callback: ' + e.stack);
        throw e;
      }
    }

    buscarForuns(connection, callback) {
      var sql = "SELECT a.forum_id, a.titulo, a.assunto, date_format(a.data_criacao, '%d/%m/%Y') as data_criacao,"+
      "a.autor, a.comunidade, b.nome as comunidade_nome, a.estado FROM foruns as a, comunidades as b WHERE a.comunidade = b.comunidade_id AND a.comunidade = ?";
  
      connection.query(sql, [this.comunidade], function (err, result) {
        if (err) throw err;
        return callback(result);
      });
    }

    pesquisarForum(connection, callback) {
      var sql = "SELECT a.forum_id, a.titulo, a.assunto, date_format(a.data_criacao, '%d/%m/%Y') as data_criacao,"+
      "a.autor, a.comunidade, b.nome as comunidade_nome, a.estado FROM foruns as a, comunidades as b WHERE a.comunidade = b.comunidade_id AND a.forum_id = ?";
  
      connection.query(sql, [this.id], function (err, result) {
        if (err) throw err;
        return callback(result);
      });
    }
  };
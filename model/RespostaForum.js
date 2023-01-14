module.exports = class RespostaForum {
    constructor() {
      this.id = 0;
      this.mensagem = "";
      this.dataCriacao = "";
      this.autor = "";
      this.forum = 0;
    }
  
    setId(i){
      this.id = i;
    }

    getId(){
      return this.id;
    }

    setMensagem(m) {
      this.mensagem = m;
    }
    getMensagem() {
      return this.mensagem;
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
  
    setForum(f) {
      this.forum = f;
    }
    getForum() {
      return this.forum;
    }
  
    inserir(connection) {
      try {
        var sql =
          "INSERT INTO  respostas_foruns (mensagem, data_criacao, autor, forum) VALUES(?,?,?,?)";
  
        connection.query(
          sql,
          [this.mensagem, this.dataCriacao, this.autor, this.forum],
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
      var sql = "SELECT a.resposta_id, a.mensagem, date_format(a.data_criacao, '%d/%m/%Y') as data_criacao,"+
       "a.autor, a.forum, b.titulo as forum_titulo FROM respostas_foruns as a, foruns as b WHERE a.forum = b.forum_id";
  
      connection.query(sql, function (err, result) {
        if (err) throw err;
        return callback(result);
      });
    }
  
    pesquisar(connection, callback) {
      var sql = "SELECT a.resposta_id, a.mensagem, date_format(a.data_criacao, '%d/%m/%Y') as data_criacao,"+
      "a.autor, a.forum, b.titulo as forum_titulo FROM respostas_foruns as a, foruns as b WHERE a.forum = b.forum_id AND a.mensagem like ?";
  
      connection.query(sql, [this.mensagem], function (err, result) {
        if (err) throw err;
        return callback(result);
      });
    }

    deletar(connection) {
      var sql = "DELETE FROM respostas_foruns WHERE id =  ?";
    
      connection.query(sql, [this.id], function (err, result) {
        if (err) throw "teste";
        //if (err) console.error('err from callback: ' + err.stack);
        });
      }
    
    atualizar(connection) {
      try {
        var sql = "UPDATE respostas_foruns SET mensagem = ?, data_criacao = ?, autor = ?, forum = ? WHERE resposta_id = ?";
      
        connection.query(sql, [this.mensagem, this.dataCriacao, this.autor, this.forum, this.id], function (err, result) {
          if (err) throw "teste";
          //if (err) console.error('err from callback: ' + err.stack);
          });
      } catch (e) {
        console.error('err from callback: ' + e.stack);
        throw e;
      }
    }

    buscarRespostas(connection, callback) {
      var sql = "SELECT a.resposta_id, a.mensagem, date_format(a.data_criacao, '%d/%m/%Y') as data_criacao,"+
      "a.autor, a.forum, b.titulo as forum_titulo FROM respostas_foruns as a, foruns as b WHERE a.forum = b.forum_id AND a.forum = ?";
  
      connection.query(sql, [this.forum], function (err, result) {
        if (err) throw err;
        return callback(result);
      });
    }
  };
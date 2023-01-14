module.exports = class Empresa {
    constructor() {
      this.id = 0;
      this.nome = "";
      this.cnpj = "";
      this.proprietario = "";
      this.ramo = 0;
      this.sobre = "";
      this.fundacao = "";
      this.numFuncionarios = 0;
      this.telefone = "";
      this.email = "";
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
  
    setCnpj(c) {
      this.cnpj = c;
    }
    getCnpj() {
      return this.cnpj;
    }
  
    setProprietario(p) {
      this.proprietario = p;
    }
    getProprietario() {
      return this.proprietario;
    }
  
    setRamo(r) {
      this.ramo = r;
    }
    getRamo() {
      return this.ramo;
    }
  
    setSobre(s) {
      this.sobre = s;
    }
    getSobre() {
      return this.sobre;
    }
  
    setFundacao(f) {
      this.fundacao = f;
    }
    getFundacao() {
      return this.fundacao;
    }
  
    setNumFuncionarios(n) {
      this.numFuncionarios = n;
    }
    getNumFuncionarios() {
      return this.numFuncionarios;
    }
  
    setTelefone(t) {
      this.telefone = t;
    }
    getTelefone() {
      return this.telefone;
    }
  
    setEmail(e) {
      this.email = e;
    }
    getEmail() {
      return this.email;
    }
  
    inserir(connection) {
      try {
        var sql =
          "INSERT INTO  empresas (nome, cnpj, proprietario, ramo, sobre_empresa, fundacao, numero_funcionarios, telefone, email) VALUES(?,?,?,?,?,?,?,?,?)";
  
        connection.query(
          sql,
          [
            this.nome,
            this.cnpj,
            this.proprietario,
            this.ramo,
            this.sobre,
            this.fundacao,
            this.numFuncionarios,
            this.telefone,
            this.email,
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
      var sql = "SELECT a.empresa_id, a.nome, a.cnpj, a.proprietario, a.ramo, b.nome as ramo_nome, "+
      "a.sobre_empresa, date_format(a.fundacao, '%d/%m/%Y') as fundacao, a.numero_funcionarios, "+
      "a.telefone, a.email FROM empresas as a, ramos_empresas as b WHERE a.ramo = b.ramo_id";
  
      connection.query(sql, function (err, result) {
        if (err) throw err;
        return callback(result);
      });
    }
  
    pesquisar(connection, callback) {
      var sql = "SELECT a.empresa_id, a.nome, a.cnpj, a.proprietario, a.ramo, b.nome as ramo_nome, "+
      "a.sobre_empresa, date_format(a.fundacao, '%d/%m/%Y') as fundacao, a.numero_funcionarios, "+
      "a.telefone, a.email FROM empresas as a, ramos_empresas as b WHERE a.ramo = b.ramo_id AND a.nome like ?";
  
      connection.query(sql, [this.nome], function (err, result) {
        if (err) throw err;
        return callback(result);
      });
    }

    deletar(connection) {
      var sql = "DELETE FROM empresas WHERE id =  ?";
    
      connection.query(sql, [this.id], function (err, result) {
        if (err) throw "teste";
        //if (err) console.error('err from callback: ' + err.stack);
        });
      }
    
    atualizar(connection) {
      try {
        var sql = "UPDATE empresas SET nome = ?, cnpj = ?, proprietario = ?, ramo = ?, sobre_empresa = ?, fundacao = ?,  numero_funcionarios = ?,  telefone = ?,  email = ? WHERE empresa_id = ?";
      
        connection.query(sql, [this.nome, this.cnpj, this.proprietario, this.ramo, this.sobre, this.fundacao,this.numFuncionarios, this.telefone, this.email, this.id], function (err, result) {
          if (err) throw "teste";
          //if (err) console.error('err from callback: ' + err.stack);
          });
      } catch (e) {
        console.error('err from callback: ' + e.stack);
        throw e;
      }
    }
  };
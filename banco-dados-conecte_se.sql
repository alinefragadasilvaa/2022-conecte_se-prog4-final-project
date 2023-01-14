drop database conecte_se;
create database conecte_se;
use conecte_se;

create table papeis_usuario(
papel_id int not null auto_increment,
nome varchar(50) not null,
descricao varchar(250) not null,
primary key(papel_id)
);

create table usuarios_da_plataforma(
apelido varchar(30) not null,
cpf varchar(11) not null,
nome varchar(50) not null,
sobrenome varchar(50) not null,
papel int not null,
email varchar(50) not null,
telefone varchar(11) not null,
senha varchar(255) not null,
primary key(apelido)
);

create table categorias_comunidades(
categoria_id int auto_increment,
nome varchar(50) not null,
descricao varchar(250),
criador varchar(30) not null,
primary key(categoria_id),
foreign key(criador)
references usuarios_da_plataforma(apelido)
);

create table comunidades(
comunidade_id int auto_increment,
nome varchar(50) not null,
descricao varchar(250),
categoria int not null,
data_criacao date not null,
criador varchar(30) not null,
estado int not null,
primary key(comunidade_id),
foreign key(criador) 
references usuarios_da_plataforma(apelido),
foreign key(categoria) 
references categorias_comunidades(categoria_id)
);

create table foruns(
forum_id int auto_increment,
titulo varchar(50) not null,
assunto varchar(1500) not null,
data_criacao date not null,
autor varchar(30) not null, 
comunidade int not null,
estado int not null, 
primary key(forum_id),
foreign key(autor)
references comunidades(criador),
foreign key(comunidade)
references comunidades(comunidade_id)
);

create table respostas_foruns(
resposta_id int auto_increment,
mensagem varchar(2500) not null,
data_criacao date not null,
autor varchar(30) not null, 
forum int not null,
primary key(resposta_id),
foreign key(autor)
references usuarios_da_plataforma(apelido),
foreign key(forum)
references foruns(forum_id)
);

create table ramos_empresas(
ramo_id int auto_increment,
nome varchar(50) not null,
descricao varchar(250) not null,
primary key(ramo_id)
);

create table empresas(
empresa_id int auto_increment,
nome varchar(50) not null,
cnpj varchar(14),
proprietario varchar(30) not null,
ramo int not null,
sobre_empresa varchar(250) not null,
fundacao date not null,
numero_funcionarios int not null,
telefone varchar(11) not null,
email varchar(50) not null,
primary key(empresa_id),
foreign key(ramo)
references ramos_empresas(ramo_id),
foreign key(proprietario)
references usuarios_da_plataforma(apelido)
);

CREATE USER 'equipe-dev'@'localhost' IDENTIFIED BY '12345678';

GRANT ALL PRIVILEGES ON *.* TO
'equipe-dev'@'localhost';

FLUSH PRIVILEGES;

INSERT INTO papeis_usuario (nome, descricao) VALUES ("Administrador", "Pessoa pertencente à equipe de desenvolvedores");
INSERT INTO papeis_usuario (nome, descricao) VALUES ("Empreendedor", "Pessoa que empreende");
INSERT INTO papeis_usuario (nome, descricao) VALUES ("Outros", "Outros usuários, como estudantes e consumidores");
INSERT INTO ramos_empresas (nome, descricao) VALUES ("Indústria", "Transformação de matéria-prima em produtos a serem comercializados posteriormente");
INSERT INTO ramos_empresas (nome, descricao) VALUES ("Comércio", "Venda dos produtos");
INSERT INTO ramos_empresas (nome, descricao) VALUES ("Serviços", "Oferta de trabalho ao consumidor");
INSERT INTO usuarios_da_plataforma (apelido, cpf, nome, sobrenome, papel, email, telefone, senha) VALUES ("zero", "00000000000", "Administrador", "Zero", (select papel_id from papeis_usuario where nome = "Administrador"), "admin@gmail.com", "00000000000", "1234567");
INSERT INTO categorias_comunidades (nome, descricao, criador) VALUES ("Finanças", "Aspectos econômicos, controle de receitas e despesas, financeiro", "zero");
INSERT INTO categorias_comunidades (nome, descricao, criador) VALUES ("Marketings", "Promoção, propagandoa, redes sociais", "zero");
INSERT INTO categorias_comunidades (nome, descricao, criador) VALUES ("Gestão de pessoas", "Equipe, RH, contratações", "zero");
INSERT INTO categorias_comunidades (nome, descricao, criador) VALUES ("Operação/Produção", "Processos, sistemas, ferramentas", "zero");

SELECT * FROM papeis_usuario;
SELECT * FROM ramos_empresas;
SELECT * FROM usuarios_da_plataforma;
SELECT * FROM categorias_comunidades;
SELECT * FROM comunidades;
SELECT * FROM empresas;
SELECT * FROM foruns;
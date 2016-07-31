CREATE TABLE usuario(
	id_usuario INTEGER PRIMARY KEY AUTO_INCREMENT,
    login VARCHAR(20),
    senha VARCHAR(20),
    token VARCHAR(100)
);



CREATE TABLE estabelecimento(
	id_estabelecimento INTEGER PRIMARY KEY AUTO_INCREMENT,
    cnpj VARCHAR(20),
    endereco VARCHAR(200),
    responsavel INTEGER NOT NULL,
    razao_social VARCHAR(50)
);

CREATE TABLE nota_fiscal(
	id_nota INTEGER PRIMARY KEY AUTO_INCREMENT,
    estabelecimento INTEGER NOT NULL,
    chave VARCHAR(50),
    data_emissao DATE,
    emissor VARCHAR(50),
    cnpj_emissor VARCHAR(20),
    valor DECIMAL(10,2)
    
);

CREATE VIEW lista_notas AS(SELECT * FROM nota_fiscal JOIN estabelecimento ON nota_fiscal.estabelecimento = 
estabelecimento.id_estabelecimento)


ALTER TABLE estabelecimento ADD CONSTRAINT FOREIGN KEY (responsavel) REFERENCES usuario(id_usuario);
ALTER TABLE nota_fiscal ADD CONSTRAINT FOREIGN KEY (estabelecimento) REFERENCES estabelecimento (id_estabelecimento);

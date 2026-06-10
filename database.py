import sqlite3

class Veiculo:
    def __init__(self, modelo, ano, placa, caminho_foto="", id_veiculo=None):
        self.id_veiculo = id_veiculo
        self.modelo = modelo
        self.ano = ano
        self.placa = placa
        self.caminho_foto = caminho_foto

class Projeto:
    def __init__(self, titulo, orcamento_limite, id_veiculo, id_projeto=None):
        self.id_projeto = id_projeto
        self.titulo = titulo
        self.orcamento_limite = orcamento_limite
        self.id_veiculo = id_veiculo

class Peca:
    def __init__(self, descricao, valor, id_projeto, status=0, id_peca=None):
        self.id_peca = id_peca
        self.descricao = descricao
        self.valor = valor
        self.id_projeto = id_projeto
        self.status = status


class GerenciadorBanco:
    def __init__(self, nome_banco="oficina_restauracao.db"):
        self.nome_banco = nome_banco
        self.conectar()
        self.criar_tabelas()

        

    def conectar(self):
        self.conexao = sqlite3.connect(self.nome_banco)
        self.conexao.execute("PRAGMA foreign_keys = ON")
        return self.conexao

    def criar_tabelas(self):
        cursor = self.conexao.cursor()
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS veiculos (
                id_veiculo INTEGER PRIMARY KEY AUTOINCREMENT,
                modelo TEXT NOT NULL,
                ano INTEGER NOT NULL,
                placa TEXT NOT NULL UNIQUE,
                caminho_foto TEXT DEFAULT ''
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS projetos (
                id_projeto INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                orcamento_limite REAL NOT NULL,
                id_veiculo INTEGER NOT NULL,
                FOREIGN KEY (id_veiculo) REFERENCES veiculos (id_veiculo) ON DELETE CASCADE
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS pecas (
                id_peca INTEGER PRIMARY KEY AUTOINCREMENT,
                descricao TEXT NOT NULL,
                valor REAL NOT NULL,
                id_projeto INTEGER NOT NULL,
                status INTEGER DEFAULT 0,
                FOREIGN KEY (id_projeto) REFERENCES projetos (id_projeto) ON DELETE CASCADE
            )
        """)
        self.conexao.commit()
        cursor.close()

    def fechar_conexao(self):
        if self.conexao:
            self.conexao.close()


    def inserir_veiculo(self, veiculo):
        sql = "INSERT INTO veiculos (modelo, ano, placa, caminho_foto) VALUES (?, ?, ?, ?)"
        cursor = self.conexao.cursor()
        cursor.execute(sql, (veiculo.modelo, veiculo.ano, veiculo.placa, veiculo.caminho_foto))
        self.conexao.commit()
        veiculo.id_veiculo = cursor.lastrowid
        cursor.close()

    def inserir_projeto(self, projeto):
        sql = "INSERT INTO projetos (titulo, orcamento_limite, id_veiculo) VALUES (?, ?, ?)"
        cursor = self.conexao.cursor()
        cursor.execute(sql, (projeto.titulo, projeto.orcamento_limite, projeto.id_veiculo))
        self.conexao.commit()
        projeto.id_projeto = cursor.lastrowid
        cursor.close()

    def inserir_peca(self, peca):
        sql = "INSERT INTO pecas (descricao, valor, id_projeto, status) VALUES (?, ?, ?, ?)"
        cursor = self.conexao.cursor()
        cursor.execute(sql, (peca.descricao, peca.valor, peca.id_projeto, peca.status))
        self.conexao.commit()
        peca.id_peca = cursor.lastrowid
        cursor.close()


    def atualizar_veiculo(self, id_veiculo, modelo, ano, placa, caminho_foto=""):
        sql = "UPDATE veiculos SET modelo = ?, ano = ?, placa = ?, caminho_foto = ? WHERE id_veiculo = ?"
        cursor = self.conexao.cursor()
        cursor.execute(sql, (modelo, ano, placa, caminho_foto, id_veiculo))
        self.conexao.commit()
        cursor.close()

    def atualizar_projeto(self, id_projeto, titulo, orcamento_limite):
        sql = "UPDATE projetos SET titulo = ?, orcamento_limite = ? WHERE id_projeto = ?"
        cursor = self.conexao.cursor()
        cursor.execute(sql, (titulo, orcamento_limite, id_projeto))
        self.conexao.commit()
        cursor.close()

    def atualizar_status_peca(self, id_peca, novo_status):
        """NOVO: Altera o status da peça (0 para pendente, 1 para comprado)"""
        sql = "UPDATE pecas SET status = ? WHERE id_peca = ?"
        cursor = self.conexao.cursor()
        cursor.execute(sql, (novo_status, id_peca))
        self.conexao.commit()
        cursor.close()


    def deletar_projeto(self, id_projeto):
        sql = "DELETE FROM projetos WHERE id_projeto = ?"
        cursor = self.conexao.cursor()
        cursor.execute(sql, (id_projeto,))
        self.conexao.commit()
        cursor.close()

    def deletar_peca(self, id_peca):
        sql = "DELETE FROM pecas WHERE id_peca = ?"
        cursor = self.conexao.cursor()
        cursor.execute(sql, (id_peca,))
        self.conexao.commit()
        cursor.close()


    def listar_veiculos(self):
        cursor = self.conexao.cursor()
        cursor.execute("SELECT * FROM veiculos")
        linhas = cursor.fetchall()
        cursor.close()
        return [Veiculo(id_veiculo=l[0], modelo=l[1], ano=l[2], placa=l[3], caminho_foto=l[4]) for l in linhas]


    def listar_pecas_por_projeto(self, id_projeto):
        """NOVO: Busca apenas as peças daquele projeto específico."""
        cursor = self.conexao.cursor()
        cursor.execute("SELECT * FROM pecas WHERE id_projeto = ?", (id_projeto,))
        linhas = cursor.fetchall()
        cursor.close()
        return [Peca(id_peca=l[0], descricao=l[1], valor=l[2], id_projeto=l[3], status=l[4]) for l in linhas]

    def listar_projetos(self):
        """Mantido para a aba de relatório geral."""
        cursor = self.conexao.cursor()
        cursor.execute("SELECT * FROM projetos")
        linhas = cursor.fetchall()
        cursor.close()
        return [Projeto(id_projeto=l[0], titulo=l[1], orcamento_limite=l[2], id_veiculo=l[3]) for l in linhas]

    def listar_pecas(self):
        """Mantido para a aba de relatório geral."""
        cursor = self.conexao.cursor()
        cursor.execute("SELECT * FROM pecas")
        linhas = cursor.fetchall()
        cursor.close()
        return [Peca(id_peca=l[0], descricao=l[1], valor=l[2], id_projeto=l[3], status=l[4]) for l in linhas]

    def atualizar_peca(self, id_peca, nova_descricao, novo_valor):
        """Atualiza os dados de uma peça específica."""
        sql = "UPDATE pecas SET descricao = ?, valor = ? WHERE id_peca = ?"
        cursor = self.conexao.cursor()
        cursor.execute(sql, (nova_descricao, novo_valor, id_peca))
        self.conexao.commit()
        cursor.close()

if __name__ == "__main__":
    db = GerenciadorBanco()
    print("Banco de dados atualizado recriado com sucesso com as novas colunas!")
    
    carro_teste = Veiculo(modelo="Ford Del Rey GL", ano=1987, placa="CSD-8F49")
    db.inserir_veiculo(carro_teste)
    print("Veículo de teste inserido.")
    db.fechar_conexao()
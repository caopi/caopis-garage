# API web do projeto GARAGE DB.
# Este arquivo é a "ponte" entre a página web (React) e o banco de dados (database.py).
# Cada rota abaixo recebe um pedido da página e usa o GerenciadorBanco para responder.

from flask import Flask, request, jsonify
from flask_cors import CORS
from database import GerenciadorBanco, Veiculo, Projeto, Peca
import segredo  # usuário e senha ficam nesse arquivo, que não sobe para o GitHub

app = Flask(__name__)
CORS(app)  # permite que a página web (que roda em outro endereço) converse com esta API


# =========================================================
# LOGIN / PROTEÇÃO
# =========================================================

@app.before_request
def porteiro():
    """Roda antes de TODAS as rotas: barra quem não mandou a senha certa."""
    # O navegador manda um pedido extra "OPTIONS" antes dos outros (CORS); deixa passar
    if request.method == "OPTIONS" or request.path == "/api/login":
        return
    if request.headers.get("X-Senha") != segredo.SENHA:
        return jsonify({"erro": "Acesso negado. Faça login."}), 401


@app.route("/api/login", methods=["POST"])
def login():
    dados = request.get_json()
    if dados["usuario"] == segredo.USUARIO and dados["senha"] == segredo.SENHA:
        return jsonify({"ok": True})
    return jsonify({"ok": False}), 401


# =========================================================
# VEÍCULOS
# =========================================================

@app.route("/api/veiculos", methods=["GET"])
def listar_veiculos():
    db = GerenciadorBanco()
    veiculos = db.listar_veiculos()
    db.fechar_conexao()
    # vars(v) transforma o objeto Veiculo em um dicionário, que vira JSON
    return jsonify([vars(v) for v in veiculos])


@app.route("/api/veiculos", methods=["POST"])
def criar_veiculo():
    dados = request.get_json()
    veiculo = Veiculo(dados["modelo"], dados["ano"], dados["placa"], dados.get("caminho_foto", ""))
    db = GerenciadorBanco()
    db.inserir_veiculo(veiculo)
    db.fechar_conexao()
    return jsonify(vars(veiculo)), 201


@app.route("/api/veiculos/<int:id_veiculo>", methods=["PUT"])
def atualizar_veiculo(id_veiculo):
    dados = request.get_json()
    db = GerenciadorBanco()
    db.atualizar_veiculo(id_veiculo, dados["modelo"], dados["ano"], dados["placa"], dados.get("caminho_foto", ""))
    db.fechar_conexao()
    return jsonify({"ok": True})


# =========================================================
# PROJETOS
# =========================================================

@app.route("/api/projetos", methods=["GET"])
def listar_projetos():
    db = GerenciadorBanco()
    projetos = db.listar_projetos()
    db.fechar_conexao()
    return jsonify([vars(p) for p in projetos])


@app.route("/api/veiculos/<int:id_veiculo>/projetos", methods=["GET"])
def listar_projetos_do_veiculo(id_veiculo):
    db = GerenciadorBanco()
    # Pega todos os projetos e separa só os do veículo pedido
    projetos = [p for p in db.listar_projetos() if p.id_veiculo == id_veiculo]
    db.fechar_conexao()
    return jsonify([vars(p) for p in projetos])


@app.route("/api/projetos", methods=["POST"])
def criar_projeto():
    dados = request.get_json()
    projeto = Projeto(dados["titulo"], dados["orcamento_limite"], dados["id_veiculo"])
    db = GerenciadorBanco()
    db.inserir_projeto(projeto)
    db.fechar_conexao()
    return jsonify(vars(projeto)), 201


@app.route("/api/projetos/<int:id_projeto>", methods=["PUT"])
def atualizar_projeto(id_projeto):
    dados = request.get_json()
    db = GerenciadorBanco()
    db.atualizar_projeto(id_projeto, dados["titulo"], dados["orcamento_limite"])
    db.fechar_conexao()
    return jsonify({"ok": True})


@app.route("/api/projetos/<int:id_projeto>", methods=["DELETE"])
def deletar_projeto(id_projeto):
    db = GerenciadorBanco()
    db.deletar_projeto(id_projeto)
    db.fechar_conexao()
    return jsonify({"ok": True})


# =========================================================
# PEÇAS
# =========================================================

@app.route("/api/pecas", methods=["GET"])
def listar_pecas():
    db = GerenciadorBanco()
    pecas = db.listar_pecas()
    db.fechar_conexao()
    return jsonify([vars(p) for p in pecas])


@app.route("/api/projetos/<int:id_projeto>/pecas", methods=["GET"])
def listar_pecas_do_projeto(id_projeto):
    db = GerenciadorBanco()
    pecas = db.listar_pecas_por_projeto(id_projeto)
    db.fechar_conexao()
    return jsonify([vars(p) for p in pecas])


@app.route("/api/pecas", methods=["POST"])
def criar_peca():
    dados = request.get_json()
    peca = Peca(dados["descricao"], dados["valor"], dados["id_projeto"])
    db = GerenciadorBanco()
    db.inserir_peca(peca)
    db.fechar_conexao()
    return jsonify(vars(peca)), 201


@app.route("/api/pecas/<int:id_peca>", methods=["PUT"])
def atualizar_peca(id_peca):
    dados = request.get_json()
    db = GerenciadorBanco()
    db.atualizar_peca(id_peca, dados["descricao"], dados["valor"])
    db.fechar_conexao()
    return jsonify({"ok": True})


@app.route("/api/pecas/<int:id_peca>/status", methods=["PUT"])
def atualizar_status_peca(id_peca):
    dados = request.get_json()
    db = GerenciadorBanco()
    db.atualizar_status_peca(id_peca, dados["status"])
    db.fechar_conexao()
    return jsonify({"ok": True})


@app.route("/api/pecas/<int:id_peca>", methods=["DELETE"])
def deletar_peca(id_peca):
    db = GerenciadorBanco()
    db.deletar_peca(id_peca)
    db.fechar_conexao()
    return jsonify({"ok": True})


if __name__ == "__main__":
    app.run(port=5000, debug=True)

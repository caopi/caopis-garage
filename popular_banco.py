

from database import GerenciadorBanco, Veiculo, Projeto, Peca

PECAS_POR_CATEGORIA = {
    "Motor": [
        "1x Correia do alternador (ressecada)",
        "1x Kit junta da tampa de válvula (vazando)",
        "2x Coxim do motor (estourado)",
        "1x Coxim pudim frontal",
        "1x Junta do cárter (vazando)",
        "1x Tampa de óleo",
        "1x Junta da tampa de correia do comando",
        "1x Retentor do virabrequim",
        "4x Óleo 20W50 (vencido por tempo)",
        "1x Filtro de óleo",
        "1x Filtro de ar",
        "2x Filtro de combustível",
        "1x Mangueira de 1 metro de 4mm (partida a frio)",
        "1x Tampa da partida a frio",
    ],
    "Ignição": [
        "1x Jogo de velas",
        "1x Jogo de cabo de vela (ressecado)",
        "1x Tampa do distribuidor",
        "1x Rotor do distribuidor",
        "1x O-ring de vedação do distribuidor",
    ],
    "Arrefecimento": [
        "1x Kit mangueira arrefecimento (superior, inferior, ar quente coletor)",
        "1x Radiador (enferrujado)",
        "1x Tampa do radiador",
        "5x Aditivo do radiador",
        "1x Bomba d'água",
        "1x Carcaça da bomba d'água",
    ],
    "Suspensão": [
        "2x Bieletas (ressecadas)",
        "2x Bucha da bandeja superior (estourada)",
        "4x Bucha da bandeja inferior (estourada)",
        "2x Pivô superior (com folga)",
        "2x Pivô inferior (com folga)",
        "4x Bucha do braço tensor (estourada)",
        "2x Bucha da bandeja central do eixo traseiro (rangendo)",
        "4x Bucha do braço tensor traseiro (com folga / ressecada)",
    ],
    "Direção": [
        "1x Caixa de direção (com folga)",
        "2x Terminal de direção (com folga e coifa rasgada)",
    ],
    "Freios": [
        "2x Cilindro de roda traseira (vazando)",
        "2x Jogo de lona traseiro (trincado)",
        "2x Disco de freio dianteiro (abaixo do limite de retífica)",
        "2x Flexível de freio dianteiro (ressecado/rachado)",
        "1x Flexível de freio traseiro (ressecado/rachado)",
        "4x Fluido de freio DOT 4",
    ],
    "Câmbio e Transmissão": [
        "2x Coifa da homocinética (rasgada)",
        "2x Coifa do câmbio",
        "1x Kit trambulador (com folga)",
        "1x Haste seletora (com folga)",
        "2x Óleo de câmbio SAE 90",
    ],
    "Escapamento": [
        "1x Tubo motor com abafador central (furado e enferrujado)",
        "1x Silencioso traseiro (furado e enferrujado)",
        "1x Coxim do escapamento na saída do motor (estourado)",
        "2x Coxim do silencioso traseiro (estourado)",
    ],
    "Rodas e Pneus": [
        "2x Rolamento de roda traseira (roncando / com folga)",
        "2x Retentor do rolamento de roda traseiro",
        "2x Pneu traseiro (no limite do TWI, com corte do lado direito)",
        "2x Calota do cubo traseiro",
    ],
    "Acabamento": [
        "1x Jogo de palheta dianteira (ressecado)",
    ],
}

db = GerenciadorBanco()

veiculos = db.listar_veiculos()
if veiculos:
    carro = veiculos[0]
else:
    carro = Veiculo(modelo="Ford Del Rey GL 1.6", ano=1987, placa="CSD-8549")
    db.inserir_veiculo(carro)

titulos_existentes = [p.titulo for p in db.listar_projetos() if p.id_veiculo == carro.id_veiculo]
total = 0
for categoria, lista_de_pecas in PECAS_POR_CATEGORIA.items():
    if categoria in titulos_existentes:
        print(f"Categoria '{categoria}' já existe, pulando.")
        continue
    projeto = Projeto(titulo=categoria, orcamento_limite=0, id_veiculo=carro.id_veiculo)
    db.inserir_projeto(projeto)
    for descricao in lista_de_pecas:
        db.inserir_peca(Peca(descricao=descricao, valor=0, id_projeto=projeto.id_projeto))
        total += 1
print(f"Pronto! {total} peças novas cadastradas.")

db.fechar_conexao()

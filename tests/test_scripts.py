import copy
import json
import sys
import unittest
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE / "scripts"))

import publicar  # noqa: E402
import validar_plano  # noqa: E402


def load(rel: str) -> dict:
    return json.loads((BASE / rel).read_text(encoding="utf-8"))


class ValidarA4(unittest.TestCase):
    def setUp(self) -> None:
        self.plan = load("documento-a4/exemplo-plano.json")

    def test_exemplo_passa(self) -> None:
        self.assertEqual(validar_plano.validate(self.plan).errors, 0)

    def test_callout_longo_e_erro(self) -> None:
        p = copy.deepcopy(self.plan)
        p["blocks"].append({"t": "callout", "kind": "dica", "text": "x" * 281})
        self.assertGreater(validar_plano.validate(p).errors, 0)

    def test_titulo_seguido_de_titulo_e_erro(self) -> None:
        p = copy.deepcopy(self.plan)
        i = next(k for k, b in enumerate(p["blocks"]) if b["t"] == "h2")
        p["blocks"][i:i] = [{"t": "h2", "text": "Seção vazia"}]
        msgs = [m for _, _, m in validar_plano.validate(p).items]
        self.assertTrue(any("seção vazia" in m for m in msgs))

    def test_tabela_com_linha_irregular_e_erro(self) -> None:
        p = copy.deepcopy(self.plan)
        p["blocks"].append({"t": "table", "head": ["a", "b"], "rows": [["1"]]})
        self.assertGreater(validar_plano.validate(p).errors, 0)

    def test_figura_sem_proporcao_e_erro(self) -> None:
        p = copy.deepcopy(self.plan)
        p["blocks"].append({"t": "figure", "key": "x", "caption": "y"})
        self.assertGreater(validar_plano.validate(p).errors, 0)

    def test_sem_inventario_e_erro(self) -> None:
        p = copy.deepcopy(self.plan)
        del p["fontes"]["unidades"]
        self.assertGreater(validar_plano.validate(p).errors, 0)

    def test_unidade_sem_destino_e_erro(self) -> None:
        p = copy.deepcopy(self.plan)
        p["fontes"]["unidades"].append({"id": "u99", "resumo": "algo que sumiu"})
        msgs = [m for _, _, m in validar_plano.validate(p).items]
        self.assertTrue(any("u99" in m for m in msgs))
        p["fontes"]["cortes"]["u99"] = "fora do recorte pedido"
        self.assertEqual(validar_plano.validate(p).errors, 0)

    def test_resumo_excessivo_e_erro(self) -> None:
        p = copy.deepcopy(self.plan)
        p["fontes"]["palavras"] = 5000
        self.assertGreater(validar_plano.validate(p).errors, 0)
        p["fontes"]["resumo"] = True
        self.assertEqual(validar_plano.validate(p).errors, 0)

    def test_paragrafos_telegraficos_geram_aviso(self) -> None:
        p = copy.deepcopy(self.plan)
        p["blocks"] = [b if b["t"] != "p" else {**b, "text": "Frase curta demais aqui."} for b in p["blocks"]]
        msgs = [m for _, _, m in validar_plano.validate(p).items]
        self.assertTrue(any("menos de 25 palavras" in m for m in msgs))


class ValidarDeck(unittest.TestCase):
    def setUp(self) -> None:
        self.plan = load("apresentacao-16x9/exemplo-plano.json")

    def test_exemplo_passa(self) -> None:
        self.assertEqual(validar_plano.validate(self.plan).errors, 0)

    def test_modo_projetar_limita_palavras(self) -> None:
        p = copy.deepcopy(self.plan)
        p["slides"].insert(1, {"t": "content", "src": "u2", "title": "Um título com verbo", "text": " ".join(["palavra"] * 40)})
        self.assertGreater(validar_plano.validate(p).errors, 0)
        p["doc"]["mode"] = "L"
        self.assertEqual(validar_plano.validate(p).errors, 0)

    def test_slide_ralo_em_leitura_gera_aviso(self) -> None:
        p = copy.deepcopy(self.plan)
        p["doc"]["mode"] = "L"
        msgs = [m for _, _, m in validar_plano.validate(p).items]
        self.assertTrue(any("slide ralo" in m for m in msgs))

    def test_layout_desconhecido_e_erro(self) -> None:
        p = copy.deepcopy(self.plan)
        p["slides"].append({"t": "mosaico"})
        self.assertGreater(validar_plano.validate(p).errors, 0)

    def test_formato_obrigatorio(self) -> None:
        p = copy.deepcopy(self.plan)
        del p["formato"]
        self.assertGreater(validar_plano.validate(p).errors, 0)


class Publicar(unittest.TestCase):
    def test_patches_reconstroem_o_novo_corpo(self) -> None:
        old = "\nconst a = 1;\nconst b = 2;\nreturn { version: '1.0' };\n\n"
        new = "\nconst a = 1;\nconst b = 3;\nreturn { version: '1.1' };\n\n"
        body = old
        for a, b in publicar.patches(old, new):
            self.assertEqual(body.count(a), 1)
            body = body.replace(a, b)
        self.assertEqual(body, new)

    def test_motores_declaram_versao(self) -> None:
        for rel in ("documento-a4/build.js", "apresentacao-16x9/build.js"):
            self.assertRegex(publicar.version_of((BASE / rel).read_text(encoding="utf-8")), r"^\d+\.\d+")


if __name__ == "__main__":
    unittest.main()

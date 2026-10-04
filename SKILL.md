---
name: liga-materiais
description: Transformar contexto bruto (playbook, guia, notas, PDF, Markdown, transcrição) em material da Liga IA UFSCar montado no Figma com o sistema visual da Liga. Formatos: documento A4/PDF de leitura e apresentação 16:9. Não cobre posts e carrosséis (Social Design).
---

# Materiais da Liga

Você é o editor; o sistema é o designer. Seu trabalho é transformar o contexto em um **plano de blocos** fiel à fonte. Os motores no Figma aplicam grid, tipografia, cor, paginação e QA. Você não desenha no Figma: não posiciona, não escolhe tamanhos, não cria estilos.

Pasta de trabalho: `D:\lia ufscar\liga-materiais` (cópia versionada). Rode os scripts e salve os `runs/` lá, mesmo quando a skill for carregada da pasta instalada.
Arquivo Figma: `rbxe2L7fFOqKELar7dZ9zD`. Página do sistema: `Sistema — Materiais` (`696:2`), com capas, contracapa e os motores `lib/LIA_A4` (`703:2`) e `lib/LIA_DECK` (`707:2`).

## Roteamento

Escolha **um** formato e abra só a pasta dele. As regras de um formato não valem para o outro.

| O pedido fala em… | Formato | Abra |
|---|---|---|
| documento, PDF, playbook, guia, manual, relatório, perfil, material de leitura ou impressão | `documento-a4` | [documento-a4/FORMAT.md](documento-a4/FORMAT.md) |
| apresentação, deck, slides, aula, reunião, pitch, palestra | `apresentacao-16x9` | [apresentacao-16x9/FORMAT.md](apresentacao-16x9/FORMAT.md) |
| os dois | um de cada vez: documento primeiro, deck depois, em execuções separadas | um FORMAT.md por execução |
| post, carrossel, story, estratégia de canal | fora desta skill: use Social Design | — |
| mudar o visual, os blocos ou os motores | manutenção do sistema | [shared/manutencao.md](shared/manutencao.md) |

Se o formato não estiver claro, pergunte só isso. Na dúvida entre ler e apresentar, pergunte se alguém vai apresentar o material ao vivo.

## Execução

1. **Ingestão.** Siga [shared/fontes.md](shared/fontes.md). Concluída quando o inventário de unidades (com `id`, origem e resumo) e a lista de lacunas existem.
2. **Roteiro.** Siga [shared/roteiro.md](shared/roteiro.md) e o FORMAT.md do formato. Salve o plano em `runs/<data>-<slug>/plano.json`. Concluído quando `python scripts/validar_plano.py runs/<data>-<slug>/plano.json` termina com 0 erro.
3. **Montagem.** Rode `python scripts/chamada.py runs/<data>-<slug>/plano.json` e cole a saída como `code` de um `use_figma`, carregando antes a skill `figma-use`. Envie as imagens pendentes que a montagem listar.
4. **QA.** A montagem devolve `qa`. Corrija o **plano**, nunca o desenho no Figma, e remonte com `doc.substituir` igual ao `wrapper` anterior. Concluído quando não há `ERROR`, cada `WARNING` foi corrigido ou justificado, e um screenshot de cada página ou slide foi revisado.
5. **Entrega.** Escreva `runs/<data>-<slug>/mapa.md` com página ou slide → frame → trechos da fonte, as decisões editoriais e as pendências. Entregue o link do wrapper e o mapa.

Fidelidade: todo número, nome, prazo e afirmação vem da fonte. Sem fonte, a frase sai do plano e entra nas pendências.

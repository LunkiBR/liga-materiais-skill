# Liga Materiais

Skill para criar ou adaptar materiais da Liga IA UFSCar a partir de Markdown, PDF ou outras fontes, usando o Design System e os templates atuais no Figma.

## Conteúdo

- `SKILL.md`: instruções principais da skill.
- `references/`: ingestão, playbook e checagem de vigência.
- `families/`: catálogo de famílias de templates.
- `index.json`: índice local de descoberta.
- `catalog.py`: utilitário de consulta do catálogo.
- `tests/`: testes do catálogo.
- `runs/`: exemplo de execução documentada.
- `example-source.md`: fonte de exemplo.

## Uso no Codex

Copie esta pasta para o diretório de skills do Codex:

```text
<CODEX_HOME>/skills/liga-materiais
```

Depois, invoque a skill quando precisar criar ou adaptar um material institucional, playbook ou documento paginado da Liga.

## Princípios

- Preservar a fidelidade da fonte e registrar as origens.
- Selecionar templates originais antes de criar estruturas novas.
- Validar os nós atuais no Figma antes da produção.
- Revisar legibilidade, hierarquia, editabilidade e ocupação editorial.
- Entregar limitações e mapa de execução de forma explícita.

## Referências visuais

A fonte de verdade visual indicada pela skill é o arquivo [Design System — Liga](https://www.figma.com/design/rbxe2L7fFOqKELar7dZ9zD/Liga?node-id=167-52), com o catálogo de templates na página `198:2`.

## Desenvolvimento

Execute os testes do catálogo com:

```bash
python -m unittest discover -s tests
```

O conteúdo deste repositório é uma cópia versionada da skill disponível no ambiente Codex do autor.

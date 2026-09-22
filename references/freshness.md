# Checagem de vigência do catálogo

Execute `python catalog.py fingerprint` e compare `count` e `signature` com o resultado do seguinte código read-only no conector `use_figma` para o arquivo `rbxe2L7fFOqKELar7dZ9zD`.
Use `skillNames=figma-use` depois de carregar essa skill.

```js
const page = await figma.getNodeByIdAsync('198:2');
await figma.setCurrentPageAsync(page);
const items = page.children
  .filter(n => n.type === 'FRAME' && n.name.startsWith('tpl-'))
  .map(n => ({ id: n.id, name: n.name, width: n.width, height: n.height, child_count: n.children.length }))
  .sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
const payload = items.map(n => `${n.id}|${n.name}|${n.width}|${n.height}|${n.child_count}`).join('\n');
let value = 2166136261;
for (let i = 0; i < payload.length; i++)
  value = Math.imul(value ^ payload.charCodeAt(i), 16777619) >>> 0;
return { count: items.length, signature: value.toString(16).padStart(8, '0') };
```

Se a assinatura divergir, leia novamente os metadados do catálogo e regenere `index.json` e as fichas `families/*.json` via `apply_patch`.
Use o Figma como fonte ao reconstruir nomes, IDs, dimensões e filhos diretos.
Depois confira `python catalog.py validate` e a assinatura novamente.
Para cada template selecionado, confira no Figma o ID, o nome, a composição visual e os estilos imediatamente antes de clonar, inclusive quando a assinatura do catálogo coincide.
Essa checagem estrutural não detecta mudança interna de texto, cor ou tipografia de um frame; a leitura do nó selecionado cobre esses dados.

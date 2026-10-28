# ACITE

Site estático em HTML, CSS e JavaScript. Abra `index.html` com o Live Server para navegar.

## Organização

```text
index.html                  Página inicial
index.css                   Estilos da página inicial
index.js                    Comportamento da página inicial
pages/
  investigacao/
    index.html
    investigacao.css
    investigacao.js
  autor-publicacao/
    index.html
    autor-publicacao.css
    autor-publicacao.js
  ...                       A mesma estrutura nas restantes páginas
assets/
  css/languages.css         Estilos partilhados do seletor de idioma
  js/languages.js           Comportamento partilhado do seletor de idioma
  img/                      Imagens do site
  logo/                     Identidade visual
```

Cada página tem os estilos e scripts locais na sua pasta. O HTML referencia esses ficheiros; os scripts são carregados com `defer`. Os recursos de idioma são partilhados entre páginas.

Os endereços internos usam `pages/<pagina>/index.html`. Os parâmetros dos perfis (`?id=...`) e as âncoras dos autores (`#obra-...`) são preservados.

As capas e fotografias continuam guardadas no IndexedDB do navegador, com as mesmas bases de dados e identificadores. Para manter acesso aos dados existentes, utilize o mesmo endereço, protocolo e porta do servidor local.

## Verificação

- `python verify_structure.py` verifica os caminhos locais de HTML e CSS.
- `node --check caminho/do/ficheiro.js` verifica a sintaxe de um script.

`before-modularization.zip` contém uma cópia dos ficheiros anteriores à reorganização.

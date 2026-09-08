# Site pessoal: direção e manutenção

HTML, CSS e JavaScript, sem etapa de build ou dependências de execução.

## Prévia local

Com Node.js instalado, execute `node scripts/preview.cjs` e abra <http://127.0.0.1:4173>. O servidor local expõe apenas os arquivos públicos do site. Para encerrar, use Ctrl+C.

## Conteúdo e idiomas

- `index.html`: conteúdo em português e traduções nos atributos `data-pt` e `data-en`.
- `style.css`: identidade visual e layouts responsivos.
- `script.js`: preferência de idioma, metadados, menu móvel e ano do rodapé.
- `assets/profile.jpg`: fotografia original; o tratamento de cor é aplicado pelo CSS.

O idioma inicial acompanha o navegador (inglês para navegadores em inglês; português nos demais casos). Uma escolha explícita de idioma é lembrada localmente. Sem JavaScript, o conteúdo em português, a navegação, os contatos e os detalhes de atuação continuam disponíveis.

## Direção visual

Referência de apoio: `coding/prompting_for_frontend_aesthetics.ipynb`, em `D:\projetos\IA\claude-cookbooks-main`, e a skill local `frontend-design`.

A composição privilegia nome, retrato e atuação em liderança de engenharia. Newsreader nos títulos e IBM Plex Sans nos textos; papel `#f5f5ef`, texto `#23372e`, verde `#243e33`, texto secundário `#5b665e` e sálvia `#e5eadd`. A experiência internacional ocupa uma seção própria; ferramentas ficam nos detalhes expansíveis das áreas de atuação.

As fontes são carregadas pelo Google Fonts, com alternativas locais em caso de indisponibilidade. O site respeita a preferência por movimento reduzido. Os relatos usam o conteúdo preexistente, sem acrescentar empregadores, datas ou métricas de resultados.

## Publicação

Os arquivos públicos são `index.html`, `style.css`, `script.js`, `assets/profile.jpg` e `assets/favicon.svg`. A configuração existente de nginx/Docker foi preservada. O servidor em `scripts/preview.cjs` serve apenas para desenvolvimento local.

## Validação do redesign

Conferido no Chrome em português e inglês nas larguras de 320, 375, 390, 760, 768, 1024 e 1440 pixels, sem overflow horizontal. Verificados troca e persistência de idioma, menu com Escape e retorno de foco, detalhes expansíveis por teclado, âncoras, contatos, acesso sem JavaScript e armazenamento local indisponível.

A auditoria axe dos critérios WCAG 2 A/AA e WCAG 2.1 AA não encontrou violações nos estados desktop e mobile em português testados. Essa checagem automática complementa a inspeção visual; não equivale a uma certificação de acessibilidade.

# Portfólio 2.0

## Direção visual

Conceito: engenharia como conexão entre pessoas, decisões e execução. O elemento principal é uma escultura digital desenhada em canvas, que muda entre rede, camadas de arquitetura e fluxo de entrega conforme a rolagem. O movimento responde à navegação e ao ponteiro; a leitura e o controle da página permanecem nativos.

Paleta: fundo #080c14, superfície #101925, texto #eef3fa, texto secundário #9baac0, ciano #83d9ed e âmbar #e7bd83. Sora nos títulos e no texto; IBM Plex Mono nas legendas técnicas. Alinhamento predominante à esquerda, com composição assimétrica.

Estrutura:
```
marca                 navegação / idioma / efeitos
apresentação e nome   escultura digital interativa
perfil + retrato      experiência e contexto
escultura fixa        pessoas → arquitetura → entrega
presença internacional / países selecionáveis
contato em escala grande
```

Revisão do conceito: os efeitos mostram as áreas de atuação do Dellanio. Para manter uma identidade pessoal, o retrato e a experiência real aparecem junto da narrativa; o visual não simula métricas, terminais ou projetos inexistentes. A referência ao cookbook da versão 1.0 foi descartada.

## Execução local

Execute `node scripts/preview.cjs` e abra <http://127.0.0.1:4173>. O servidor de prévia só expõe os arquivos públicos do site. Nenhuma instalação de pacote é necessária.

## Manutenção

- `index.html`: conteúdo e traduções por atributos `data-pt` e `data-en`.
- `style.css`: identidade, responsividade e efeitos CSS.
- `script.js`: idioma, navegação, escultura canvas, efeitos de rolagem e seleção de experiências.
- `assets/profile.jpg`: retrato original, com tratamento apenas em CSS.

As interações respeitam movimento reduzido e podem ser desativadas pelo controle de efeitos. Conteúdo, contatos e navegação permanecem disponíveis sem JavaScript. As fontes vêm do Google Fonts, com fallback local. A trajetória se baseia no conteúdo original, sem inventar resultados ou datas.

Os arquivos de nginx e Docker não fazem parte do redesign. A versão 1.0 está registrada no histórico Git.

## Validação

Conferido no Chrome em português e inglês nas larguras de 320, 375, 390, 580, 760, 800, 810, 1024, 1280 e 1440 pixels, sem transbordamento horizontal. Verificados os três estados do canvas, sua posição fixa durante a leitura, navegação móvel com Escape e foco, seleção dos quatro países, persistência das preferências e funcionamento sem JavaScript ou armazenamento local.

Os efeitos foram verificados com movimento normal e reduzido: entrada finita, resposta ao ponteiro, quadros intermediários durante as transformações e interrupção dos efeitos pelo botão. O canvas não mantém um ciclo de desenho quando a página está ociosa.

A auditoria axe dos critérios WCAG 2 A/AA e WCAG 2.1 AA não encontrou violações nos estados desktop em português e inglês e na narrativa móvel em português. A revisão automática foi complementada por capturas e inspeção visual; não equivale a uma certificação de acessibilidade.

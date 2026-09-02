# Site da Padócasu

Site de uma página só (one-page), feito em HTML, CSS e JavaScript puros. Não depende de servidor, banco de dados, plugin nem conexão com a internet: as fontes, as fotos e a arte da marca estão todas dentro da pasta.

## Como abrir

Dê dois cliques em `index.html`. Ele abre no navegador e funciona por completo, inclusive offline.

## Como publicar

Qualquer uma destas opções funciona, e todas aceitam a pasta do jeito que ela está:

**Netlify Drop** (grátis, mais rápido) — entre em app.netlify.com/drop e arraste a pasta inteira para a área indicada. Em poucos segundos o site ganha um endereço público, e depois dá para apontar um domínio próprio nas configurações.

**Vercel** — em vercel.com/new, escolha "deploy sem repositório" e envie a pasta. O arquivo `vercel.json` que já vem aqui resolve a configuração sozinho: ele fixa o Framework Preset como "Other" e define a raiz da pasta como diretório de saída.

Se o build reclamar `Project framework is set to "services", but no services are declared`, o projeto na Vercel está com o preset de framework marcado como "services" — um recurso para projetos que juntam vários backends e frontends numa coisa só, que não é o caso de um site estático. O `vercel.json` incluído sobrescreve isso. Se ainda assim aparecer, entre em Settings → Build and Deployment → Framework Settings e troque o preset para "Other", depois refaça o deploy.

**GitHub Pages** — suba os arquivos num repositório, ative Pages nas configurações e escolha a branch principal.

**Hospedagem tradicional** — envie o conteúdo da pasta por FTP para o diretório público do servidor (normalmente `public_html` ou `www`). O `index.html` precisa ficar na raiz.

## Como mudar o conteúdo

**Preços e itens do cardápio** — abra `index.html` num editor de texto e procure a seção marcada com `<!-- ============ CARDÁPIO ============ -->`. Cada item é uma linha começando com `<li class="item">`. Para mudar um preço, altere só o número dentro de `<span class="item__price">`. Para incluir um item novo, copie uma linha inteira e ajuste o nome, o peso, o preço e o texto de `data-item` (é esse texto que vai na mensagem do WhatsApp).

**Número do WhatsApp** — o número aparece como `5511992169708` no `index.html` e uma vez no começo do `assets/js/main.js` (na linha `var WA =`). Troque em todos os lugares se mudar.

**Endereço e textos** — estão no próprio `index.html`, nas seções "Retirada e entrega" e "A cozinha".

**A faixa de produtos logo abaixo da capa** — é montada pela lista `variedade` no `assets/js/main.js`. Cada linha tem: nome do arquivo da foto, nome que aparece, preço, link da categoria e a descrição da imagem. Para incluir um produto novo na faixa, copie uma linha e ajuste os cinco campos.

**As fotos que giram na capa** — são as `<img class="disc__foto">` dentro de `<div class="disc" id="heroDisc">`, no começo do `index.html`. Pode acrescentar ou tirar fotos à vontade: a primeira precisa ter a classe `is-on`, e o rodízio se ajusta sozinho.

**Fotos** — todas ficam em `assets/img`. Para trocar uma, basta salvar a foto nova por cima, com o mesmo nome de arquivo. As fotos do cardápio são quadradas (920 × 920 pixels) porque aparecem cortadas em círculo; as que ocupam o fundo são horizontais (1800 × 1100).

## Animações e rolagem suave

A rolagem suave e as animações são controladas por duas linhas no começo do `assets/js/main.js`:

```js
var ANIMAR_SEMPRE = true;    // o site anima sempre
var DURACAO_ROLAGEM = 900;   // tempo da rolagem, em milissegundos
```

Vale saber por quê. Windows e macOS têm uma opção chamada "reduzir movimento" (em Configurações → Acessibilidade), pensada para quem sente desconforto com animação na tela. Quando ela está ligada, o navegador desliga por conta própria a rolagem suave do CSS e congela as animações — a página passa a saltar de seção em seção em vez de deslizar, e nada mais se move. Como esse comportamento é do sistema, nenhum `!important` no CSS resolve.

Por isso a rolagem foi reescrita em JavaScript, que não sofre esse desligamento. Com `ANIMAR_SEMPRE = true` o site desliza e anima em qualquer máquina. Se preferir devolver a decisão para o visitante, troque para `false`: aí quem tiver "reduzir movimento" ligado verá o site estático, que é o comportamento recomendado de acessibilidade.

Se a rolagem parecer lenta ou rápida demais, mexa só no `DURACAO_ROLAGEM`.

## O que tem em cada pasta

`index.html` é o site inteiro: todo o texto está aqui. `assets/css/style.css` guarda o visual. `assets/js/main.js` cuida das animações, do menu do celular e dos links de WhatsApp de cada item. `assets/img` tem as fotos tratadas e a arte vetorial da marca. `assets/fonts` tem as fontes hospedadas localmente. `marca/` traz os arquivos da identidade para você reusar em outros materiais (Instagram, cardápio impresso, etiqueta), em versão branca e em versão terracota, mais o selo quadrado pronto para foto de perfil.

## A identidade aplicada

A cor é uma só: terracota `#C1440E` sobre branco, sem nenhuma terceira cor — o que varia é a proporção entre as duas e a inversão entre as seções. A tipografia combina a serifa didone Bodoni Moda, usada em tudo que é emocional (títulos, nome da marca, frases da esteira), com a Barlow Condensed em maiúsculas espaçadas para o que é funcional (preços, etiquetas, navegação). As peônias em traço branco e a estrela de pontas vieram do logo original, vetorizadas a partir da arte que você mandou — por isso ampliam sem perder qualidade. Toda foto aparece em corte circular, e as imagens receberam um ajuste leve de calor e contraste para conversarem entre si sem perder a luz natural.

## Detalhes técnicos

O site é responsivo (celular, tablet e computador), tem dados estruturados de padaria para o Google, respeita a preferência de "reduzir movimento" do sistema para quem tem sensibilidade a animação, e traz um ícone flutuante de WhatsApp que aparece assim que a pessoa começa a rolar a página.

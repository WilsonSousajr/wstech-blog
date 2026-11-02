---
title: "Geração probabilística, validação estática: qualidade de código ainda importa na era dos agentes"
date: 2026-11-02
draft: false
description: "LLM nunca dá a mesma resposta duas vezes e a gente entrega mais código do que qualquer um consegue revisar. Para de revisar linha e começa a barrar padrão."
slug: geracao-probabilistica-validacao-estatica
tags:
  - ai
  - software-engineering
  - architecture
---
> **TL;DR:** LLMs são probabilísticos. Pergunta a mesma coisa duas vezes e você recebe duas respostas diferentes. Então você coloca checagens determinísticas em cima de tudo que eles geram. Geração probabilística, validação estática. Na segunda-feira, olha o seu quality gate. Não tem? Começa com testes e formatação. Já tem? Pergunta se é suficiente e itera.

A quantidade de código que a gente entrega como engenheiro de software explodiu desde que Claude Code, Copilot, Antigravity e companhia apareceram. E é exatamente por isso que eu não compro esse papo de "engenharia de software morreu". Se a engenharia estivesse morrendo, a gente estaria entregando menos código. A gente tá entregando mais. Muito mais.

Então, se você for lembrar de uma coisa só deste post, que seja esta.

> **Geração probabilística. Validação estática.**

Este post é pra dois tipos de gente. Engenheiros que entregam com agentes todo dia e decidiram, meio em silêncio, que qualidade de código não importa mais. E vibe coders que acreditam que o agente resolve tudo, então ninguém precisa pensar nem decidir o que fazer. Eu acho que os dois estão errados, e acho que a solução é chata e barata. Provavelmente já tá parada no seu gerenciador de pacotes.

## Pergunta duas vezes, recebe duas respostas

LLMs são probabilísticos. Eles não são determinísticos e, sozinhos, não garantem padrão nenhum. Pergunta a mesma coisa duas vezes e você não recebe a mesma resposta, não 1:1. Às vezes parecida. Nunca garantida.

Pra um rascunho, tudo bem. Pra uma codebase, é um problema. Uma codebase é uma pilha de decisões que precisam continuar consistentes com o tempo. Como as coisas são nomeadas, como os arquivos são organizados, como um teste deve ser, qual módulo pode importar qual. Se quem escreve o código não consegue prometer consistência, alguma outra coisa precisa prometer.

Dá pra escrever essas decisões no prompt, claro. Num CLAUDE.md, numa skill, num arquivo de regras. Eu faço isso também. Mas regra no prompt é uma coisa que o modelo segue na maioria das vezes. Na maioria das vezes não é garantia.

No meu último post, [Don't Blame the Hammer](https://blog.wstech.tech/posts/dont-blame-the-hammer/), eu escrevi que uma regra que nada executa é só uma sugestão. Este post é a outra metade dessa frase. Se o gerador é probabilístico, a checagem tem que ser determinística. Mesma entrada, mesmo veredito, toda santa vez.

E eu não tô sozinho nessa. O Uncle Bob disse [numa live](https://www.youtube.com/watch?v=zcLPGC-tvgk) que regra no prompt funciona mais como orientação, e que as checagens de verdade têm que ser ferramentas determinísticas rodando depois.

## Ninguém consegue revisar 8 mil linhas

Agora soma o volume. Na mesma tarefa, um agente pode abrir 10 PRs pequenos ou um PR gigante com 8 mil linhas. Coloca isso num time de engenheiros, cada um com seu agente, e você tem milhares e milhares de linhas novas por dia.

Os números do próprio GitHub apontam pro mesmo lado. O [relatório Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/) contou quase 1 bilhão de commits em 2025, 25% a mais que no ano anterior, e 518,7 milhões de pull requests mergeados, 29% a mais. O GitHub não diz quanto disso foi escrito por IA, então eu não vou chutar. Mas a curva só vai pra um lado.

Revisar cada linha disso na mão é humanamente impossível. Sendo sincero, você não tá fazendo isso. Ninguém tá. O que acontece de verdade é que o revisor rola a tela, vê o CI verde, comenta o nome de uma variável e aprova.

Então vamos parar de fingir. Code review linha por linha é o nível errado agora. Formatação, espaçamento, ordem de import, essa conversa já devia ter acabado, uma máquina resolve isso em milissegundos. Nossa atenção tem que subir um nível, pros padrões que emergem do código.

## Revisa padrão, não linha

A ideia é simples. Vocês decidem os padrões do zero, como time. Depois transformam cada um numa validação estática e rodam no pipeline de CI/CD a cada mudança.

E dá pra checar muita coisa hoje.

- Formatação e lint. O básico chato, ninguém devia revisar isso na mão nunca mais.
- Nomenclatura e comentários, como as coisas se chamam e o que um comentário pode dizer.
- Complexidade. Complexidade ciclomática conta os caminhos dentro de uma função. Complexidade cognitiva, uma métrica da SonarSource, tenta medir o quão difícil ela é de ler.
- Cobertura, de unidade e de integração, com um piso abaixo do qual o build não passa.
- Testes verdes e testes de regressão. Nada vermelho entra, e todo bug fix vem com um teste que teria pegado o bug.
- Testes que não verificam nada. Um teste que chama seu código e não confere nada faz a cobertura subir e não prova nada. Agente escreve isso, e o meu gate pegou um monte.
- CRAP. Já já eu falo dele.
- O grafo de dependências, qual módulo pode importar qual. Arquitetura como regra, e não como página na wiki.
- Tamanho de arquivo. Um limite de linhas por arquivo, pra god file nunca acontecer.

O CRAP merece uma seção só dele, porque a maioria das pessoas com quem eu falo nunca ouviu falar.

### A métrica CRAP

Quem criou foi o Alberto Savoia com o Bob Evans, [lá em 2007](https://www.artima.com/weblogs/viewpost.jsp?thread=215899). A métrica junta dois números de cada método, a complexidade ciclomática e quanto dele os seus testes cobrem.

```text
CRAP(m) = comp(m)² × (1 − cov(m))³ + comp(m)
```

`comp` é a complexidade ciclomática e `cov` é a cobertura, de 0 a 1. Repara no que a fórmula faz. Um método simples fica baixo mesmo sem teste nenhum. Um método complexo com cobertura total também fica baixo. Um método complexo sem teste explode, porque a complexidade tá ao quadrado e a cobertura que falta tá ao cubo.

O Savoia usou 30 como a linha entre ok e porcaria. E aqui vem a minha parte favorita. Com complexidade 31 ou mais, nenhuma cobertura te leva pra baixo de 30, porque o `+ comp(m)` do final já passou da linha. O único jeito de sair é quebrar o método.

Esse é exatamente o tipo de feedback que você quer dar pra um agente. Ele não consegue só adicionar uns testes pra fazer o número sumir. Ele tem que deixar o código mais simples.

### O que existe em cada stack

A maior parte disso já existe como ferramenta. Aqui tá o que eu achei pras três stacks com que eu mais trabalho.

| Checagem | Python | TypeScript | Go |
|---|---|---|---|
| Complexidade | ruff `C901`, só ciclomática; flake8-cognitive-complexity, último release em 2020 | eslint-plugin-sonarjs `cognitive-complexity` | gocognit |
| Testes que não verificam nada | pytest-tidy `PTD003`, novo em 2026; mutmut | jest e vitest `expect-expect`; sonarjs `assertions-in-tests` | nenhuma regra de lint que eu achei; Gremlins pra mutation testing |
| CRAP | crap4py; crapper | crapper; crap4js | crap4go; crapper |
| Regras de dependência | import-linter | dependency-cruiser | go-arch-lint; depguard |

Python é a minha stack principal, e é a que tem mais buraco. O ruff não tem regra de complexidade cognitiva, só a ciclomática do McCabe, e nem o ruff nem o flake8 acusam um teste sem assert. Você acaba montando parte disso na mão.

E tem o mutation testing. Uma ferramenta como [mutmut](https://github.com/boxed/mutmut), [Stryker](https://stryker-mutator.io/) ou [Gremlins](https://github.com/go-gremlins/gremlins) muda o seu código de propósito e confere se algum teste quebra. Se nada quebra, seus testes não estavam testando aquela linha de verdade. Pega o teste vazio e o teste fraco.

O Uncle Bob construiu muito disso pra ele mesmo. O [crapper](https://github.com/unclebob/crapper) e o [mutator](https://github.com/unclebob/mutator) dele cobrem Python, TypeScript, Go, Java, Rust e Clojure, e o pipeline de agentes dele, [como resumido aqui](https://blog.alexrusin.com/uncle-bob-ai-coding-agents/), vai de coder pra um cleaner trabalhando no CRAP, depois um hardener rodando mutation testing, depois QA.

O Fabio Akita, que tem entregado muita coisa com agentes este ano, se apoia em teste e processo. Uma linha de teste pra cada linha de código, um teste de regressão antes de todo bug fix, e só commit verde na master, como ele conta [no post de vibe coding em seis dias](https://akitaonrails.com/en/2026/02/16/vibe-code-zero-to-production-in-6-days-the-m-akita-chronicles/). Concordo com tudo. Teste diz que o comportamento tá certo. Gate estático diz que o formato tá certo. Você quer os dois.

## O dia em que eu escrevi o `./quality-gate`

Isso não é teoria pra mim.

Um tempo atrás eu tava no começo de um projeto com vários serviços, cada um com deploy separado. Eu era responsável por um deles. Os requisitos eram claros, começo, meio e fim do que aquele serviço tinha que fazer. E ele tinha que chamar e se conectar com um monte de outros serviços.

Usei as melhores abordagens que eu conhecia, todas as técnicas de engenharia agêntica. Mas o prazo tava quase estourando e a expectativa em cima daquela implementação era alta. A gente não tinha pipeline de CI/CD com quality gate, e o código já tava grande demais pra revisar tudo na mão. E como era um time com muitos devs, eu não podia simplesmente enfiar um quality gate no CI compartilhado do nada.

Então eu construí um localmente. Um comando simples assim, `./quality-gate`, que funcionava como skill pro agente antes da gente colocar no CI. Ele rodava pytest, black, uma checagem de complexidade ciclomática, um script separado que calculava o CRAP, e um limite de 500 linhas por arquivo, por causa daquele problema dos god files.

Aí vinha o loop. O agente escreve o código, o gate roda, os red flags voltam pro agente. De novo. De novo. De novo.

Ele pegou exatamente o que eu listei ali em cima. Cobertura de teste baixa. Teste que não verificava nada. Complexidade ciclomática alta nas implementações. Arquivo com milhares de linhas.

No fim, a cobertura foi de uns 50% pra 99%. Os arquivos foram de milhares de linhas pra umas 500. O código ficou mais simples, menor, mais bonito. Não mais pesado, não mais bagunçado.

Foi engenharia na sua forma mais pura.

E repara no que eu não precisei fazer. Eu não li cada linha. Eu decidi uma vez como era o código bom, e o gate falou isso pro agente quantas vezes foi preciso.

Uma versão mínima de um gate desses pode ser mais ou menos assim. **Isso é uma ilustração que eu escrevi pra este post, não o script daquele projeto.**

```bash
#!/usr/bin/env bash
# quality-gate: illustration only, not the original script.
set -euo pipefail

# 1. Formatting
black --check src tests

# 2. Cyclomatic complexity, max 10 per function
ruff check --select C901 --config 'lint.mccabe.max-complexity = 10' src

# 3. Tests green, with a coverage floor
pytest --cov=src --cov-branch --cov-fail-under=90

# 4. CRAP, from your own script or a tool like crap4py
python scripts/crap.py --max 30

# 5. No god files, 500 lines max
find src -name '*.py' -print0 | xargs -0 wc -l \
  | awk '$2 != "total" && $1 > 500 { print "too long: " $2; bad = 1 } END { exit bad }'

echo "quality gate passed"
```

Cada passo sai com código diferente de zero quando falha, então o agente recebe um red flag e um motivo, e volta pro trabalho.

## O gate não é pedra

Agora, não quero ninguém lendo isso como "escreve o conjunto perfeito de regras uma vez e grava na pedra". É o contrário.

O gate tem que evoluir. Tem que ser moldável. Como tudo em engenharia de software, ele tem que ser quase orgânico. Contraditório, né? Validação estática que vive mudando. Mas é assim que funciona. Você deixa as regras mais frouxas ou mais duras dependendo dos requisitos do seu software. As partes críticas do código ganham as regras mais rígidas.

O próprio limite do CRAP mostra isso. O Savoia começou com 30 em 2007, e ele mesmo chamou de experimental. O [crap4java](https://github.com/unclebob/crap4java) do Uncle Bob quebra o build acima de 8, e a skill [ub-mode](https://github.com/unclebob/ub-mode) dele barra em menos de 10. Numa entrevista, ele teria dito que usa 6 pra agentes e menos de 4 pra humanos, segundo [este resumo dela](https://note.com/minilab/n/nd64fb35c7cab). Mesma métrica, números diferentes, dependendo de quem escreve o código e do que tá em jogo. O limite é uma decisão, não uma lei da física.

Um gate também pode ser burlado. O Akita [alerta pra isso](https://akitaonrails.com/2026/10/24/por-que-nao-fazemos-provas-formais-definitivas-de-codigo-sem-bug/) falando de provas formais. Manda uma IA fazer uma prova passar e ela pode reescrever o programa num que passa de forma trivial. Vale o mesmo pra qualquer gate. Se o agente aprende a satisfazer a checagem sem satisfazer a intenção, você muda a checagem.

Então começa pequeno, olha o que escapa e aperta.

## "Mas código é barato"

O argumento mais forte contra tudo isso é que código agora é barato. E isso não tá totalmente errado.

Código é barato mesmo hoje. Se algo quebra, você sobe um fix em 30 segundos. Se a codebase tá uma bagunça, não é você que vai lidar com ela, quem vai sofrer é o agente, não você, haha.

Mas lembra com o que a gente tá trabalhando agora. A gente tem acesso aos modelos de fronteira, e eu acredito que o compute por trás deles é muito subsidiado. Cedo ou tarde os modelos de fronteira vão ficar caros, e nem todo mundo vai ter acesso. A gente vai trabalhar com modelos que não performam como o Opus 5.5 ou o GPT 6. Modelos mais simples. Bons, competentes o suficiente, mas menores.

Agora coloca esse modelo menor numa codebase bagunçada. Ele tem menos contexto pra trabalhar e menos raciocínio pra gastar. Ele queima esse orçamento lendo arquivos com milhares de linhas, seguindo módulo acoplado pra lá e pra cá, e editando 23123 arquivos por causa de uma mudancinha. A maior parte do tempo dele vai em consertar bug que a bagunça criou.

Coloca o mesmo modelo numa codebase limpa e simples. Arquivos pequenos. Fronteiras claras. Um grafo de dependências que uma ferramenta garante. Ele lê menos e quebra menos. O trabalho dele vira implementar feature nova e melhorar as que já existem, não consertar bug.

É por isso que arquitetura, estrutura de arquivos e princípios de clean code não deixaram de importar. Eles nunca foram sobre fazer humano se sentir bem. Eles diminuem o quanto você precisa segurar na cabeça pra mudar alguma coisa com segurança. Pra um agente, essa cabeça é a janela de contexto.

Escrever código ficou barato. Mudar código, não.

Com arquitetura, estrutura e clean code, a gente ainda tem muito a ganhar e nada a perder. Uma codebase limpa é boa pra engenheiro, pra agente grande e pra agente pequeno.

## O que fazer na segunda-feira

Pensa nessas questões. Depois abre o seu pipeline e olha o quality gate que você tem de verdade.

Se ainda não existe nenhum, cria um simples. Testes mais formatação. Pro primeiro dia, é isso. Depois itera e melhora.

Se já existe, faz a pergunta. Isso é suficiente? Seus testes verificam alguma coisa? Você sabe a complexidade da sua pior função? Tem algum arquivo com mais de 500 linhas que ninguém quer abrir? Adiciona uma checagem. Depois itera de novo.

O agente vai continuar te dando respostas diferentes. É da natureza dele, e isso não vai mudar. O seu trabalho é garantir que o gate dê sempre a mesma.

Geração probabilística, validação estática.

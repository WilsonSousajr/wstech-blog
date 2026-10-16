---
title: "Não culpe o martelo: engenharia agêntica é só engenharia"
date: 2026-10-16
draft: false
description: "Agente de IA é ferramenta, e o engenheiro é você. Esquece o hype de orquestração: tarefa pequena, teste primeiro e um quality gate de verdade continuam ganhando."
slug: nao-culpe-o-martelo-engenharia-agentica-e-so-engenharia
tags:
  - ai
  - software-engineering
---
> **TL;DR:** Agente de IA é ferramenta, e ferramenta serve a VOCÊ. Quem é o engenheiro é você, quem decide é você, quem bate o martelo é você. Você não precisa da metodologia de agentes da moda. Só manda o prompt, tarefa pequena, teste primeiro, keep it simple, stupid.

Toda semana eu vejo uma metodologia nova pra trabalhar com IA. Orquestração. Spec-driven development. Loops. O que vier semana que vem. E, sinceramente, quase tudo isso é bullshit.

Não culpe o martelo por ser um martelo. Agente de IA é ferramenta, e o propósito dessa ferramenta é servir você. O engenheiro responsável é você. Você toma as decisões, você bate o martelo. O agente dirige, você navega. Separa navegação de execução, e a maioria dessas metodologias brilhantes deixa de fazer sentido.

Com a era da IA agêntica, o jeito de fazer engenharia de software mudou de novo. O jeito que a gente trabalha mudou, as tecnologias que a gente usava mudaram, e isso não é ruim. A gente sempre aprendeu que isso é normal na nossa área. Mas uma coisa não mudou: a base. O núcleo do trabalho, as coisas que a gente aprendeu errando muito antes de existir qualquer LLM. É sobre isso que esse post fala.

## Eu uso IA todo dia

Antes que alguém leia isso como um rant contra IA: não é. Eu uso IA desde o começo da onda dos LLMs, e hoje, mais do que nunca, uso todo santo dia no meu fluxo de desenvolvimento. No trabalho, em projeto pessoal, em tudo.

O melhor exemplo é o [Omatty](https://omatty.com). Eu amo o terminal. Amo TUIs. Mas o Claude Code no terminal, e as outras TUIs de agentes de IA, não tinham a visão que eu queria. Eu queria uma sidebar com todos os meus projetos. Uma árvore de arquivos que segue o agente, pra eu não precisar abrir outro aplicativo nem ficar fechando e abrindo o Neovim na worktree do agente. Queria ver issues e PRs sem abrir GitHub, Azure ou GitLab. Um lugar só pra fazer engenharia de software.

Tá, ferramentas com interface gráfica já fazem isso. Mas são GUI, e quase todas são orquestradores. Eu não quero um orquestrador, porque eu não preciso de um.

Então eu fiz o meu, em Go, uma linguagem que eu nunca tinha usado. Escolhi porque era a ferramenta certa pra uma TUI desse tipo, não porque estava na moda. Mesma coisa com a IA. Usei pra construir o Omatty porque eu tinha um problema e queria resolver, não porque IA é a modinha do momento. E construí do jeito que eu construiria qualquer coisa: com extreme programming. O [código está no GitHub](https://github.com/WilsonSousajr/omatty).

## A gente já teve essa discussão

Eu sou muito devoto do KISS. Keep it simple, stupid.

Nada disso é novo. Por anos a gente discutiu a mesma coisa com arquitetura. Você não precisa de um sistema distribuído gigante, com um monte de microsserviços, conexões cruzadas, banco de dados compartilhado e camada de clean architecture em cima de camada, igual Netflix ou Google, se você não é a Netflix nem o Google.

A discussão é a mesma. Só a metodologia mudou.

Você não precisa de um pipeline enorme de orquestração. Não precisa da metodologia de engenharia de agentes mais recente, a não ser que trabalhe num sistema grande, GRANDE, GRANDE e complexo. E você provavelmente não trabalha.

Release pequena. Iteração pequena. Feedback rápido. Pair programming. Requisitos. Entender o produto. Teste. Segurança. Nada disso ficou inútil com a IA. É o contrário: isso tudo importa mais agora do que em qualquer outro momento.

## O martelo tentando cortar madeira

Olha o que acontece quando a gente esquece disso.

Eu já vi a mesma combinação mais de uma vez: requisito ambíguo, prazo curto e sistema em que um erro custa caro de verdade. Joga agente nisso sem os fundamentos e acontece o óbvio. Muito AI slop vai pra produção. Arquivo que não devia estar ali entra no commit. Teste que não verifica nada vai junto. Todo o AI slop clássico.

Prazo curto, sistema complexo e um martelo tentando cortar madeira. Claro que não funciona.

Na minha experiência, o trabalho que aguentou foi o chato. Uma coisa pequena de cada vez. Conquistas pequenas. Teste primeiro, com teste de verdade. Toda técnica de extreme programming, igual a gente fazia antes da IA. Foi esse trabalho que voltou com menos problema, e quem usava ficou mais satisfeito.

O problema nunca é o agente. É tecnologia pela tecnologia. Não pra resolver um problema, não pra fazer algo útil de verdade. Só mais um jeito de complicar o que é simples.

> IA é um espelho. Se você é bom, ela te deixa dez vezes mais rápido. Se você é ruim, você vai produzir dez vezes mais lixo, dez vezes mais rápido.

## Por que não dez agentes ao mesmo tempo?

Porque quase nada em programação é paralelizável.

A IA é o seu sidecar, mas você precisa estar lá. Coloca dez agentes pra fazer dez features diferentes ao mesmo tempo e você ganha os mesmos problemas que a gente tinha quando dez humanos faziam exatamente isso: código duplicado, brecha de segurança e uma pilha de código que ninguém consegue auditar.

Ser humano não é multitarefa por natureza. Então segue as boas práticas. Uma coisa, trabalha nela, depois vai pra próxima, trabalha nela.

Sim, nesse fluxo o gargalo é a gente. E é pra ser. LLM é probabilístico. Não importa o quanto melhore nem até onde o harness vá, um humano ainda precisa estar no loop, tomando as decisões que um LLM não consegue tomar.

## Pair programming, não geração de código

LLM tem uns vícios bem ruins. Ama god file. Ama overengineering. Complexidade ciclomática? Ele simplesmente tá cagando pra isso.

Então você chega lá e fala: "Ó, isso aqui não tá bom. Quebra isso em três módulos. Desacopla essa parte." A ideia é tratar o LLM como outro programador, um colega, não como gerador de código. Toda sessão é uma sessão de pair programming. O agente tá no teclado; você é o navegador.

Na prática, minhas sessões são assim:

- Uma tarefa limitada, com um fim bem claro. Eu sei como o resultado tem que ficar antes de começar.
- Restrições: o que precisa continuar valendo, e o que ele não pode tocar.
- Eu reviso as decisões, não as linhas. Não leio o diff linha por linha, eu questiono. Por que essa abordagem e não a outra? O que dava pra ser mais simples?
- O agente roda as verificações: testes, fixtures, os checks do próprio projeto.

Aí vem a parte que mais importa. Depois de toda sessão eu olho o que deu errado e o que demorou demais, e corrijo o processo junto com o código. Toda sessão que falhou, todo bug, vira um teste ou uma regra, pra próxima sessão não repetir o mesmo erro.

Kaizen. Melhoria contínua. Mas do jeito simples.

## Regra que ninguém executa é sugestão

A história que me ensinou isso foi no trabalho.

Eu estava fazendo uns endpoints com um agente, colocando as regras de negócio de cada endpoint no service dele. A gente foi trabalhando, foi adicionando coisa. Eu não estava olhando a estrutura de arquivos. Quando finalmente olhei, o agente tinha criado um puta service de 3.000 linhas. God file de livro.

Essa foi culpa minha. Eu não estava conferindo. Então transformei isso numa regra: nenhum arquivo acima de 500 linhas.

A gente seguiu pra outros services, outros endpoints. Arquivo de 700, 600, 900 linhas continuou aparecendo mesmo assim.

Ou seja, a regra não bastava. Regra no prompt é probabilística. O agente segue na maioria das vezes, o que quer dizer que em algumas vezes ele não segue. Check de CI é determinístico. Falha toda santa vez. Então a regra virou um passo de CI: nenhum arquivo acima de 500 linhas, e o build quebra se tiver um.

O Omatty passou exatamente pela mesma coisa, e o check é público. O comentário no topo do `scripts/check-file-length.sh` explica melhor do que eu conseguiria aqui:

```bash
# The rule was written down and never checked, so #136 brought model.go and
# main.go under it before M7 and six files were back over it by v0.9.0. A rule
# nothing runs is a suggestion. Longer means the package boundary is wrong,
# so the answer to a failure is a split by responsibility, never a higher
# limit: the number is a ratchet that only moves down.
```

Traduzindo: a regra estava escrita e ninguém conferia, seis arquivos voltaram a passar do limite, e regra que ninguém executa é sugestão. O número é uma catraca que só desce.

E o CI roda isso em todo push pra main e em todo pull request:

```yaml
- name: file length
  run: ./scripts/check-file-length.sh 500
```

Nada de pipeline de orquestração, nada de metodologia chique. Um `wc -l` em todo arquivo Go e um número que só desce. Esse é o meu quality gate, e é assim que kaizen fica num codebase: cada erro deixa o processo um pouco mais rígido, e o agente não consegue cometer o mesmo erro de novo.

## Onde orquestração faz sentido de verdade

Não vou ser injusto aqui. Orquestração tem seu lugar, em dois extremos.

O primeiro é sistema distribuído muito grande, ou sistema que precisa rodar 24/7. Eles existem, e esse maquinário pode fazer sentido ali.

O segundo é a ponta oposta: onde errar sai barato. Sistema de ticket de suporte. Sistema que pode dar errado. Teste de MVP. Se o slop quase não te custa nada, beleza, joga dez agentes nisso.

Mas o seu problema provavelmente não está em nenhum desses dois grupos. A maioria de nós constrói coisa no meio, onde erro custa caro e a escala não é de Netflix. E ali os fundamentos ganham.

## Só manda o prompt

Então, na segunda-feira: só manda o prompt. Tarefa pequena. Teste primeiro. Keep it simple, stupid.

Quando algo der errado, não sai procurando metodologia nova. Transforma o erro num teste ou num check e vai pra próxima coisa pequena.

O agente é um martelo. Um martelo muito bom. Não culpe ele por ser martelo. Quem tá segurando é você, o engenheiro.

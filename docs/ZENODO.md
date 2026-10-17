# Zenodo, DOI e ORCID

Cada prancha do Essencial Geo vira um **registro próprio no Zenodo**, com DOI, arquivos e metadados nas duas
línguas. Este guia é a configuração — feita uma vez — e o uso no dia a dia.

> **Segurança.** Tokens são senhas. Gere-os no Zenodo e cole-os direto no GitHub (passo 4); nunca os
> escreva em arquivos do repositório, em issues ou em mensagens.

---

## 1. Conta

1. Entre em [zenodo.org](https://zenodo.org) com **Log in → ORCID** (ou GitHub). Com ORCID, o vínculo
   autor ↔ registro fica direto.
2. Em *Profile*, confira nome e afiliação: `Cerejo, Lucas Nakamura` · NIPE/UNICAMP — os mesmos de
   `.zenodo.json` e `CITATION.cff`.

## 2. Comunidade `essencial-geo`

A comunidade é a “estante” do atlas no Zenodo: todos os mapas aparecem juntos em
`https://zenodo.org/communities/essencial-geo`.

1. **Communities → New community.**
2. *Identifier (URL)*: `essencial-geo` · *Title*: `Essencial Geo` · *Type*: `project`.
3. Descrição bilíngue curta, por exemplo:
   *Atlas aberto de mapas temáticos do Brasil — pranchas, bases vetoriais (GPKG/DXF) e método.
   / Open atlas of thematic maps of Brazil — plates, vector data (GPKG/DXF) and method.*
4. Em *Settings → Review policy*, permita que **owners/curators publiquem sem revisão**. Se o registro
   ainda assim chegar como pedido pendente, aceite-o em *Requests* na página da comunidade.

Se usar outro identificador, troque em `.zenodo.json` (`communities`) e em `LINKS.zenodo`
(`src/site.config.ts`).

## 3. Tokens

| Onde | Caminho | Escopos | Segredo no GitHub |
| --- | --- | --- | --- |
| zenodo.org | *Account → Applications → Personal access tokens → New token* | `deposit:write`, `deposit:actions` | `ZENODO_TOKEN` |
| sandbox.zenodo.org (conta separada) | o mesmo caminho | os mesmos | `ZENODO_SANDBOX_TOKEN` |

O **sandbox** é um Zenodo de ensaio: DOIs falsos (prefixo `10.5072`), nada é indexado. Use-o na primeira
vez e sempre que mudar o script.

## 4. Segredos no GitHub

No terminal (o `gh` pede o valor e não o mostra na tela):

```bash
gh secret set ZENODO_TOKEN --repo aikiesan/essencial-geo
```

```bash
gh secret set ZENODO_SANDBOX_TOKEN --repo aikiesan/essencial-geo
```

Ou pela interface: *Settings → Secrets and variables → Actions → New repository secret*.

## 5. ORCID recebe os DOIs sozinho

O Zenodo registra os DOIs no **DataCite**, e o DataCite pode escrever no seu ORCID:

1. Entre em [profiles.datacite.org](https://profiles.datacite.org) com o ORCID.
2. Em *Settings*, ative **ORCID auto-update** (ou, no ORCID: *Works → Add → Search & link → DataCite*).

Daí em diante, todo registro com o ORCID `0000-0002-9292-2752` entre os autores aparece no ORCID em alguns
dias. Por isso o ORCID está no `.zenodo.json` e em `AUTORIA`.

---

## 6. Publicar um mapa (rotina)

**Quando:** depois que o mapa estiver **no ar** no site — o registro aponta para a página do mapa, e a data
de publicação do Zenodo é o campo `data` do README.

1. Ensaio local, sem tocar no Zenodo:
   ```bash
   npm run zenodo -- 005-renda-domiciliar-rmc --simular
   ```
   Confira título, descrição `[PT-BR]` / `[EN-GB]`, palavras-chave e a lista de arquivos.
2. **Actions → Publicar no Zenodo → Run workflow**, pasta `005-renda-domiciliar-rmc`, **sandbox marcado**.
   Abra o registro em sandbox.zenodo.org e leia como um revisor leria.
3. Rode de novo com **sandbox desmarcado**. A Action publica, recebe o DOI e faz um commit gravando
   `doi:` no README. A citação com DOI aparece no site no próximo deploy (no máximo na recompilação diária
   das 9h).

O script recusa mapas com `exemplo: true` (dados sintéticos) e mapas sem `README.en.md`.

### O que vai para o registro

| Campo do Zenodo | Origem |
| --- | --- |
| Título | `titulo: subtitulo` do `README.md` (português) |
| Descrição | Bloco **[PT-BR]** (contexto, recorte, CRS, fontes, método, link) + bloco **[EN-GB]** com o mesmo do `README.en.md` |
| *Additional notes* | `English title: …` |
| Autores | `autores` do README ou, sem eles, `creators` do `.zenodo.json` (com ORCID e afiliação) |
| Palavras-chave | Brasil/Brazil, cartografia/cartography, mapa temático/thematic map, SIRGAS 2000 + `tags` |
| Versão · data | `versao` · `data` |
| Relações | Página PT e página EN do mapa (*is documented by*), pasta no GitHub (*is supplement to*) |
| Arquivos | Tudo na pasta do mapa, incluindo os dois READMEs e as duas pranchas; `dados/x.gpkg` vira `dados__x.gpkg` |

### Corrigir um mapa publicado

1. Corrija os dados e/ou o texto; aumente `versao` (`1.0.0` → `1.1.0`) e preencha `atualizado:`.
2. Descreva a mudança numa seção `## Histórico` no fim dos dois READMEs.
3. Rode a Action com **nova versão** marcado.

O Zenodo mantém as versões ligadas por um **DOI-conceito** (na página do registro, *Cite all versions*).
O README guarda o DOI da versão mais recente; para citar “o mapa, em qualquer versão”, use o DOI-conceito.

### Fomento

Se um mapa derivar de projeto financiado (FAPESP, CNPq…), informe a agência e o número do processo no campo
*Funding* do registro (editável no Zenodo depois de publicado) e mencione-o nas notas de método. A FAPESP pede
a menção ao processo em toda divulgação de resultados.

---

## 7. DOI do atlas como um todo (opcional)

A **integração nativa** GitHub → Zenodo (*Account → GitHub*, ligar `aikiesan/essencial-geo`) arquiva o
repositório inteiro a cada *release* do GitHub e lê os metadados do `.zenodo.json`. Dá **um DOI para o
atlas**, útil para citar o projeto (o `CITATION.cff` acompanha).

As duas coisas convivem: a Action dá um DOI a **cada mapa** (o que conta para o Lattes); a integração dá
um DOI ao conjunto. Se ligar a integração, faça *releases* raras — por exemplo, uma a cada 25 mapas —, porque
cada uma arquiva todos os dados de novo.

# Site do casamento — Carolina & Fernando · 20.03.2027

Site estático (HTML, CSS e JavaScript puros), sem etapa de compilação. Ele segue a estrutura do site atual no iCasei e aplica a identidade visual do casal.

## Estrutura

| Seção | Âncora | Conteúdo |
|---|---|---|
| Abertura | `#inicio` | Foto, monograma, data e contagem regressiva |
| Versículo | — | 1 Coríntios 13:4-7 |
| Nossa história | `#historia` | Texto do casal e três fotos |
| Galeria | `#galeria` | 44 fotos do ensaio com visualizador e link para o álbum completo |
| Cerimônia e festa | `#cerimonia` | Casa de Campo, 20/03/2027, 16h30, mapa, rota e "salvar na agenda" |
| Dicas | `#dicas` | Pousada Hospedaria Casa de Campo, WhatsApp e Instagram |
| Confirmação de presença | `#confirmar` | Formulário de RSVP |
| Lista de presentes | `#presentes` | Presentes do iCasei, com o botão "Presentear" |
| Recados | `#recados` | Formulário e mural de mensagens aprovadas |
| Rodapé | — | Monograma, Colossenses 3:14 e elementos florais |

## Arquivos

```
index.html               página única
assets/css/style.css     estilos e paleta de cores
assets/js/config.js      dados editáveis (data, links, presentes, endpoint)
assets/js/main.js        contagem, menu, galeria, formulários e mural
assets/img/marca/        monograma e elementos florais (recortados da identidade visual)
assets/img/galeria/      fotos em 1600 px (visualizador)
assets/img/thumbs/       fotos em 640 px (grade)
apps-script/Code.gs      backend gratuito no Google Planilhas
```

## Como editar

Edite `assets/js/config.js` para alterar data, endereço do mapa, links e presentes. Para trocar textos, edite `index.html`.

## Ativar a confirmação de presença e os recados

1. Crie uma planilha no Google Planilhas.
2. Abra **Extensões → Apps Script** e cole o conteúdo de `apps-script/Code.gs`.
3. Clique em **Implantar → Nova implantação → App da Web**.
   - Executar como: **Eu**.
   - Quem pode acessar: **Qualquer pessoa**.
4. Copie a URL gerada (termina em `/exec`).
5. Cole a URL em `endpointFormularios`, no arquivo `assets/js/config.js`.

As respostas aparecem nas abas **Confirmações** e **Recados**. Para publicar um recado no mural, escreva `SIM` na coluna **Aprovado**.

## Publicar no GitHub Pages

1. No GitHub, abra **Settings → Pages**.
2. Em **Source**, escolha o branch e a pasta `/ (root)`.
3. Para usar um domínio próprio, informe-o em **Custom domain** e configure o DNS no registrador.

## Teste local

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

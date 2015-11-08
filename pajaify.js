import cheerio from 'cheerio'

const pajareissa = ' - pa&#8203;ja&#8203;reis&#8203;sa '
const ga = `
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-45905175-3']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
`

export default function pajaify (sourceHtml) {
  const $ = cheerio.load(sourceHtml)

  lisääFobba($)

  hoidaVajarit($)

  estäVajarit($)

  return $.html()
}

function lisääFobba ($) {
  $('head').find('script[src$="analytics.js"]').remove()
  $('head').prepend(ga)
}

function hoidaVajarit ($) {
  $('a > span.otsikko:last-of-type').append(pajareissa)
  $('.vasen > p > a:not([class]) > span').before(pajareissa)
  $('.monikarki > ul > li > a').append(pajareissa)
  $('.monikarki > p > a').append(pajareissa)

  // Oikean reunan widgetin, joissa numerolista
  $('.widget:not(.widget--iltv) .widget__link-list .list-title').append(pajareissa)

  // ILTV widgetin isot linkit
  $('.widget--iltv > div:not([class]) .widget__link-list a[href]').append(pajareissa)

  // ILTV ja pääkirjoitus widgettien linkkilista (pienet thumbnailit)
  $('.widget--iltv > .widget__link-list a:not(.palstakuva)').append(pajareissa)
  $('.widget--paakirjoitus .widget__link-list a:not(.palstakuva)').append(pajareissa)

  // Artikkelisivun otsikko
  $('.keski > .juttuotsikko').append(pajareissa)

  // Artikkelisivun vasen navi
  $('.uutiset .vasen a[href]').append(pajareissa)

  $('title').text('paja.tykki.eu | Suomen pajarein uutispalvelu')
  $('meta[name="title"], meta[property="og:title"]')
    .attr('content', 'paja.tykki.eu | Suomen pajarein uutispalvelu')

  $('meta[name="description"], meta[property="og:description"]')
    .attr('content', 'Uutiset, urheilu, viihde, talous, sää, elämäntapa, terveys, perhe, ruoka - paja.tykki.eu, kaikki pajariuutiset yhdestä osoitteesta kellon ympäri')

  $('meta[property="og:site_name"]').attr('content', 'paja.tykki.eu')
  $('meta[property="og:url"]').attr('content', 'paja.tykki.eu')
}

function estäVajarit ($) {
  $('a[href]').attr('href', (idx, href) => rewriteLink(href))
}

function rewriteLink (link) {
  return link.replace(/http:\/\/(www\.)?iltalehti.fi/, '')
}

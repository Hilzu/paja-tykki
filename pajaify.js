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
  $('.list-title').append(pajareissa)
  $('.link-list > p > a').append(pajareissa)
  $('.widget--iltv > .widget__link-list > p > a:not(.palstakuva)').append(pajareissa)
  $('.monikarki > ul > li > a').append(pajareissa)
  $('.monikarki > p > a').append(pajareissa)
}

function estäVajarit ($) {
  $('a[href]').attr('href', (idx, href) => rewriteLink(href))
}

function rewriteLink (link) {
  return link.replace(/http:\/\/(www\.)?iltalehti.fi/, '')
}

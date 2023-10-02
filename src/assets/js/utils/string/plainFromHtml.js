export default function plainFromHtml(text) {
  return text.replace(/<\/?[^>]+(>|$)/g, '')
}

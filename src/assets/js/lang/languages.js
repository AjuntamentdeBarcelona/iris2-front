export default function getLocales(vm) {
  return vm.$i18n.locales.map(locale => locale.code)
}

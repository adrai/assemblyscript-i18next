export default ({ I18next, newI18next, __newString, __getString }) => {
  return (options = {}) => {
    options.resources = options.resources || {}
    options.fallbackLng = options.fallbackLng || 'dev'
    options.fallbackLNS = options.fallbackLNS || 'translation'
    const i18n = I18next.wrap(newI18next(__newString(JSON.stringify(options.resources)), __newString(options.fallbackLng), __newString(options.fallbackLNS)))
    const originalT = i18n.t
    i18n.t = (key, opt = {}) => {
      const args = [__newString(key)]
      if (opt.lng) args.push(__newString(opt.lng))
      if (opt.ns && !opt.lng) args.push(undefined)
      if (opt.ns) args.push(__newString(opt.ns))
      return __getString(originalT.apply(i18n, args))
    }
    const originalChangeLanguage= i18n.changeLanguage
    i18n.changeLanguage = (lng) => originalChangeLanguage.apply(i18n, [__newString(lng)])
    return i18n
  }
}
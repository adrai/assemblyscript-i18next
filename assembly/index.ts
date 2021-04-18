// The entry file of your WebAssembly module.

import * as console from './myConsole';
import { JSON } from 'assemblyscript-json'

type Namespace = Map<string, string>
type Language = Map<string, Namespace>

export class I18next {
  private resources: Map<string, Language>
  private lng: string | null = null

  constructor (res: string = '{}', private fallbackLng: string = 'dev', private fallbackNS: string = 'translation') {
    this.resources = new Map<string, Language>()
    let jsonObj: JSON.Obj = <JSON.Obj>(JSON.parse(res));
    for (let iL = 0, lenL = jsonObj.keys.length; iL < lenL; ++iL) {
      let lng = jsonObj.keys[iL]
      const nsMap = new Map<string, Namespace>()
      this.resources.set(lng, nsMap)
      let nsOrNull: JSON.Obj | null = jsonObj.getObj(lng)
      if (nsOrNull !== null) {
        for (let iNs = 0, lenNs = nsOrNull.keys.length; iNs < lenNs; ++iNs) {
          let ns = nsOrNull.keys[iNs]
          const keyMap = new Map<string, string>()
          nsMap.set(ns, keyMap)
          let transOrNull: JSON.Obj | null = nsOrNull.getObj(ns)
          if (transOrNull !== null) {
            for (let iTr = 0, lenTr = transOrNull.keys.length; iTr < lenTr; ++iTr) {
              let key = transOrNull.keys[iTr]
              let strOrNull: JSON.Str | null = transOrNull.getString(key) // This will return a JSON.Str or null
              if (strOrNull !== null) {
                // use .valueOf() to turn the high level JSON.Str type into a string
                let val: string = strOrNull.valueOf();
                console.log(`*** from assembly: loading key: '${key}' with value: '${val}'...`)
                keyMap.set(key, val)
              }
            }
          }
        }
      }
    }
  }

  changeLanguage (lng: string) : void {
    this.lng = lng
  }

  t (key: string, lng: string, ns: string): string {
    console.log(`*** from assembly: called i18next.t('${key}')...`)

    if (!lng && this.lng) lng = this.lng as string
    if (!lng) lng = this.fallbackLng
    if (!ns) ns = this.fallbackNS

    if (!this.resources.has(lng) && lng !== this.fallbackLng) lng = this.fallbackLng
    if (!this.resources.has(lng)) return key

    if (!this.resources.get(lng).has(ns) && ns !== this.fallbackNS) ns = this.fallbackNS
    if (!this.resources.get(lng).has(ns)) return key

    if (!this.resources.get(lng).has(ns) && lng !== this.fallbackLng) lng = this.fallbackLng
    if (!this.resources.get(lng).has(ns)) return key

    if (this.resources.get(lng).get(ns).has(key)) {
      return this.resources.get(lng).get(ns).get(key)
    } else if (ns !== this.fallbackNS && !this.resources.get(lng).get(ns).has(key) && this.resources.get(lng).get(this.fallbackNS).has(key)) {
      return this.resources.get(lng).get(this.fallbackNS).get(key)
    } else if (lng !== this.fallbackLng && this.resources.get(this.fallbackLng).get(ns).has(key)) {
      return this.resources.get(this.fallbackLng).get(ns).get(key)
    } else if (ns !== this.fallbackNS && lng !== this.fallbackLng && this.resources.get(this.fallbackLng).get(this.fallbackNS).has(key)) {
      return this.resources.get(this.fallbackLng).get(this.fallbackNS).get(key)
    }

    return key
  }
}

export function newI18next (res: string = '{}', fallbackLng: string = 'dev', fallbackNS: string = 'translation'): I18next {
  const inst = new I18next(res, fallbackLng, fallbackNS)
  return inst
}

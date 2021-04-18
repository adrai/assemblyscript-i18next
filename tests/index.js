import assert from 'assert'
import i18next from '../index.js'

const i18n = i18next({
  resources: {
    en: {
      translation: {
        key1: 'This is my first key',
        key2: 'This is my second key'
      },
      ns2: {
        keyFromOtherNs: 'This one comes from another namespace',
        keyFromOtherNs2: 'Second: This one comes from another namespace'
      }
    },
    de: {
      translation: {
        key1: 'Das ist mein erster Schlüssel'
      },
      ns2: {
        keyFromOtherNs: 'Der kommt von einem andere Namespace'
      }
    }
  },
  fallbackLng: 'en'
})

assert.strictEqual(i18n.t('key1'), 'This is my first key')
assert.strictEqual(i18n.t('key2'), 'This is my second key')
assert.strictEqual(i18n.t('key3'), 'key3')

assert.strictEqual(i18n.t('key1', { lng: 'de' }), 'Das ist mein erster Schlüssel')
assert.strictEqual(i18n.t('key2', { lng: 'de' }), 'This is my second key')
assert.strictEqual(i18n.t('key3', { lng: 'de' }), 'key3')

assert.strictEqual(i18n.t('keyFromOtherNs', { ns: 'ns2' }), 'This one comes from another namespace')
assert.strictEqual(i18n.t('keyFromOtherNs', { lng: 'de', ns: 'ns2' }), 'Der kommt von einem andere Namespace')

assert.strictEqual(i18n.t('keyFromOtherNs2', { ns: 'ns2' }), 'Second: This one comes from another namespace')
assert.strictEqual(i18n.t('keyFromOtherNs2', { lng: 'de', ns: 'ns2' }), 'Second: This one comes from another namespace')

assert.strictEqual(i18n.t('key1', { ns: 'ns2' }), 'This is my first key')
assert.strictEqual(i18n.t('key1', { lng: 'de', ns: 'ns2' }), 'Das ist mein erster Schlüssel')
assert.strictEqual(i18n.t('key2', { ns: 'ns2' }), 'This is my second key')
assert.strictEqual(i18n.t('key2', { lng: 'de', ns: 'ns2' }), 'This is my second key')

i18n.changeLanguage('de')
assert.strictEqual(i18n.t('key1', { ns: 'ns2' }), 'Das ist mein erster Schlüssel')

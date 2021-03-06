import Gun from 'gun/gun'
import test from 'ava'
import {
  createFunctions
} from '../src/to-jsonld'

// TODO: deprecated! use chain-gun instead
import chain from 'gun-edge'
chain(Gun)
const gun = Gun();

test('savejsonld', async t => {
  let mark = gun.get('mark')
  let amber = gun.get('amber')

  amber.put({
    name: 'amber',
    gender: 'female'
  })

  mark.put({
    name: 'mark',
    gender: 'male',
  })

  // mark.path('wife').put(amber)
  mark.putAt('wife', amber)

  // mark.path('self').put(mark)
  mark.putAt('self', mark)

  let val = await mark.$value()
  console.log('mark', val)

  let {
    toLdGraph,
    toJsonLd
  } = createFunctions({
    logging: true
  })

  let {
    result,
    json
  } = await toJsonLd(mark, {
    // schemaUrl: 'http://schema.org/',
    // graphId: (id, opts) => graphId (string)
  })

  console.log('JSONLD', json)
  t.is(result.name, 'mark')
  t.is(result.wife.name, 'amber')
})
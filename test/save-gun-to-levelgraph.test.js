import test from 'ava'

import {
  createSaveToLvGraph,
  $saveToLvGraph
} from '../src/save-levelgraph'

import {
  sampleGunToJsonLd
} from './util/jsonld'

let sampleJson = `{
  "@context": "http://schema.org/",
  "@id": "#mark",
  "name": "mark",
  "gender": "male",
  "wife": {
    "@id": "#amber",
    "name": "amber",
    "gender": "female"
  },
  "self": {
    "@id": "#mark"
  }
}`

let sampleManu = `{
  "@context": {
    "name": "http://xmlns.com/foaf/0.1/name",
    "homepage": {
      "@id": "http://xmlns.com/foaf/0.1/homepage",
      "@type": "@id"
    }
  },
  "@id": "http://manu.sporny.org#person",
  "name": "Manu Sporny",
  "homepage": "http://manu.sporny.org/"
}`

async function makeQuery($dbGet, {
  queryId,
  context,
  t
}) {
  console.log('makeQuery', queryId, context)
  let opts = {
    '@context': context
  }

  try {
    return await $dbGet(queryId, opts)
  } catch (err) {
    throw err
  }
}


test('save Gun graph to LvGraph', async t => {
  let jsonld = await sampleGunToJsonLd()

  // TODO:
  // Fix addContext and graphId functions to:
  //   add valid @context on each node
  //   add valid @id on each node

  console.log('jsonld', jsonld)
  let queryId = jsonld['@id'] || '#mark'
  let context = jsonld['@context'] || "http://schema.org/"

  let queryOpts = {
    queryId,
    context
  }

  let {
    dbGet,
    $dbGet,
    saveToLvGraph,
    $saveToLvGraph
  } = createSaveToLvGraph()

  console.log('save', jsonld, queryOpts)
  try {
    let result = await $saveToLvGraph(jsonld)
    // do something after the obj is inserted
    if (!result) {
      throw 'no result'
    }

    console.log('mark was PUT', result)
    t.is(result.name, 'mark')

    console.log('make query', queryOpts)

    let queryRes = await makeQuery($dbGet, queryOpts)
    console.log('GOT mark', queryId, queryRes)

    if (queryRes) {
      t.is(queryRes.name, 'mark')
    } else {
      throw new Error(`Not match for query: ${queryId} in ${queryOpts.context}`)
    }

  } catch (err) {
    console.log('save err', err)
    throw err
  }
})
import gremlin from 'gremlin'
import 'dotenv/config'

const traversal = gremlin.process.AnonymousTraversalSource.traversal
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection

const url = process.env.SERVER_URL ? String(process.env.SERVER_URL) : ''

const connection = new DriverRemoteConnection(url)

const g = traversal().withRemote(connection)
const client = new gremlin.driver.Client(url)

class GremlinQueries {
  #submitters = (query: string) => client.submit(`g.${query}`)

  #querify = (vertex: { [key: string]: string }) => {
    let query = ''
    for (const key in vertex) {
      if (Number(vertex[key])) query += `.property('${key}', ${vertex[key]})`
      else query += `.property('${key}', '${vertex[key]}')`
    }
    return query
  }

  #searchQuery = (properties: { [key: string]: string }) => {
    let query = 'V()'
    for (const key in properties) {
      if (key === 'id') query += `.hasId(${properties[key]})`
      else query += `.has('${key}', '${properties[key]}')`
    }
    return query
  }

  check = (properties: { [key: string]: string }) => {
    const query = this.#searchQuery(properties)
    return this.#submitters(query + '.count()')
  }

  getVertex = (properties: { [key: string]: string }) => {
    const query = this.#searchQuery(properties)
    return this.#submitters(query)
  }

  getVertices = () => {
    const query = `V().project('id', 'name').by(id()).by('name')`
    return this.#submitters(query)
  }

  getEdges = () => {
    const query = `E().project('id','source','target').by(id()).by(outV().id()).by(inV().id())`
    return this.#submitters(query)
  }

  addVertexWithEdge = (
    from: { [key: string]: string },
    vertex: { [key: string]: string }
  ) => {
    const addQuery = this.#querify(vertex)
    const fromQuery = this.#searchQuery(from)
    const query = `addV()${addQuery}.addE('link').from(${fromQuery})`
    return this.#submitters(query)
  }

  addEdge = (from: string, to: string) => {
    const fromQuery = this.#searchQuery({ uuid: from })
    const toQuery = this.#searchQuery({ uuid: to })
    const query = `addE('link').from(${fromQuery}).to(${toQuery})`
    return this.#submitters(query)
  }
}

export default new GremlinQueries()

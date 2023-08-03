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

  check = (id: number) => g.V(id).hasNext()

  getVertices = () => {
    const query = `V().project('id', 'name').by(id()).by('name')`
    return this.#submitters(query)
  }

  getEdges = () => {
    const query = `E().project('id','source','target').by(id()).by(outV().id()).by(inV().id())`
    return this.#submitters(query)
  }

  addVertexWithNode = (id: number, vertex: { [key: string]: string }) => {
    const addQuery = this.#querify(vertex)
    const query = `addV()${addQuery}.addE('link').from(V(${id}))`
    return this.#submitters(query)
  }
}

export default new GremlinQueries()

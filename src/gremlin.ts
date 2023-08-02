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

  getNodes = () => {
    const query = `V().project('id', 'name').by(id()).by('name')`
    return this.#submitters(query)
  }

  getLinks = () => {
    const query = `E().project('id','source','target').by(id()).by(outV().id()).by(inV().id())`
    return this.#submitters(query)
  }
}

export default new GremlinQueries()

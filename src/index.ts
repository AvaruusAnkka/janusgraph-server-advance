import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import 'dotenv/config'
import GremlinQueries from './gremlin'

const app: Express = express()
const port = process.env.PORT

app.use(cors())
app.use(express.urlencoded({ extended: true }))

const request = (res: Response, result: object[] | object) => {
  try {
    res.json(result)
  } catch (error) {
    console.error('Error executing Gremlin query:', error)
    res.status(500).json({ error: 'Something went wrong.' })
  }
}

const gremlin = GremlinQueries

app.get('/graph', async (req: Request, res: Response) => {
  console.log('GET /graph')
  const nodes = await gremlin.getVertices()
  const links = await gremlin.getEdges()

  const result = {
    nodes: nodes._items.map((val: any) => Object.fromEntries(val)),
    links: links._items.map((val: any) => Object.fromEntries(val)),
  }
  request(res, result)
})

app.post('/vertex/edge', async (req: Request, res: Response) => {
  console.log('POST /vertex/edge')
  if (Number(req.query.id) && Object.keys(req.body).length > 0) {
    const target = await gremlin.check(Number(req.query.id))
    if (target) {
      const result = await gremlin.addVertexWithNode(
        Number(req.query.id),
        req.body
      )
      request(res, result)
    } else res.status(404).json({ error: 'Vertex not found.' })
  } else res.status(400).json({ error: 'Invalid data.' })
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})

export default request

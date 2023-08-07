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
  if (
    typeof req.query !== 'object' ||
    !Object.keys(req.body).length ||
    !Object.keys(req.query).length
  )
    res.status(400).json({ error: 'Invalid data.' })
  else {
    const exists = (await gremlin.check(Object(req.query)))._items[0]

    if (!exists) res.status(404).json({ error: 'Vertex not found.' })
    else if (exists > 1)
      res.status(404).json({ error: 'Multiple vertex found.' })
    else {
      const result = await gremlin.addVertexWithEdge(
        Object(req.query),
        req.body
      )
      request(res, result)
    }
  }
})

app.post('/edge', async (req: Request, res: Response) => {
  console.log('POST /edge')
  if (Object.keys(req.body).length !== 2 || !req.body.from || !req.body.to)
    res.status(400).json({ error: 'Invalid data.' })
  else {
      const result = await gremlin.addEdge(req.body.from, req.body.to)
      request(res, result)
//    }
  }
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})

export default request

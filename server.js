// Require the framework and instantiate it
// const fastify = require('fastify')({ logger: true })
import fastify from "fastify";
const server = fastify({ logger: true })
// Declare a route
server.get('/', async (request, reply) => {
    return { hello: 'world' }
})

server.route({
    method: "GET",
    url: "/end-point",
    schema: {
        querystring: {
            name: { type: 'string' }
        },
        response: {
            200: {
                type: "object",
                properties: {
                    hello: { type: "string" }
                }
            }
        }
    },
    preHandler: async (request, reply) => {
        console.log("Hello DucKiller")
    },
    handler: async (request, reply) => {
        return { hello: "DucKiller" }
    }
})

// Run the server!
const start = async () => {
    try {
        await server.listen(3000)
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}
start()
// Require the framework and instantiate it
// const Web3 = require('web3');
const fastify = require('fastify')({ logger: true });
// const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

// Declare a route
fastify.get('/', async (request, reply) => {
    return { hello: 'house' }
})

fastify.route({
    method: 'GET',
    url: '/hello',
    schema: {
        // request needs to have a querystring with a `name` parameter
        querystring: {
            name: { type: 'string' }
        },
        // the response needs to be an object with an `hello` property of type 'string'
        response: {
            200: {
                type: 'object',
                properties: {
                    hello: { type: 'string' }
                }
            }
        }
    },
    // this function is executed for every request before the handler is executed
    preHandler: async (request, reply) => {
        console.log("House, World!");
    },
    handler: async (request, reply) => {
        return { hello: 'world' }
    }
})


// Run the server!
const start = async () => {
    try {
        await fastify.listen(3000)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()
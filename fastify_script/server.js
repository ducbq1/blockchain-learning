// Require the framework and instantiate it
// const Web3 = require('web3');
const fastify = require('fastify')({ logger: true });
const axios = require('axios').default;

// const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

// Declare a route
fastify.get('/', async (request, reply) => {
    let result = await axios("https://api.bscscan.com/api?module=account&action=balance&address=0x70F657164e5b75689b64B7fd1fA275F334f28e18&apikey=FGKHMRH65UDHMRXY9DH5RNY4CBY9D1ZD2Z");
    console.log(result);
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
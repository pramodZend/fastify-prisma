const fastify = require('fastify')({
    logger:true
});
const PORT = process.env.PORT || 5000;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


//fastify.register(require('./routes/posts'));

fastify.get('/', async (request, reply) => {
    const allPosts = await prisma.post.findMany();
    console.log('result',allPosts);
    reply.send(allPosts);
  });

const startServer = async()=>{
    try{
        await fastify.listen(PORT);
    }catch(error){
        fastify.log.error(error);
        process.exit(1);
    }
}
startServer();
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

  //get single user record
  fastify.get('/user/:id', async (request, reply) => {
    
        const { id } = request.params;
        const user   = await prisma.user.findUnique({
            where:{ id:Number(id) }
            // include:{
            //     post:true
            // },
        });
        console.log('Unique records',user);
        reply.send(user);
  });

  fastify.post('/user', async (req, res) => {
    const job = await prisma.user.create({ data: req.body });
    res.json(job);
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
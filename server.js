const fastify = require('fastify')({
    logger:true
});
const PORT = process.env.PORT || 5000;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


//fastify.register(require('./routes/posts'));
//get all records
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
//insert user records
  fastify.post('/register', async (req, res) => {
    console.log('request',req);
    //res.json(req);
    const job = await prisma.user.create({ data: req.body });
    res.send(job);
  });
//delete single user record
  fastify.delete('/delete/:id', async (request, reply) => {
    const { id } = request.params;
    const user   = await prisma.user.delete({
        where:{ id:Number(id) }
        // include:{
        //     post:true
        // },
    });
    console.log('Unique records',user);
    reply.send(user);
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
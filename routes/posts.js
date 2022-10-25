const { getPostsSchema, getPostSchema } = require('../controllers/schemas/postSchema.js');
const { postHandler,getPostHandler } = require('../controllers/handlers/postHandlers.js');

const getPostsOpts = {
    schema:getPostsSchema,
    handler: (req, reply) => {
        reply.send(getPostsHandler);
    },
};

 const getPostOpts = {
     schema:getPostSchema,
     handler: getPostHandler,
 };

const postRoutes = (fastify,options,done)=>{ console.log("hello world",getPostsOpts);
    fastify.get('/',getPostsOpts);
    fastify.get('/:id',getPostOpts);
    done();
}
module.exports = postRoutes;
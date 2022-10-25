
const posts = require('../../cloud/postsDb.js');

// const getPostsHandler = (req, reply) => {
//   //reply.send(posts);
//   reply.send([
//     { id: 1, title: 'Post One', body: 'This is post one' },
//     { id: 2, title: 'Post Two', body: 'This is post two' },
//     { id: 3, title: 'Post Three', body: 'This is post three' },
//   ]);
// };

getPostsHandler = posts.PostDb;
const PostDb = posts.PostDb;
console.log("posts",posts.PostDb);

//get single posts
const getPostHandler = (req, reply) => {
    const { id } = req.params;
  
    const post = PostDb.filter((post) => {
      return post.id === id;
    })[0];
  
    if (!post) {
      return reply.status(404).send(new Error('Post not found'));
    }
  
    return reply.send(post);
};
  

module.exports = { 
    getPostsHandler,getPostHandler
};
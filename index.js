var express = require('express');
var cors = require('cors');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');

// GraphQL schema
const schema = buildSchema(`
  type Query {
    post(id: Int!): Post
    posts: [Post]
  }
  
  type Post {
    id: Int
    title: String
    author: String
    content: String
  }
`)

const dummyPosts = [
  { id: 1, title: 'titleXXXX', author: 'yamada', content: 'abcdefg' },
  { id: 2, title: 'titleYYYY', author: 'suzuki', content: '1234567' },
  { id: 3, title: 'titleZZZZ', author: 'tanaka', content: 'ABCDEFG' }
]

// Root resolver
const root = {
  post: args => {
    const id = args.id
    return dummyPosts.filter(post => post.id == id)[0]
  },
  posts: () => dummyPosts
}

// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql',(req,res,next)=>{

  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'content-type, authorization, content-length, x-requested-with, accept, origin');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.header('Allow', 'POST, GET, OPTIONS')
  res.header('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
}, express_graphql({
 schema: schema,
 rootValue: root,
 graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));

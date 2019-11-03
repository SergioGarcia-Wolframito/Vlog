import { GraphQLServer} from 'graphql-yoga';
import * as uuid from 'uuid';

const authorData = [{

  name: "Hola",
  email: "Paco@gmail.com",
  id: "35b85ded-f3e6-4537-8dd2-a8aabd6b83de"

}];
const postsData = [{

  title: "Un post",
  body: "Soy la hostia",
  author: "5f5b2265-1b8e-4d27-9f1f-aad31da1f275",
  date: "12/12/2012",
  comments:[],
  id:"1"

}];

const commentsData = [];

const typeDefs = `
type Author{
  name: String!
  email: String!
  id: ID!
  posts: [Post!]
}
type Comment{
  body: String!
  date: String!
  id: ID!
  author: Author!
}
type Post{
  id: ID!
  title: String!
  body: String!
  date: Int!
  author: Author!
  comments: [Comment!]
}
type Query{
  author(id: ID!): Author
  post(id: ID!): Post!
}

type Mutation{
  
  addAuthor(name: String!, email: String!): Author!
  addPost(title: String!, body: String!, author: ID!): Post!
  removePost(id:ID!):String!
 
}
  `
  //tipo ID es un id, que se usa en GraphQl para los ID

const resolvers = {

  Author:{

    posts: (parent, args, ctx, info)=>{

      const authorID = parent.id;
      return postsData.filter(obj => obj.author == authorID);

    },

  },

  Post:{

    author:(parent, args, ctx, info)=>{
      //en parent tengo el resultado
      const authorID = parent.author;
      const result = authorData.find(obj => obj.id === authorID);

      return result;

    },
  },

  Query: {

    author(parent, args, ctx, info){

      const result = authorData.find(obj => obj.id === args.id);
      return result;

    },

    post(parent, args, ctx, info){

      if(postsData.some(obj=>obj.id === args.id)){

        throw new Error ('Unknow post with id' + args.id);

      }
      const result = postsData.find(obj => obj.id === args.id);
      // //result es un objeto, que tiene title, body, date, author 
      // const idAuthor = result.author;
      // //cojo el id, ya que el author es un id
      // const author = authorData.find(obj => obj.id === idAuthor);
      // // encuentra

      // return {...result,author};
      // //

      return result;

    },
    
  },

  Mutation: {

    addAuthor(parent, args, ctx, info){

      const {name,email} = args;   
      
      if(authorData.some(obj => obj.email === email)){//Devuelve true o false

        throw new Error ('User email' + email + 'already in use');

      }

      const author = {

        name,
        email,
        id:uuid.v4()//uuid genera id aleatorios

      }

      authorData.push(author);
      return author;

    }, 

    addPost:(parent, args, ctx, info)=>{

      const {title,body,author} = args;  

      if(! authorData.some(obj => obj.id === author)){

        throw new Error('Author ' + author + 'not found');

      }

      const date = new Date().getDate();
      const id = uuid.v4();

      const post = {

        title, body, author, date, id

      };

      postsData.push(post);
      return post;

    },

    removePost:(parent, args, ctx, info)=>{

      
      if(postsData.some(obj => obj.id === args.id)){//Devuelve true o false

       
        const result = postsData.find(obj => obj.id === args.id);


        var index = postsData.indexOf(result);
        if (index > -1) {
          postsData.splice(index, 1);
        }

        return ("Eliminado con Exito");

      }else{

        return ("No existe");

      }

    },
   
  },

}

const server = new GraphQLServer({typeDefs, resolvers})
server.start({port: "3006"})


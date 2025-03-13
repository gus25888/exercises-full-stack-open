const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const mongoose = require('mongoose')

const { MONGODB_URI, JWT_SECRET } = require('./config')
const schemas = require('./schemas')
const resolvers = require('./resolvers')

mongoose.set('strictQuery', false)

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


const server = new ApolloServer({
  typeDefs: schemas,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },

  // Aquí se agrega el token de autenticación para que todo usuario deba loguearse antes de hacer gestiones en la aplicación.

  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id).populate('friends')
      return { currentUser }
    }
  },


}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
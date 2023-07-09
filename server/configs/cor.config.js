const corsConfig={
    origin: process.env.CLIENT_API,
    exposedHeaders: 'Authorization',
    credentials: true,
}

module.exports=corsConfig
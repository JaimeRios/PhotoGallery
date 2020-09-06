//conection to database

const mongoose =  require('mongoose');

mongoose.connect(process.env.MONGODB_URI,{
 useCreateIndex: true,
 useNewUrlParser: true,
 useFindAndModify: false,
 useUnifiedTopology: true
})
.then(db=>console.log('DB IS connected'))
.catch(err=>console.error(err));
//for use mongoose
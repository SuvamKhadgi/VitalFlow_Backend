const express = require('express')
const connectDB = require("./config/db")
const UserRouter = require("./routes/userRoutes")
const app = express();

connectDB();
app.use(express.json());
app.use("/api/user", UserRouter);

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

// app.listen(5002,()=>{
//     console.log("Server started at 5002")
// })
// app.use(express.json())
// app.post("/data",(req,res)=>{
//     console.log(req.body)
//     res.json(req.body)
// })
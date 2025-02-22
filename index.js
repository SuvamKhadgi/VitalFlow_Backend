const express = require('express')
const connectDB = require("./config/db")
const CreadRouter = require("./routes/creadRoutes")
const ItemRouter = require("./routes/itemsRoutes")
const CartRouter= require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require('./routes/dashboardRoutes');
const app = express();

connectDB();
app.use(express.json());


const cors = require('cors'); // Import the cors package
const corsOptions = {
    credentials: true,
    origin: ['http://localhost:5000'] // Whitelist the domains you want to allow
};
app.use(cors(corsOptions));


app.use("/api/creds", CreadRouter);
app.use("/api/items", ItemRouter)
app.use("/api/cart",CartRouter)
app.use("/api/order", orderRoutes);
app.use('/api/admin', dashboardRoutes);
app.use('/uploads', express.static('uploads'));
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


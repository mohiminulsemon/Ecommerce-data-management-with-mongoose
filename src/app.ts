import express, { Request, Response , Application} from 'express'
import cors from 'cors'

import { ProductRoutes } from "./modules/product/product.route";
import { OrderRoutes } from "./modules/order/order.route";

const app: Application = express()

//parser
app.use(express.json())
app.use(cors())

//routes
app.use("/api/products", ProductRoutes);
app.use("/api/orders", OrderRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Ecommerce API is running' )
})

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;

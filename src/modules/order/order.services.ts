import { OrderModel } from "../orders.model";
import { TOrder } from "./order.interface";

const createOrderIntoDB = async (order: TOrder) => {
  const newOrder = await OrderModel.create(order);
  return newOrder;
};

const getAllOrdersFromDB = async (email?: string) => {
  const query = email ? { email } : {};
  const orders = await OrderModel.find(query);
  return orders;
};

export const OrderServices = {
  createOrderIntoDB,
  getAllOrdersFromDB,
};

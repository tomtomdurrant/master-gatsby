import { useContext, useState } from 'react';

import OrderContext from '../components/OrderContext';

export default function usePizza({ pizzas, inputs }) {
  // 1. Create some state to hold our order
  // const [order, setOrder] = useState([]);
  const [order, setOrder] = useContext(OrderContext);
  // 2. Make a function to add things to order
  function addToOrder(orderedPizza) {
    setOrder([...order, orderedPizza]);
  }
  // 3. Make a function to remove things from order
  function removeFromOrder(index) {
    setOrder([
      // Everything before the item we want to remove
      ...order.slice(0, index),
      // Everything after the item we want to remove
      ...order.slice(index + 1),
    ]);
  }

  // TODO: Serverless function

  return {
    order,
    addToOrder,
    removeFromOrder,
  };
}

import calculatePizzaPrice from './calculatePizzaPrice';

export default function calculateOrderTotal(order, pizzas) {
  // Loop over every single item in the order
  const total = order.reduce((runningTotal, singleOrder) => {
    // Get the pizza
    const pizza = pizzas.find(
      (singlePizza) => singlePizza.id === singleOrder.id
    );
    return runningTotal + calculatePizzaPrice(pizza.price, singleOrder.size);
  }, 0);
  // calc total for that pizza
  // add total to the running total
  return total;
}

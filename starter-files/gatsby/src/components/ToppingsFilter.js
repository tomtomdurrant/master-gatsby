import { graphql, Link, useStaticQuery } from 'gatsby';
import React from 'react';
import styled from 'styled-components';

const ToppingsStyles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 4rem;
  a {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 0 1rem;
    align-items: center;
    padding: 5px;
    background: var(--grey);
    border-radius: 2px;
    .count {
      background: white;
      padding: 2px 5px;
    }
    .active {
      background: var(--yellow);
    }
  }
`;

function countPizzasInToppings(pizzas) {
  // Return the pizzas with the counts
  const counts = pizzas
    .map((pizza) => pizza.toppings)
    .flat()
    .reduce((acc, topping) => {
      // Check if this is an existing topping
      const existingTopping = acc[topping.id];
      // if the existing topping exists
      if (existingTopping) {
        existingTopping.count += 1;
      } else {
        // else create a new topping in the acc object
        acc[topping.id] = {
          id: topping.id,
          name: topping.name,
          count: 1,
        };
      }
      // If it is, increment it by 1
      // Else create a new entry in the acc and set it to 1
      return acc;
    }, {});

  return Object.values(counts).sort((a, b) => b.count - a.count);
}

export default function ToppingsFilter() {
  // List of all toppings
  // List of all pizzas with their toppings
  const { toppings, pizzas } = useStaticQuery(graphql`
    query {
      toppings: allSanityTopping {
        nodes {
          name
          id
          vegetarian
        }
      }
      pizzas: allSanityPizza {
        nodes {
          toppings {
            name
            id
          }
        }
      }
    }
  `);
  console.clear();
  console.log({ toppings, pizzas });
  // Count how many pizzas are in each toppings
  const toppingsWithCount = countPizzasInToppings(pizzas.nodes);
  console.log(toppingsWithCount);
  // Loop over the list of toppings and display the topping and the count of
  // pizzas in that topping
  return (
    <ToppingsStyles>
      {toppingsWithCount.map((topping) => (
        <Link to={topping.name} key={topping.id}>
          <span className="name">{topping.name}</span>
          <span className="count">{topping.count}</span>
        </Link>
      ))}
    </ToppingsStyles>
  );
}

import path from 'path';
import fetch from 'isomorphic-fetch';

async function turnPizzasIntoPages({ graphql, actions }) {
  // 1. Get a template for this page
  const pizzaTemplate = path.resolve('./src/templates/Pizza.js');
  // 2. Query all Pizzas
  const { data } = await graphql(`
    query {
      pizzas: allSanityPizza {
        nodes {
          name
          slug {
            current
          }
        }
      }
    }
  `);
  // 3. Loop over each pizza and create a page for that pizza
  data.pizzas.nodes.forEach((pizza) => {
    console.log(`creating a page for ${pizza.name}`);
    actions.createPage({
      path: `pizza/${pizza.slug.current}`,
      component: pizzaTemplate,
      context: {
        slug: pizza.slug.current,
        tom: 'is cool',
      },
    });
  });
}

async function turnToppingsIntoPages({ graphql, actions }) {
  // 1. Get a template for this page, edit the pizzas page to only show those with the selected topping
  const toppingTemplate = path.resolve('./src/pages/pizzas.js');
  // 2. Query all toppings
  const { data } = await graphql(`
    query {
      toppings: allSanityTopping {
        nodes {
          name
          id
        }
      }
    }
  `);
  console.log('======');
  console.log(data);
  console.log('======');
  data.toppings.nodes.forEach((topping) => {
    console.log(`Creating a page for topping ${topping.name}`);
    actions.createPage({
      path: `topping/${topping.name}`,
      component: toppingTemplate,
      context: {
        topping: topping.name,
        // TODO Regex for topping
      },
    });
  });
}

async function fetchBeersAndTurnIntoNodes({
  actions,
  createNodeId,
  createContentDigest,
}) {
  console.log('===🍺turn beers into nodes');
  // 1. fetch a list of beers
  // fetch is a browser api so cannot use in node
  const res = await fetch('https://sampleapis.com/beers/api/ale');
  const beers = await res.json();
  // console.log('\t ===🍺', beers);
  // 2. loop over each one
  for (const beer of beers) {
    const nodeContent = JSON.stringify(beer);
    const nodeMeta = {
      // need to create an id
      id: createNodeId(`beer-${beer.name}`),
      parent: null,
      children: [],
      internal: {
        type: 'Beer',
        mediaType: 'application/json',
        contentDigest: createContentDigest(beer),
      },
    };
    // 3. create a node for that beer
    actions.createNode({ ...beer, ...nodeMeta });
  }
}

async function turnSliceMastersIntoPages({ graphql, actions }) {
  // 1. query all slicemasters
  const { data } = await graphql(`
    query {
      slicemasters: allSanityPerson {
        totalCount
        nodes {
          name
          id
          slug {
            current
          }
        }
      }
    }
  `);
  // 2. turn each slicemaster into their own page
  data.slicemasters.nodes.forEach((slicemaster) => {
    console.log('Creating a page for', slicemaster.name);
    actions.createPage({
      path: `slicemaster/${slicemaster.slug.current}`,
      component: path.resolve('./src/templates/Slicemaster.js'),
      context: {
        slicemaster: slicemaster.name,
        slug: slicemaster.slug.current,
      },
    });
  });
  console.log(data.slicemasters);
  // 3. figure out how many pages there are, based on how many slicemasters there are, and how many per page
  const pageSize = Number.parseInt(process.env.GATSBY_PAGE_SIZE);
  const pageCount = Math.ceil(data.slicemasters.totalCount / pageSize);
  console.log('=========');
  console.log(`There are ${data.slicemasters.totalCount} people`);
  console.log(`We have ${pageCount} pages with ${pageSize} per page`);

  // 4. loop from 1 to n and create pages for them
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < pageCount; index++) {
    console.log('creating page', index);
    actions.createPage({
      path: `/slicemasters/${index + 1}`,
      component: path.resolve('./src/pages/slicemasters.js'),

      // this data is passed to the template when we create it
      context: {
        skip: index * pageSize,
        currentPage: index + 1,
        pageSize,
      },
    });
  }
}

export async function sourceNodes(params) {
  // fetch a list of beers and source them into our gatsby API
  await Promise.all([fetchBeersAndTurnIntoNodes(params)]);
}

export async function createPages(params) {
  // Create pages dynamically
  await Promise.all([
    // 1. Pizzas
    turnPizzasIntoPages(params),
    // 2. Toppings
    turnToppingsIntoPages(params),
    // 3. Slicemasters
    turnSliceMastersIntoPages(params),
  ]);
}

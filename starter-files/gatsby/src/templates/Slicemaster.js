import { graphql } from 'gatsby';
import React from 'react';
import Img from 'gatsby-image';
import SEO from '../components/SEO';

export default function Slicemaster({ data }) {
  const slicemaster = data.sanityPerson;
  return (
    <>
      <SEO title={slicemaster.name} image={slicemaster.image.asset.src} />
      <div className="center">
        <Img fluid={slicemaster.image.asset.fluid} />
        <h2>
          <span className="mark">{slicemaster.name}</span>
        </h2>
        <p>{slicemaster.description}</p>
      </div>
    </>
  );
}
export const query = graphql`
  # Slug is passed in by the pageContext
  query($slug: String!) {
    sanityPerson(slug: { current: { eq: $slug } }) {
      description
      id
      name
      image {
        asset {
          fluid(maxWidth: 1000, maxHeight: 750) {
            ...GatsbySanityImageFluid
          }
        }
      }
    }
  }
`;

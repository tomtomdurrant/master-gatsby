import { Link } from 'gatsby';
import React from 'react';
import styled from 'styled-components';

const PaginationStyles = styled.div`
  display: flex;
  border: 1px solid var(--grey);
  margin: 2rem 0;
  border-radius: 5px;
  text-align: center;
  & > * {
    flex: 1;
    padding: 1rem;
    border-right: 1px solid var(--grey);
    text-decoration: none;
    &[aria-current='page'],
    &.current {
      color: var(--red);
    }
    &[disabled] {
      pointer-events: none;
      color: var(--grey);
    }
  }
`;

export default function Pagination({
  pageSize,
  totalCount,
  currentPage,
  skip,
  base,
}) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const hasNextPage = nextPage <= totalPages;
  const hasPreviousPage = previousPage >= 1;

  return (
    <PaginationStyles>
      <Link disabled={!hasPreviousPage} to={`${base}/${previousPage}`}>
        &#8592; Prev
      </Link>
      {[...Array(totalPages)].map((page, i) => (
        <Link
          className={currentPage === 1 && i === 0 ? 'current' : ''}
          to={`${base}/${i > 0 ? i + 1 : ''}`}
        >
          {i + 1}
        </Link>
      ))}
      <Link disabled={!hasNextPage} to={`${base}/${nextPage}`}>
        Next &#8594;
      </Link>
    </PaginationStyles>
  );
}

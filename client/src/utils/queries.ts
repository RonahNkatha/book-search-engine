import { gql } from '@apollo/client';

// Query to get the authenticated user's information along with their saved books
export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;
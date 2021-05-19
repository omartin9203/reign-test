import { gql } from "apollo-boost";

export const NEWS_FRAGMENT = gql`
    fragment NewsFragment on NewsDto {
        id
        createdAt
        createdAtTS
        active
        author
        externalId
        storyTitle
        storyUrl
        title
        url
    }
`;

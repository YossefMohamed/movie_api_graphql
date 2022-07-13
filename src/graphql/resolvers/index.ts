import { userResolvers } from "./userResolvers";
import { movieResolvers } from "./movieResolvers";
import { commentResolvers } from "./commentResolvers";
import { postResolvers } from "./postResolvers";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...movieResolvers.Query,
    ...commentResolvers.Query,
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...movieResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...postResolvers.Mutation,
  },
};

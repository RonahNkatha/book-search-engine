// import Tech, { ITech } from '../models/Tech.js';

import User from "../models/User.js";
// import Book from "../models/Book";
import { signToken } from "../services/auth.js";

// import Matchup, { IMatchup } from '../models/Matchup.js';

// interface Context {
//   user: {
//     _id: String;
//   };
// }

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      console.log(context.user);
      // If the user is authenticated, find and return the user's information along with their books
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("books");
      }
      // If the user is not authenticated, throw an AuthenticationError
      throw new Error("Could not authenticate user.");
    },
    // tech: async (): Promise<ITech[] | null> => {
    //   return Tech.find({});
    // },
    // matchups: async (
    //   _parent: any,
    //   { _id }: { _id: string }
    // ): Promise<IMatchup[] | null> => {
    //   const params = _id ? { _id } : {};
    //   return Matchup.find(params);
    // },
  },
  Mutation: {
    addUser: async (_parent: any, args: any): Promise<any> => {
      console.log(args, "args");
      const user = await User.create(args);
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    login: async (_parent: any, args: any): Promise<any> => {
      console.log(args, "args");
      const user = await User.findOne({ email: args.email });
      if (!user) {
        throw new Error("user not found");
      }

      const correctPw = await user.isCorrectPassword(args.password);
      if (!correctPw) {
        throw new Error("Password is invalid");
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    // createVote: async (
    //   _parent: any,
    //   { _id, techNum }: { _id: string; techNum: number }
    // ): Promise<IMatchup | null> => {
    //   const vote = await Matchup.findOneAndUpdate(
    //     { _id },
    //     { $inc: { [`tech${techNum}_votes`]: 1 } },
    //     { new: true }
    //   );
    //   return vote;
    // },
  },
};

export default resolvers;

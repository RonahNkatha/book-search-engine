// import Tech, { ITech } from '../models/Tech.js';

import User from "../models/User.js";
// import Book from "../models/Book";
import { signToken } from "../services/auth.js";

// import Matchup, { IMatchup } from '../models/Matchup.js';

interface BookArgs {
  bookId: string;
}

interface AddBookArgs {
  book: {
    bookId: string;
    authors: string[];
    description: string;
    title: string;
    image: string;
    link: string;
  }
}

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new Error("Could not authenticate user.");
    },
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

    saveBook: async (_parent: any, { book }: AddBookArgs, context: any) => {
      if (context.user) {
        console.log('Received book data:', book); 
    
        try {
          const updatedUser = await User.findByIdAndUpdate(
            context.user._id,
            {
              $addToSet: { savedBooks: book }, 
            },
            { new: true, runValidators: true } 
          );
    
          console.log('Updated user with saved book:', updatedUser); 
    
          if (!updatedUser) {
            throw new Error('User not found');
          }
    
          return updatedUser;
        } catch (error) {
          console.error('Error in saveBook mutation:', error);
          throw new Error('Failed to save the book');
        }
      }
      throw new Error('You need to be logged in!');
    },
    

    removeBook: async (_parent: any, { bookId }: BookArgs, context: any) => {
      if (context.user) {
        try {
          const updatedUser = await User.findByIdAndUpdate(
            context.user._id,
            { $pull: { savedBooks: { bookId: bookId } } }, 
            { new: true }
          );
    
          if (!updatedUser) {
            throw new Error('User not found');
          }
    
          console.log('Updated user after book removal:', updatedUser);
    
          return updatedUser;
        } catch (error) {
          console.error('Error in removeBook mutation:', error);
          throw new Error('Failed to remove the book');
        }
      }
      throw new Error('You need to be logged in!');
    },
    
  },
};

export default resolvers;

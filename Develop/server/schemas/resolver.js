const { authError } = require('apollo-server-express');
const { User } = require('../models');
const { authToken } = require('../utils/auth');

const resolver = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              data = await User.findOne({ _id: context.user._id }).select('-__v -password');
              return data;
            }
            throw new authError('You need to be logged in!');
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
          const user = await User.create({ username, email, password });
          const token = authToken(user);
          return { token, user };
        },
        login: async (parent, { email, password }) => {
          const user = await User.findOne({ email });
    
          if (!user) {
            throw new authError('User not found. Do you have an account?');
          }
    
          const correctPw = await user.isCorrectPassword(password);
    
          if (!correctPw) {
            throw new authError('Incorrect credentials!');
          }
    
          const token = authToken(user);
    
          return { token, user };
        },
        saveBook: async (parent, { newBook }, context) => {
          if (context.user) {
            const updatedUser = await User.findByIdAndUpdate(
              { _id: context.user._id },
              { $push: { savedBooks: newBook }},
              { new: true }
            );
            return updatedUser;
          }
          throw new authError('Must Login First!');
        },
        deleteBook: async (parent, { bookId }, context) => {
          if (context.user) {
            const updatedUser = await User.findByIdAndUpdate(
              { _id: context.user._id },
              { $pull: { savedBooks: { bookId }}},
              { new: true }
            );
            return updatedUser;
          }
          throw new authError('Login required!');
        },
    }
};

module.exports = resolver;
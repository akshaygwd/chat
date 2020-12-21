const { User, Message } = require('../../models');
const bcrypt = require('bcryptjs');
const { UserInputError, AuthenticationError, withFilter } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/env.json');
const { Op } = require('sequelize');


module.exports =  {
    Query: {
      hellome: () => 'world 1234',
      getMessage: async (parent, { from }, { user } ) => {
        try {
          console.log(from, 'hit me here and now');
            if(!user) {
                throw new AuthenticationError('Unauthenticated');
            }
            const otherUser = await User.findOne({
                where: { username: from }
            });

            if(!otherUser) throw new UserInputError('User not found');
            const usernames = [user.username, otherUser.username]
            const messages = await Message.findAll({
                where: {
                    from : { [Op.in]: usernames },
                    to : { [Op.in] : usernames}
                },
                order: [['createdAt', 'DESC']]
            })

            return messages

        }catch(err) {
            console.log(err);
            throw err;
        }
      }
    },
    Mutation: {
      sendMessage: async (parent, {to, content}, {user, pubsub}) => {
        try {
          if(!user) {
            throw new AuthenticationError('Unauthenticated');
          }

          const recipent = await User.findOne({where: {username: to }});
          if(!recipent) {
            throw new UserInputError('User not found');
          }else if(recipent.username == user.username) {
            throw new UserInputError('you cant message yourself');
          }

          if(content.trim() == '') {
            throw new UserInputError('Message is empty');
          }

          console.log(to, content, user, 'i am here');

          const message = await Message.create({
            from: user.username,
            to: to,
            content: content
          });

          pubsub.publish('NEW_MESSAGE', { newMessage: message })

          console.log(message, 'hit mememe');

          return message;
        }
        catch(err) {
          console.log(err)
          throw err;
        }
      }
    },
    Subscription: {
      newMessage: {
        subscribe: withFilter(
          (_, __, { pubsub, user }) => {
            if (!user) throw new AuthenticationError('Unauthenticated')
            return pubsub.asyncIterator(['NEW_MESSAGE'])
          },
          ({ newMessage }, _, { user }) => {
            if (
              newMessage.from === user.username ||
              newMessage.to === user.username
            ) {
              return true
            }

            return false
          }
        ),
      }
    }
};
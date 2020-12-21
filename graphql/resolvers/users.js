const { User, Message } = require('../../models');
const bcrypt = require('bcryptjs');
const { UserInputError, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/env.json');
const { Op } = require('sequelize');

module.exports =  {
    Query: {
      hellome: () => 'world 1234',
      getUsers: async (_, __, {user}) => {
          try {
            if(!user) {
              throw new AuthenticationError('Unauthenticated');
            }
            console.log(user, 'user me');
            let users = await User.findAll({
              attributes: ['username', 'imageUrl', 'createdAt'],
              where : { username: {[Op.ne]: user.username}}
            })

            const allUserMessages = await Message.findAll({
              where: {
                [Op.or] : [{from: user.username}, {to: user.username}]
              },
              order: [['createdAt', 'DESC']]
            });

            users = users.map(otherUser => {
              const latestMessage = allUserMessages.find(
                m => m.from == otherUser.username || m.to == otherUser.username
              )
              otherUser.latestMessage = latestMessage;
              return otherUser;
            })

            console.log(users, 'hit me here now');

            return users;
          }catch(error) {
            console.log(error);
            throw error;
          }
      },
      login: async (parent, args) => {
        const { username, password } = args;
        let errors = {};
        try {
          if(username.trim() == '') errors.username = 'username must not be empty';
          if(password.trim() == '') errors.password = 'password must not be empty';

          if(Object.keys(errors).length > 0) {
            throw new UserInputError('bad input', { errors });
          }

          const user = await User.findOne({
            where: { username }
          })

          if(!user) {
            errors.username = 'User does not exists';
          }

          if(Object.keys(errors).length > 0) {
            throw new UserInputError('user not found', { errors });
          }

          const correctPassword = await bcrypt.compare(password, user.password);

          if(!correctPassword) {
            errors.password = 'Passwor is worng';
            throw new UserInputError('Passwor is worng', { errors });
          }

          const token = await jwt.sign({
            username
          }, JWT_SECRET, { expiresIn: 60 * 60 })

          return {
            ...user.toJSON(),
            token,
          };

        } catch(err) {
          console.log(err);
          throw err;
        }
      }
    },
    Mutation: {
      register: async (parent, args, context, info) => {
        const { username, email, password, confirmPassword } = args;
        console.log(args, 'hirt');
        let errors = {};

        try {
          if(email.trim() == '') errors.email = 'Email must not be empty';
          if(username.trim() == '') errors.username = 'username must not be empty';
          if(password.trim() == '') errors.password = 'password must not be empty';
          if(password != confirmPassword) errors.confirmPassword = 'passwords not matching';

          // const userByUsername = await User.findOne({where: { username }})
          // const userByUseremail = await User.findOne({where: { email }})

          // if(userByUsername) errors.username = 'Username is taken';
          // if(userByUseremail) errors.email = 'email is taken';

          if(Object.keys(errors).length > 0) {
            throw errors;
          }

          const hashpassword = await bcrypt.hash(password, 12);
          const user = await User.create({
            username,
            email,
            password: hashpassword
          });
          return user;
        }
        catch(err) {
          console.log(err);
          if(err.name === 'SequelizeUniqueConstraintError') {
            err.errors.forEach((e) => (errors[e.path.split('.')[1]] = e.message.split('.')[1]))
          }else if (err.name == 'SequelizeValidationError') {
            err.errors.forEach((e) => (errors[e.path] = e.message))
          }
          throw new UserInputError('bad Input', {errors});
        }
      },
    },
};
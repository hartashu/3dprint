const { Op } = require('sequelize');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

class Controller {
  static async getRegister(req, res) {
    try {
      // Query validate errors
      let { errors } = req.query;
      if (errors) errors = errors.split(',');

      res.render('registerPage.ejs', { errors });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }

  static async postRegister(req, res) {
    try {
      const { username, email, password, role } = req.body;

      await User.create({ username, email, password, role });

      res.redirect('/login');
    } catch (err) {
      if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(el => el.message);
        res.redirect(`/register?errors=${errors}`);
      } else {
        console.log(err);
        res.send(err);
      }
    }
  }

  static async getLogin(req, res) {
    try {
      // Query validate errors
      let { errors } = req.query;
      if (errors) errors = errors.split(',');

      res.render('loginPage.ejs', { errors });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }

  static async postLogin(req, res) {
    try {
      const { email, password, role } = req.body;

      // Manual validation
      const errors = Controller.validateError(email, password);
      if (errors.length) throw { name: 'ValidationError', errors }

      const user = await User.findOne({
        where: {
          email: {
            [Op.eq]: email
          }
        }
      });

      // Check email isRegistered
      if (!user) throw { name: 'ValidationError', errors: `User with email ${email} not registered yet!`};

      // Check hash password
      const isMatchingPassword = await bcrypt.compare(password, user.password);
      if (isMatchingPassword) {
        req.session.user = {
          id: user.id,
          username: user.username,
          role: user.role
        };

        // console.log(req.session);

        if (user.role === 'buyer') {
          res.redirect('/buyer/upload');
        } else if (user.role === 'seller') {
          res.redirect('/seller');
        }
      } else {
        throw { name: 'ValidationError', errors: `Wrong password!`};
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = err.errors;
        res.redirect(`/login?errors=${errors}`);
      } else {
        console.log(err);
        res.send(err);
      }
    }
  }

  static async getUpload(req, res) {
    try {
      res.render('upload.ejs');
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }

  static async postUpload(req, res) {
    try {
      // console.log(req.files);
      res.send(req.file);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }







  static async getSellerPage(req, res) {
    try {
      res.send('Seller Page');
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }



  static async getLogout(req, res) {
    try {
      req.session.destroy(err => {
        if (err) throw err;
        else res.redirect('/login');
      });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }

  static async getForbidden(req, res) {
    try {
      res.render('forbidden.ejs');
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }

  static validateError(email, password) {
    const errors = [];

    if (!email) errors.push('Email is empty!');
    if (!password) errors.push('Password is empty!');

    return errors;
  }







  
  
  static async testing(req, res) {
    try {
      
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
}

module.exports = Controller;
const { Op, where } = require('sequelize');
const { User, Profile, Order, OrderDetail, Material } = require('../models');
const bcrypt = require('bcryptjs');

class Controller {
  // ============================== HOME ==============================

  static async home(req, res) {
    try {
      if (req.session.user) {
        const userId = req.session.user.id;
        const role = req.session.user.role;

        if (role === 'buyer') {
          res.redirect(`/buyer/${userId}/order`);
        } else if (role === 'seller') {
          res.redirect(`/seller/${userId}`);
        }
      } else {
        res.render('home.ejs');
      }
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }



  // ============================== LOGIN & REGISTER ==============================

  static async getRegister(req, res) {
    try {
      if (req.session.user) {
        const userId = req.session.user.id;
        const role = req.session.user.role;

        if (role === 'buyer') {
          res.redirect(`/buyer/${userId}/order`);
        } else if (role === 'seller') {
          res.redirect(`/seller/${userId}`);
        }
      } else {
        // Query validate errors
        let { errors } = req.query;
        if (errors) errors = errors.split(',');
  
        res.render('registerPage.ejs', { errors });
      }
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
      if (req.session.user) {
        const userId = req.session.user.id;
        const role = req.session.user.role;

        if (role === 'buyer') {
          res.redirect(`/buyer/${userId}/order`);
        } else if (role === 'seller') {
          res.redirect(`/seller/${userId}`);
        }
      } else {
        // Query validate errors
        let { errors } = req.query;
        if (errors) errors = errors.split(',');
  
        res.render('loginPage.ejs', { errors });
      }
      
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }

  static async postLogin(req, res) {
    try {
      const { email, password } = req.body;

      // Manual validation
      const errors = Controller.validateError(email, password);
      if (errors.length) throw { name: 'ValidationError', errors }

      const user = await User.findOne({
        where: {
          email: email
        }
      });

      // Check email isRegistered
      if (!user) throw { name: 'ValidationError', errors: `User with email ${email} is not registered yet!`};

      // Check hash password
      const isMatchingPassword = await bcrypt.compare(password, user.password);
      if (isMatchingPassword) {
        req.session.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        };

        // console.log(req.session);

        if (user.role === 'buyer') {
          res.redirect(`/buyer/${user.id}/upload`);
        } else if (user.role === 'seller') {
          res.redirect(`/seller/${user.id}`);
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



  // ============================== BUYER ==============================

  static async getUpload(req, res) {
    try {
      const { userId } = req.params;

      const username = req.session.user.username;
      const email = req.session.user.email;

      res.render('upload.ejs', { userId, username, email });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }

  static async postUpload(req, res) {
    try {
      // console.log(req.files);
      // res.send(req.file);
      const { userId } = req.params;

      let orderHistories = await Order.findAll({
        where: {
          UserId: +userId
        }
      });

      const orderNotPaid = orderHistories.filter(history => !history.paidStatus);
      if (orderNotPaid.length !== 0) {
        const errors = 'You still got unpaid order!';
        return res.redirect(`/buyer/${userId}/order?errors=${errors}`);
      }

      await Order.create({ fileName: req.file.originalname, filePath: req.file.path, UserId: +userId });

      res.redirect(`/buyer/${userId}/order`);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }

  static async buyerOrderHistory(req, res) {
    try {
      // const { userId } = req.params;
      const { search, errors } = req.query;

      const userId = req.session.user.id;
      const username = req.session.user.username;
      const email = req.session.user.email;

      const options = {
        include: {
          model: Material,
        },
        // where: {
        //   UserId: +userId
        // },
        order: [
          ['createdAt', 'DESC']
        ]
      };

      if (search) {
        options.where = {
          [Op.and]: [
            {
              UserId: +userId
            },
            {
              fileName: {
                [Op.iLike]: `%${search}%`
              }
            }
          ]
        };
      } else {
        options.where = {
            UserId: +userId
        };
      }

      const orders = await Order.findAll(options);

      // res.send(orders);

      res.render('orderHistory.ejs', { orders, userId, username, email, errors });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }

  static async getCancelOrder(req, res) {
    try {
      const { /*userId,*/ orderId } = req.params;

      const userId = req.session.user.id;
      const role = req.session.user.role;

      await Order.destroy({
        where: {
          id: +orderId
        }
      });

      if (role === 'buyer') {
        res.redirect(`/buyer/${userId}/order`);
      } else if (role === 'seller') {
        res.redirect(`/seller/${userId}`);
      }

    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }



  // ============================== SELLER ==============================

  static async getSellerPage(req, res) {
    try {
      // const { userId } = req.params;
      const userId = req.session.user.id;
      const username = req.session.user.username;
      const email = req.session.user.email;

      const { sort } = req.query;

      const options = {
        include: [{
          model: Material
        }, {
          model: User,
          include: Profile
        }]
      }

      if (sort) {
        if (sort === 'uploadedDate') {
          options.order = [
            ['createdAt', 'DESC']
          ];
        } else if (sort === 'notPaid') {
          options.where = {
            paidStatus: false
          }
        }
      } else {
        options.order = [
          ['createdAt', 'DESC']
        ];
      }

      const orders = await Order.findAll(options);

      // res.send(orders);

      res.render('sellerPage', { orders, userId, username, email });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }

  static async setToPaid(req, res) {
    try {
      const { userId, orderId } = req.params;

      await Order.update({
        paidStatus: true,
        paymentAt: new Date()
      }, {
        where: {
          id: +orderId
        }
      });

      res.redirect(`/seller/${userId}`);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }

  static async getSetPrice(req, res) {
    try {
      const { userId, orderId } = req.params;

      res.render('formSetPrice.ejs', { userId, orderId });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }

  static async postSetPrice(req, res) {
    try {
      const { userId, orderId } = req.params;
      const { pla, petg, tpu } = req.body;

      // ambil harga material dan hitung totalPrice
      const materials = await Material.findAll();

      let totalPrice = 0;

      totalPrice += +pla * materials.find(material => material.name === 'PLA').price;
      totalPrice += +petg * materials.find(material => material.name === 'PETG').price;
      totalPrice += +tpu * materials.find(material => material.name === 'TPU').price;

      // create data baru di OrderDetails
      if (pla) {
        const materialId = materials.find(material => material.name === 'PLA').id;
        await OrderDetail.create({OrderId: +orderId, MaterialId: +materialId, quantity: pla});
      }

      if (petg) {
        const materialId = materials.find(material => material.name === 'PETG').id;
        await OrderDetail.create({OrderId: +orderId, MaterialId: +materialId, quantity: petg});
      }

      if (tpu) {
        const materialId = materials.find(material => material.name === 'TPU').id;
        await OrderDetail.create({OrderId: +orderId, MaterialId: +materialId, quantity: tpu});
      }

      // update totalPrice di Orders
      await Order.update({
        totalPrice
      }, {
        where: {
          id: +orderId
        }
      });

      // res.send(materials)

      res.redirect(`/seller/${userId}`);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }



  // ============================== MISC ==============================

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

    if (!email) errors.push('Email is required.');
    if (!password) errors.push('Password is required.');

    return errors;
  }
}

module.exports = Controller;
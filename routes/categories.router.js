const express = require('express');

const CategoryService = require('./../services/category.service');
const validatorHandler = require('./../middlewares/validator.handler');
const { checkRoles } = require('./../middlewares/auth.handler');
const {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema,
} = require('./../schemas/category.schema');
const passport = require('passport');

const router = express.Router();
const service = new CategoryService();

router.get(
  '/',
  // este endpoint puede ser publico, eliminar estas 2 lineas, lo dejo asi por la practica de jwt
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'seller', 'customer'),
  //*********************************************************************************************
  async (req, res, next) => {
    try {
      const categories = await service.find();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  // este endpoint puede ser publico, eliminar estas 2 lineas, lo dejo asi por la practica de jwt
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'seller', 'customer'),
  //*********************************************************************************************
  validatorHandler(getCategorySchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await service.findOne(id);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  // valido si envio el token:
  passport.authenticate('jwt', { session: false }),
  // valido si es admin:
  checkRoles('admin'),
  // valido el schema del modelo
  validatorHandler(createCategorySchema, 'body'),
  // si pasa todos los middlewares puede crear la categoria:
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCategory = await service.create(body);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'seller'),
  validatorHandler(getCategorySchema, 'params'),
  validatorHandler(updateCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const category = await service.update(id, body);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'seller'),
  validatorHandler(getCategorySchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({ id });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

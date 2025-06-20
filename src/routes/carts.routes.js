// routes/carts.routes.js
import { Router } from 'express';
import passport from 'passport';
import { handlePolicies } from '../middlewares/handlePolicies.js';
import { validateRequest } from '../middlewares/validateRequest.middleware.js';
import { body } from 'express-validator';

import Cart from '../dao/models/cart.model.js';
import Product from '../dao/models/product.model.js';
import { TicketService } from '../services/ticket.service.js';

const router = Router();
const ticketService = new TicketService();

// POST /api/carts → crear un carrito nuevo vacío
router.post('/', async (req, res, next) => {
  try {
    const nuevoCarrito = await Cart.create({ products: [] });
    res.status(201).json({ status: 'success', cartId: nuevoCarrito._id });
  } catch (error) {
    next(error);
  }
});

// POST /api/carts/:cid/products/:pid → agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res, next) => {
  try {
    const carrito = await Cart.findById(req.params.cid);
    if (!carrito) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const producto = await Product.findById(req.params.pid);
    if (!producto) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

    const index = carrito.products.findIndex(p => p.product.equals(producto._id));
    if (index !== -1) {
      carrito.products[index].quantity += 1;
    } else {
      carrito.products.push({ product: producto._id, quantity: 1 });
    }

    await carrito.save();
    res.json({ status: 'success', message: 'Producto agregado al carrito' });
  } catch (error) {
    next(error);
  }
});

// GET /api/carts/:cid → mostrar carrito con productos populados
router.get('/:cid', async (req, res, next) => {
  try {
    const carrito = await Cart.findById(req.params.cid).populate('products.product').lean();
    if (!carrito) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    res.json({ status: 'success', cart: carrito });
  } catch (error) {
    next(error);
  }
});

// PUT /api/carts/:cid → reemplazar el arreglo de productos completo
router.put(
  '/:cid',
  body('*.product').isMongoId().withMessage('ID de producto inválido'),
  body('*.quantity').isInt({ min: 1 }).withMessage('Cantidad debe ser un número entero positivo'),
  validateRequest,
  async (req, res, next) => {
    try {
      const { cid } = req.params;
      const nuevosProductos = req.body;

      const carrito = await Cart.findById(cid);
      if (!carrito) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

      for (const item of nuevosProductos) {
        const existeProducto = await Product.findById(item.product);
        if (!existeProducto) {
          return res.status(400).json({ status: 'error', message: `Producto no encontrado: ${item.product}` });
        }
      }

      carrito.products = nuevosProductos;
      await carrito.save();

      res.json({ status: 'success', message: 'Carrito actualizado', cart: carrito });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/carts/:cid/products/:pid → actualizar cantidad de un producto
router.put(
  '/:cid/products/:pid',
  body('quantity').isInt({ min: 1 }).withMessage('Cantidad debe ser positiva'),
  validateRequest,
  async (req, res, next) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      const carrito = await Cart.findById(cid);
      if (!carrito) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

      const producto = await Product.findById(pid);
      if (!producto) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

      const index = carrito.products.findIndex(p => p.product.toString() === pid);
      if (index === -1) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
      }

      carrito.products[index].quantity = quantity;
      await carrito.save();

      res.json({ status: 'success', message: 'Cantidad actualizada', cart: carrito });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/carts/:cid/products/:pid → eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const carrito = await Cart.findById(cid);
    if (!carrito) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const index = carrito.products.findIndex(p => p.product.toString() === pid);
    if (index === -1) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
    }

    carrito.products.splice(index, 1);
    await carrito.save();

    res.json({ status: 'success', message: 'Producto eliminado del carrito' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/carts/:cid → vaciar el carrito completo
router.delete('/:cid', async (req, res, next) => {
  try {
    const { cid } = req.params;

    const carrito = await Cart.findById(cid);
    if (!carrito) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    carrito.products = [];
    await carrito.save();

    res.json({ status: 'success', message: 'Carrito vaciado correctamente' });
  } catch (error) {
    next(error);
  }
});

// POST /api/carts/:cid/purchase → Finaliza la compra y genera ticket
router.post(
  '/:cid/purchase',
  passport.authenticate('jwt', { session: false }),
  handlePolicies(['USER', 'ADMIN']),
  async (req, res, next) => {
    try {
      const { cid } = req.params;
      const user = req.user;

      const carrito = await Cart.findById(cid).populate('products.product');
      if (!carrito) {
        return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
      }

      const productosComprados = [];
      const productosSinStock = [];
      let total = 0;

      for (const item of carrito.products) {
        const producto = item.product;
        const cantidad = item.quantity;

        if (producto.stock >= cantidad) {
          producto.stock -= cantidad;
          await producto.save();

          productosComprados.push({
            product: producto._id,
            title: producto.title,
            quantity: cantidad,
            price: producto.price
          });

          total += cantidad * producto.price;
        } else {
          productosSinStock.push({
            product: producto._id,
            title: producto.title,
            stockDisponible: producto.stock,
            solicitado: cantidad
          });
        }
      }

      carrito.products = carrito.products.filter(item =>
        productosSinStock.some(p => p.product.toString() === item.product._id.toString())
      );
      await carrito.save();

      if (productosComprados.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'No se pudo procesar ningún producto por falta de stock',
          productosSinStock
        });
      }

      const ticket = await ticketService.generateTicket({
        amount: total,
        purchaser: user.email
      });

      res.json({
        status: 'success',
        message: 'Compra procesada',
        ticket,
        productosComprados,
        productosSinStock
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

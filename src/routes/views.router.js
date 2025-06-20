const router = require('express').Router();
const Product = require('../dao/models/product.model');
const Cart = require('../dao/models/cart.model'); // importante para la vista del carrito

// Vista paginada de productos
router.get('/products', async (req, res) => {
  try {
    const { limit = 5, page = 1, sort, query } = req.query;

    const filtro = query
      ? {
          $or: [
            { category: query },
            { status: query === 'true' || query === 'false' ? query === 'true' : undefined }
          ]
        }
      : {};

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined,
      lean: true
    };

    const result = await Product.paginate(filtro, options);

    res.render('products', {
      productos: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      nextPage: result.nextPage,
      prevPage: result.prevPage
    });
  } catch (error) {
    console.error("Error en vista /products:", error);
    res.status(500).send("Error al cargar productos");
  }
});

// Vista individual de producto
router.get('/products/:pid', async (req, res) => {
  try {
    const producto = await Product.findById(req.params.pid).lean();
    if (!producto) return res.status(404).send("Producto no encontrado");

    res.render('product', { producto });
  } catch (error) {
    console.error("Error en vista /products/:pid:", error);
    res.status(500).send("Error al cargar el producto");
  }
});

// Vista realtime con WebSocket
router.get('/realtimeproducts', (req, res) => {
  res.render('realtimeproducts');
});

// Vista visual del carrito con productos populados
router.get('/carts/:cid', async (req, res) => {
  try {
    const carrito = await Cart.findById(req.params.cid).populate('products.product').lean();
    if (!carrito) return res.status(404).send("Carrito no encontrado");

    res.render('cart', { cart: carrito });
  } catch (error) {
    console.error("Error al renderizar carrito:", error);
    res.status(500).send("Error al mostrar el carrito");
  }
});

module.exports = router;

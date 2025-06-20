<<<<<<< HEAD
import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { body, validationResult } from 'express-validator';
import passport from 'passport';

import Product from '../dao/models/product.model.js';
import { handlePolicies } from '../middlewares/handlePolicies.js';

const router = Router();

// Validadores
const productValidator = [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('description').notEmpty().withMessage('La descripción es obligatoria'),
    body('code').notEmpty().withMessage('El código es obligatorio'),
    body('price').isFloat({ gt: 0 }).withMessage('El precio debe ser un número positivo'),
    body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un entero no negativo'),
    body('category').notEmpty().withMessage('La categoría es obligatoria'),
];

// GET /api/products — Lista con filtros, orden y paginación
router.get('/', async (req, res, next) => {
    try {
=======
const router = require('express').Router();
const Product = require('../dao/models/product.model');

// GET /api/products — Lista todos los productos con paginación, orden y filtro
router.get('/', async (req, res) => {
try {
>>>>>>> c1fdd119acf1eb6af8d5df1c9c31bd005f963bc3
    const { limit = 10, page = 1, sort, query } = req.query;

    let filtro = {};
    if (query) {
<<<<<<< HEAD
        filtro = {
        $or: [
            { category: query },
            { status: query === 'true' ? true : query === 'false' ? false : undefined }
        ]
        };
    }

    const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined,
        lean: true
=======
    filtro = {
        $or: [
        { category: query },
        { status: query === 'true' ? true : query === 'false' ? false : undefined }
        ]
    };
    }

    const options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined,
    lean: true
>>>>>>> c1fdd119acf1eb6af8d5df1c9c31bd005f963bc3
    };

    const result = await Product.paginate(filtro, options);

    res.json({
<<<<<<< HEAD
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}` : null,
        nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}` : null
    });
    } catch (error) {
    next(error);
    }
});

// POST /api/products — Crear producto (solo ADMIN)
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    handlePolicies(['ADMIN']),
    productValidator,
    async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error', errors: errors.array() });
        }

        const { code } = req.body;
        const existente = await Product.findOne({ code });
        if (existente) {
        return res.status(400).json({ status: 'error', message: 'El código ya existe' });
        }

        const nuevoProducto = await Product.create(req.body);
        res.status(201).json({ status: 'success', producto: nuevoProducto });
    } catch (error) {
        next(error);
    }
    }
);

// GET /api/products/:pid — Obtener producto por ID
router.get('/:pid', async (req, res, next) => {
    try {
    const { pid } = req.params;

    if (!isValidObjectId(pid)) {
        return res.status(400).json({ status: 'error', message: 'ID no válido' });
    }

    const producto = await Product.findById(pid);
    if (!producto) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    res.json({ status: 'success', producto });
    } catch (error) {
    next(error);
    }
});

// PUT /api/products/:pid — Actualizar producto (solo ADMIN)
router.put(
    '/:pid',
    passport.authenticate('jwt', { session: false }),
    handlePolicies(['ADMIN']),
    productValidator,
    async (req, res, next) => {
    try {
        const { pid } = req.params;

        if (!isValidObjectId(pid)) {
        return res.status(400).json({ status: 'error', message: 'ID no válido' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error', errors: errors.array() });
        }

        const producto = await Product.findByIdAndUpdate(pid, req.body, { new: true });
        if (!producto) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        res.json({ status: 'success', message: 'Producto actualizado', producto });
    } catch (error) {
        next(error);
    }
    }
);

// DELETE /api/products/:pid — Eliminar producto (solo ADMIN)
router.delete(
    '/:pid',
    passport.authenticate('jwt', { session: false }),
    handlePolicies(['ADMIN']),
    async (req, res, next) => {
    try {
        const { pid } = req.params;

        if (!isValidObjectId(pid)) {
        return res.status(400).json({ status: 'error', message: 'ID no válido' });
        }

        const producto = await Product.findByIdAndDelete(pid);
        if (!producto) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        res.json({ status: 'success', message: 'Producto eliminado', productoEliminado: producto });
    } catch (error) {
        next(error);
    }
    }
);

export default router;
=======
    status: 'success',
    payload: result.docs,
    totalPages: result.totalPages,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage
        ? `/api/products?limit=${limit}&page=${result.prevPage}`
        : null,
    nextLink: result.hasNextPage
        ? `/api/products?limit=${limit}&page=${result.nextPage}`
        : null
    });
} catch (error) {
    console.error("Error en GET /api/products:", error);
    res.status(500).json({ status: 'error', message: error.message });
}
});

// POST /api/products — Agrega un producto con validación
router.post('/', async (req, res) => {
try {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ status: 'error', message: 'Campos obligatorios faltantes' });
    }

    const existente = await Product.findOne({ code });
    if (existente) {
    return res.status(400).json({ status: 'error', message: 'El código ya existe' });
    }

    const nuevoProducto = await Product.create({
    title, description, code, price, status, stock, category, thumbnails
    });

    res.status(201).json({ status: 'success', producto: nuevoProducto });
} catch (error) {
    console.error("Error en POST /api/products:", error);
    res.status(500).json({ status: 'error', message: error.message });
}
});

// GET /api/products/:pid — Obtener producto por ID
router.get('/:pid', async (req, res) => {
try {
    const producto = await Product.findById(req.params.pid);
    if (!producto) {
    return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    res.json({ status: 'success', producto });
} catch (error) {
    console.error("Error al obtener producto por ID:", error);
    res.status(500).json({ status: 'error', message: error.message });
}
});

// PUT /api/products/:pid — Modificar un producto existente
router.put('/:pid', async (req, res) => {
try {
    const { pid } = req.params;
    const updateData = req.body;

    const producto = await Product.findById(pid);
    if (!producto) {
    return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    const camposPermitidos = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];
    for (const campo in updateData) {
    if (camposPermitidos.includes(campo)) {
        producto[campo] = updateData[campo];
    }
    }

    await producto.save();
    res.json({ status: 'success', message: 'Producto actualizado', producto });
} catch (error) {
    console.error("Error al modificar producto:", error);
    res.status(500).json({ status: 'error', message: error.message });
}
});

// DELETE /api/products/:pid — Eliminar un producto
router.delete('/:pid', async (req, res) => {
try {
    const { pid } = req.params;

    const producto = await Product.findByIdAndDelete(pid);
    if (!producto) {
    return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    res.json({ status: 'success', message: 'Producto eliminado', productoEliminado: producto });
} catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ status: 'error', message: error.message });
}
});

module.exports = router;
>>>>>>> c1fdd119acf1eb6af8d5df1c9c31bd005f963bc3

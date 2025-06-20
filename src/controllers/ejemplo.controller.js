// src/controllers/ejemplo.controller.js

import { CustomError } from '../utils/CustomError.js';

export const ejemploController = async (req, res, next) => {
    try {
        if (!req.body.nombre) {
            throw new CustomError('El campo nombre es obligatorio', 400);
        }
        res.status(200).json({ mensaje: "Controlador funcionando" });
    } catch (error) {
        next(error);
    }
};

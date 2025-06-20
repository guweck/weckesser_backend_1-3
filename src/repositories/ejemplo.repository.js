// Repository Base
// Aquí se implementará la conexión entre Services y DAOs.

import { EjemploDAO } from '../daos/ejemplo.dao.js';

const ejemploDAO = new EjemploDAO();

export const ejemploRepository = {
    obtenerDatos: async () => {
        return await ejemploDAO.obtenerDatos();
    }
};

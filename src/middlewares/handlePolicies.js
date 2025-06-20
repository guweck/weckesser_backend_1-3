// src/middlewares/handlePolicies.js

export const handlePolicies = (policies = []) => {
    return (req, res, next) => {
    // Verificar si el usuario está autenticado
    if (!req.user) {
        return res.status(401).json({
        status: 'error',
        message: 'No autenticado',
        });
    }

    // Verificar si el rol del usuario está permitido
    if (!policies.includes(req.user.role)) {
        return res.status(403).json({
        status: 'error',
        message: 'No autorizado para este recurso',
        });
    }

    next();
    };
};

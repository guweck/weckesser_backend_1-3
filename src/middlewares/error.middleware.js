const errorMiddleware = (err, req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const status = err.status || 500;
    const message = err.message || 'Error interno del servidor';

  // Registro detallado en consola
    console.error('🛑 [ERROR DETECTADO]');
    console.error(`📅 Fecha: ${timestamp}`);
    console.error(`📍 Ruta: ${method} ${url}`);
    console.error(`🔢 Código HTTP: ${status}`);
    console.error(`📄 Mensaje: ${message}`);
    if (process.env.NODE_ENV === 'development') {
    console.error(`📚 Stack: ${err.stack}`);
    }

  // Respuesta estructurada
    res.status(status).json({
    status: 'error',
    timestamp,
    method,
    url,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorMiddleware;

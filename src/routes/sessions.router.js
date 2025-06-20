import { Router } from 'express';
<<<<<<< HEAD
import userModel from '../models/user.model.js';
import { createHash, isValidPassword, generateJWToken } from '../utils.js';
import passport from 'passport';

const router = Router();

// Registro de usuario
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/fail-register' }), async (req, res) => {
    try {
    const user = req.user;
    res.status(201).send({
        status: "success",
        message: `Usuario creado con éxito con ID: ${user._id}`
    });
    } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).send({ status: 'error', message: 'Error interno en el registro.' });
    }
});

// Login de usuario
router.post('/login', async (req, res) => {
    try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
        console.warn("Usuario no encontrado con email:", email);
        return res.status(404).send({ status: "error", message: "Usuario no encontrado." });
    }

    if (!isValidPassword(user, password)) {
        console.warn("Contraseña inválida para el usuario:", email);
        return res.status(401).send({ status: "error", message: "Credenciales inválidas." });
    }

    const tokenUser = {
        id: user._id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.role
    };

    const access_token = generateJWToken(tokenUser);

    res.cookie('jwtCookieToken', access_token, {
      maxAge: 60 * 60 * 1000, // 1 hora
        httpOnly: true
    });

    res.status(200).send({ status: "success", message: "Login exitoso" });
    } catch (error) {
    console.error('Error en login:', error);
    res.status(500).send({ status: "error", message: "Error en el servidor durante el login." });
    }
});

// Fallo en registro
router.get("/fail-register", (req, res) => {
    res.status(401).send({ status: "error", message: "Fallo al registrar el usuario." });
});

// Fallo en login
router.get("/fail-login", (req, res) => {
    res.status(401).send({ status: "error", message: "Fallo al iniciar sesión." });
});

export default router;
=======
import userModel from '../models/user.model.js'
import { createHash, isValidPassword, generateJWToken } from '../utils.js';
import passport from 'passport';




const router = Router();


// Register
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/fail-register' }), async (req, res) => {
    res.send({ status: "success", message: "Usuario creado con extito con ID: " });
})


// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        console.log("Usuario encontrado para login:");
        console.log(user);
        if (!user) {
            console.warn("User doesn't exists with username: " + email);
            return res.status(204).send({ error: "Not found", message: "Usuario no encontrado con username: " + email });
        }

        if (!isValidPassword(user, password)) {
            console.warn("Invalid credentials for user: " + email);
            return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
        }

        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        };
        const access_token = generateJWToken(tokenUser);
        console.log(access_token);


        // Creamos la cookie y almacenamos el access_token en la cookie
        res.cookie('jwtCookieToken', access_token, {
            maxAge: 60000,
            httpOnly: true //No se expone la cookie
            // httpOnly: false //Si se expone la cookie
        })

        res.send({ status: "Login success" });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})


router.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
});

router.get("/fail-login", (req, res) => {
    res.status(401).send({ error: "Failed to process login!" });
});

export default router;
>>>>>>> c1fdd119acf1eb6af8d5df1c9c31bd005f963bc3

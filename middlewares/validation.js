const { check, validationResult } = require('express-validator');

// Función para detectar caracteres sospechosos de inyección SQL
const detectSQLInjection = (value) => {
    const sqlInjectionPattern = /['";\-]/;
    if (sqlInjectionPattern.test(value)) {
        throw new Error('El valor contiene caracteres sospechosos de inyección SQL');
    }
    return true;
};

const isUCM_Email = (value) => {
    if(!value.endsWith('@ucm.es'))
        throw new Error('El correo dene ser de la complutense: @ucm.es')

    return true;
}

// Middleware de validación para usuario
const validateUserRegister = [
    check('nombre')
        .notEmpty().withMessage('Nombre es requerido')
        .isString().withMessage('Nombre debe ser un texto')
        .custom(detectSQLInjection),

    check('apellidos')
        .notEmpty().withMessage('Apellidos es requerido')
        .isString().withMessage('Apellidos deben ser un texto')
        .custom(detectSQLInjection),

    check('correo')
        .notEmpty().withMessage('Email es requerido')
        .isEmail().withMessage('Email no tiene el formato correcto')
        .custom(isUCM_Email)
        .custom(detectSQLInjection),

    check('telefono')
        .notEmpty().withMessage('Teléfono es requerido')
        .isLength({ min: 9 }).withMessage('Teléfono debe tener al menos 9 caracteres')
        .custom(detectSQLInjection),

    check('facultad')
        .notEmpty().withMessage('Facultad es requerida'),

    check('user')
        .notEmpty().withMessage('Rol es requerido')
        //.isIn(['asistente', 'organizador']).withMessage('Rol debe ser participante u organizador')
        .custom(detectSQLInjection),

    check('username')
        .notEmpty().withMessage('username es requerido')
        .isString().withMessage('username debe ser un texto (puede contener todo tipo de caracteres)') ,

    check('password')
        .isLength({ min: 8 }).withMessage('Contraseña debe tener al menos 8 caracteres')
        .custom(detectSQLInjection)
];

// Middleware de validación para login
const validateLogIn = [
    check('correo')
        .notEmpty().withMessage('Email es requerido')
        .isEmail().withMessage('Email no tiene el formato correcto')
        .custom(isUCM_Email)
        .custom(detectSQLInjection),

    check('password')
        .notEmpty().withMessage('Contraseña es requerida')
        .custom(detectSQLInjection)
];

// Middleware general para manejar resultados de validación
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Transformar los errores en una cadena más legible
        const errorMessages = errors.array().map(err => err.msg).join(', ');
        const sqlInjectionError = errors.array().some(err => err.msg.includes('inyección SQL'));
        if (sqlInjectionError) {
            const error = new Error('Error de validación: posible intento de inyección SQL');
            error.status = 405;
            return next(error);
        }
        return res.status(400).json({ success: false, message: errorMessages });
    }
    next();
};

module.exports = {
    validateLogIn: [...validateLogIn, validate],
    validateUser: [...validateUserRegister, validate]
};
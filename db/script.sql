CREATE TABLE Facultades (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nombre VARCHAR(100)
);

CREATE TABLE Usuarios (
	id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    telefono VARCHAR(15),
    correo VARCHAR(30) 	UNIQUE NOT NULL,
    rol ENUM('organizador', 'asistente') NOT NULL,
    id_facultad INT,
    username VARCHAR(50) UNIQUE NOT NULL;
    contrasena VARCHAR(255) NOT NULL DEFAULT 'default_password';
    FOREIGN KEY (id_facultad) REFERENCES Facultades(id)
);

CREATE TABLE Eventos (
	id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL, 
    ubicacion VARCHAR(100),
    capacidad_max INT NOT NULL,
    id_organizador INT,
    FOREIGN KEY (id_organizador) REFERENCES Usuarios(id)
);

CREATE TABLE Inscripciones(
	id_usuario INT,
	id_evento INT,
	fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	estado ENUM('inscrito', 'en lista de espera') NOT NULL,
	PRIMARY KEY (id_usuario, id_evento),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id),
    FOREIGN KEY (id_evento) REFERENCES Eventos(id)
);

CREATE TABLE Configuracion_Accesibilidad (
	id_usuario INT PRIMARY KEY,
    paleta_colores ENUM('claro', 'predeterminado', 'oscuro') NOT NULL,
    tamaño_texto ENUM('pequeño', 'mediano', 'grande') NOT NULL,
	configuracion_navegacion VARCHAR(50),
	FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
);

----------------------------------------------------------------------------------------

-- Inserciones en la tabla Facultades
INSERT INTO Facultades (nombre) VALUES 
('Facultad de Informatica'),
('Facultad de Matematicas'),
('Facultad de Arquitectura'),
('Facultad de Derecho'),
('Facultad de Medicina');

-- Inserciones en la tabla Usuarios
INSERT INTO Usuarios (nombre, correo, telefono, id_facultad, rol, username) VALUES 
('Mario Campos', 'mariocam@ucm.es', '123456789', 1, 'organizador', 'mariete248'),
('Elisa Campos', 'elisacam@ucm.es', '987654321', 2, 'asistente', 'midgetelisa'),
('Cristina Zuazu', 'criszuazu@ucm.es', '456789123', 3, 'organizador', 'criszuu03'),
('Ivan Jimenez', 'ivansueiro@ucm.es', '321654987', 4, 'asistente', 'ivansito'),
('Alvaro Elizalde', 'alvelizal@ucm.es', '654123987', 5, 'asistente', 'clavoman');

-- Inserciones en la tabla Eventos
INSERT INTO Eventos (titulo, descripcion, fecha, hora, ubicacion, capacidad_maxima, organizador_id) VALUES 
('Conferencia de Tecnología', 'Evento sobre los avances tecnológicos', '2024-11-15', '09:00:00', 'Aula Magna', 100, 1),
('Taller de Ciencia', 'Exploración de ciencias experimentales', '2024-11-20', '10:30:00', 'Laboratorio 1', 50, 3),
('Concierto de Artes', 'Presentación de música clásica', '2024-11-25', '18:00:00', 'Teatro Principal', 200, 3),
('Fiesta de la Cerveza', 'Fiesta de la Cerveza con colegas', '2024-12-01', '12:00:00', 'Salón de Conferencias', 80, 1),
('Internet de las Cosas', 'Innovaciones en salud y medicina', '2024-12-05', '08:30:00', 'Auditorio Central', 150, 1);

-- Inserciones en la tabla Inscripciones
INSERT INTO Inscripciones (usuario_id, evento_id, estado, fecha) VALUES 
(2, 1, 'inscrito', '2024-11-01 08:00:00'),
(4, 2, 'inscrito', '2024-11-02 10:00:00'),
(2, 3, 'inscrito', '2024-11-03 12:30:00'),
(1, 4, 'inscrito', '2024-11-04 09:45:00'),
(5, 5, 'inscrito', '2024-11-05 11:00:00');

-- Inserciones en la tabla Configuracion_Accesibilidad
INSERT INTO Configuracion_Accesibilidad (id_usuario, paleta_colores, tamaño_texto, configuracion_navegacion) VALUES 
(1, 'predeterminado', 'pequeño', 'estándar'),
(2, 'predeterminado', 'pequeño', 'estándar'),
(3, 'predeterminado', 'pequeño', 'estándar'),
(4, 'claro', 'mediano', 'estándar'),
(5, 'oscuro', 'grande', 'teclado');



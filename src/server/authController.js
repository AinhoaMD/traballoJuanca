import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const { dni, password } = req.body;

    try {
        // Buscar usuario en JSON Server
        const response = await axios.get(`https://localhost:3000/clientes?dni=${dni}`);
        const user = response.data[0];

        if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

        // Importante: bcrypt.compare() compara la contraseña con el hash almacenado. Devuelve true si coinciden.
        // compare transforma la contraseña en hash y la compara con el hash almacenado
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(400).json({ message: 'Usuario o Contraseña incorrecta' });

        const token = jwt.sign(
            {
                dni: user.dni,
                tipo: user.tipo || 'user'
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({ token, nombre: user.nombre, tipo: user.tipo || 'user' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error interno de servidor' });
    }
};
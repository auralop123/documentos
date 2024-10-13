const express = require('express')
const app = express()
const port = 3000
// Get the client
const mysql = require('mysql2/promise');
const cors = require('cors')
const session = require('express-session')
const md5 = require('md5');

app.use(cors({
    origin: 'http://localhost:5173',
        credentials: true
}))
app.use(session({
    secret: 'aljdlkfajlkfdajfasdlkf'
}))

// Create the connection to database
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'login',
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/login', async (req, res) => { //req = request, peticion; res = response, respuesta
    const datos = req.query;
    // A simple SELECT query
    try {
        const [results, fields] = await connection.query(
   "SELECT * FROM `usuarios` WHERE `usuario` = ? AND `clave` = ?",
        [datos.usuario, md5(datos.clave)]
 );
 console.log(md5(datos.clave))
if (results.length > 0) {
    req.session.usuario = datos.usuario;
    res.status(200).send('Inicio de sesión correcto')
} else {
    res.status(401).send('Datos incorrectos')
}

console.log(results); // results contains rows returned by server
console.log(fields); // fields contains extra meta data about results, if available
} catch (err) {
    console.log(err);
    res.status(500).send('Error en el servidor')
}

})
app.get('/validar', (req, res) => {
    if (req.session.usuario) {
        res.status(200).send ('Sesión validada')
    } else{
    res.status(401).send ('No autorizado')
}
})


app.get('/registro', async (req, res) => { //req = request, peticion; res = response, respuesta
    if (!req.session.usuario) {
        res.status(401).send ('No autorizado')
        return
    } 
    const datos = req.query;
    // A simple SELECT query
    try {
        const [results, fields] = await connection.query(
   "INSERT INTO `usuarios` (`id`, `usuario`, `clave`) VALUES (NULL, ?, ?);",
        [datos.usuario, md5(datos.clave)]
 );
if (results.affectedRows > 0) {
    req.session.usuario = datos.usuario;
    res.status(200).send('Registro correcto')
} else {
    res.status(401).send('No se pudo registrar')
}

console.log(results); // results contains rows returned by server
console.log(fields); // fields contains extra meta data about results, if available
} catch (err) {
    console.log(err);
    res.status(500).send('Error en el servidor')
}
})


app.get('/usuarios', async (req, res) => { //req = request, peticion; res = response, respuesta
    if (!req.session.usuario) {
        res.status(401).send ('No autorizado')
        return
    } // A simple SELECT query
    try {
        const [results, fields] = await connection.query(
   "SELECT * FROM `usuarios`"
 );
res.status(200).json(results)

console.log(results); // results contains rows returned by server
console.log(fields); // fields contains extra meta data about results, if available
} catch (err) {
    console.log(err);
    res.status(500).send('Error en el servidor')
}
})

app.delete('/usuarios', async (req, res) => { //req = request, peticion; res = response, respuesta
    if (!req.session.usuario) {
        res.status(401).send ('No autorizado')
        return
    }
    const datos = req.query;
     // A simple SELECT query
    try {
        const [results, fields] = await connection.query(
   "DELETE FROM usuarios WHERE `usuarios`.`id` = ?",
   [datos.id]
 );
 if (results.affectedRows > 0) {
    res.status(200).send('Usuario eliminado')
} else {
    res.status(401).send('No se pudo eliminar')
}

console.log(results); // results contains rows returned by server
console.log(fields); // fields contains extra meta data about results, if available
} catch (err) {
    console.log(err);
    res.status(500).send('Error en el servidor')
}
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

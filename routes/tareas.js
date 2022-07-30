const express = require('express');
const TareasController = require('../controllers/TareasController');

const router = express.Router();

router.get('/register',TareasController.register);
router.get('/logout',TareasController.logout);
router.post('/register',TareasController.storeUser);
router.get('/tareas', TareasController.index);
router.get('/tareas/detalle/:id', TareasController.detalleTareas);
router.post('/tareas', TareasController.auth);
router.get('/create', TareasController.create);
router.post('/create', TareasController.store);
router.delete('/tareas/delete/:id', function(req, res){
    const id = req.params.id
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM tareas WHERE id = ?', [id], (err, rows) => {
            res.status(200).send({ code: '123' });
        });
      })
  });

router.put('/tareas/update/:id', function(req, res){
    const body = req.body;
    const id = req.body.id;
    console.log(body);
    req.getConnection((err, conn) => {
        conn.query('UPDATE tareas SET ? WHERE id = ?', [body, id], (err, rows) => {
            console.log(rows);
            res.status(200).send({ code: '123' });
        });
      })
});

router.get('/tareas/edit/:id', TareasController.edit);


module.exports = router;
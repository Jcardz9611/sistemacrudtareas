const bcrypt = require('bcrypt');



function index(req, res) {

    
    if (req.session.loggedin) {
          // Output username
          req.getConnection((err, conn) => {
            conn.query('SELECT * FROM tareas', (err, tareas) => {
              if(err) {
                res.json(err);
              }
              let name = req.session.name;
              res.render('tareas/index', { tareas,name });
            });
          });
    } else {
      res.render('login/index');
    }
  }
  
  function register(req, res) {
    res.render('login/register');
  }

  function storeUser(req,res){
     
      const data = req.body;
      bcrypt.hash(data.password,12).then(hash =>{
          data.password = hash;
          req.getConnection((err,conn) =>{
              conn.query('INSERT INTO users SET ?',[data],(err,rows) =>{
                  res.redirect('/');
              });
          });
      });
     
  }
  
  function auth(req, res) {
     const data = req.body;
     
     req.getConnection((err,conn) =>{
         conn.query('SELECT * FROM users WHERE email = ?',[data.email],(err,userdata) =>{
             if(userdata.length>0){
                 userdata.forEach(element => {
                    bcrypt.compare(data.password, element.password, (err, isMatch) => {
                     
                        if(!isMatch){
                           res.render('login/index',{error: 'Error: La contraseña es incorrecta'}); 
                        }else{
                            req.session.loggedin = true;
                            req.session.name = element.name;

                            res.redirect('/');
                        }
                    });
                     
                 });
                
             }else{
                console.log("el usuario no existe");
                res.render('login/index', {error: 'Error: El usuario no existe'});
             }
         });
     });
    
  }
  
  function logout(req, res) {
    if (req.session.loggedin == true) {
      req.session.destroy();
    }
      res.redirect('/tareas');
    
  }
  
  function create(req, res) {
    if (req.session.loggedin) {
     let name = req.session.name;
     res.render('tareas/create', { name });
    }else {
        res.render('login/index');
    }
  }
  
  function store(req, res) {
     
    const data = req.body;
  
    req.getConnection((err, conn) => {
      conn.query('INSERT INTO tareas SET ?', [data], (err, rows) => {
        res.redirect('/tareas');
      });
    });
  }
  
  
  
  function edit(req, res) {
        if (req.session.loggedin) {
                let name = req.session.name;
                const id = req.params.id;
                req.getConnection((err, conn) => {
                conn.query('SELECT * FROM tareas WHERE id = ?', [id], (err, tareas) => {
                    if(err) {
                    res.json(err);
                    }
                    let asignado = false;
                    let enCurso = false;
                    let terminado = false;
                    if(tareas[0].estatus==1){
                        asignado = true;
                    }else if(tareas[0].estatus==2){
                        enCurso = true;
                    }else if(tareas[0].estatus==3){
                        terminado = true;
                    }
                    console.log(asignado);
                        var d = new Date(tareas[0].fecha_entrega),
                        month = '' + (d.getMonth() + 1),
                        day = '' + d.getDate(),
                        year = d.getFullYear();
            
                        if (month.length < 2) 
                            month = '0' + month;
                        if (day.length < 2) 
                            day = '0' + day;
                        var date = [year, month, day].join('-');
                        console.log(date);
                    res.render('tareas/edit', { name,tareas,asignado,enCurso,terminado,date });
                });
            });
        }
  }

  function detalleTareas(req, res) {
    if (req.session.loggedin) {
        let name = req.session.name;
        const id = req.params.id;
        req.getConnection((err, conn) => {
        conn.query('SELECT * FROM tareas WHERE id = ?', [id], (err, tareas) => {
            if(err) {
            res.json(err);
            }
            var d = new Date(tareas[0].fecha_entrega),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;
            var date = [year, month, day].join('-');
            console.log(date);
            res.render('tareas/detalle', { tareas,name,date });
        });
        });
    }else {
        res.render('login/index');
    }
  }
  
  function update(req, res) {
    const id = req.params.id;
    const data = req.body;
  
    req.getConnection((err, conn) => {
      conn.query('UPDATE tareas SET ? WHERE id = ?', [data, id], (err, rows) => {
        res.redirect('/tareas');
      });
    });
  }
  
  
  module.exports = {
    register: register,
    storeUser,
    auth,
    logout,
    index: index,
    create: create,
    store: store,
    edit: edit,
    update: update,
    detalleTareas:detalleTareas,
  }

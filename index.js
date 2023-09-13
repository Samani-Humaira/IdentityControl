const express = require('express');
const app = express()
const sql = require('mysql2');
const { faker } = require('@faker-js/faker');
const path = require('path');
const methodOverride = require('method-override');
app.use(methodOverride("_method"));
const { v4: uuidv4 } = require("uuid");


app.set("view engine","ejs");
app.set("views",(path.join(__dirname,"/views")));


app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

const connection = sql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'studinfo',
    password:'SS21CO044'
});

let randomUser = ()=>{
    return[
        faker.string.uuid(),
        faker.internet.userName(),   
          faker.internet.email(),
       faker.internet.password()
    ];
}

// let data = [];
// for(let i=0;i<=50;i++){
//    let user = randomUser();  //to generate data for the table
//    data.push(user);
// }
// let q = `insert into student (id,username,email,password) values ?`;

// try{
//     connection.query(q,[data],(err,result) =>{
//         if(err) throw err;
//         console.log("Successfully added data into a databases");
//     });
// }
// catch(err){
//     console.log("Error occured");
// }

//show No. of users
app.get("/",(req,res) =>{
  let q = `select count (*) from student`;
  try{
    connection.query(q,(err,result) =>{
        if(err) throw err;
        let userCount = result[0]['count (*)'];
        res.render("count",{userCount});  
    });
 }catch(err){
    cconsole.log(err);
 }
});

//show all users information

app.get("/user",(req,res) =>{
    let q = `Select * from student`;
    try{
        connection.query(q,(err,result) =>{
            if(err) throw err;
            let user = result;
            // console.log(result[0]);
            res.render("user",{user});
        });
    }catch(err){
        console.log("Hello err occured",err);
    }
});


//edit users information if ppassword is correct

app.get("/user/:id/edit",(req,res) =>{
    let {id} = req.params;
    let q = `select * from student where id = '${id}'`;
    connection.query(q,(err,result) =>{
        try{ 
            if(err) throw err;
            let user = result[0];
            res.render("edit",{user});
        }catch(err){
       console.log(err);
        }
    });
});

//patch method to edit
app.patch("/user/:id",(req,res) =>{
  let {username,password} = req.body;
  let {id} = req.params;
  let q = `select * from student where id = '${id}'`;
  try{
    connection.query(q,(err,result) =>{
        if(err) throw err;
        let user = result[0];
        if(password !== user.password){
            res.send("Wrong password");
        }else{
            let q2 = `update student set username = '${username}' where password = '${password}'`;
            connection.query(q2,(err,result) =>{
                if (err)throw err;
                else{

                    console.log("Updated Successfully");
                    res.redirect("/user");
                }
               
            });
        }
    });
  }catch(err){
    console.log(err);
  }
});

//delete a user 
app.get("/user/:id/delete",(req,res) =>{
    let {id}= req.params ;  
    let q = `select * from student where id = '${id}'`;
    try{
        connection.query(q,(err,result) =>{
            if(err) throw err;
            let user = result[0];
            res.render("delete",{user});
        });
    }catch(err){
        console.log(err);
    }
});

//delete request
app.delete("/user/:id",(req,res) =>{
    let {email,password} = req.body;
    let {id} =req.params;
    let q = `select * from student where id = '${id}'`;
connection.query(q,(err,result) =>{
    if(err) throw err;
    let user= result[0]   //getting the data of that particular row which is deleted
    if(email !=user.email && password !=user.password){
        res.send("Wrong email and password Please enter a correct password");  
    }
    else{
        let q2 = `Delete from student where id = '${id}'`;
        connection.query(q2,(err,result)=>{
            console.log('Deleted');
            res.redirect("/user");
        })
    }
});
});


//adding new user
app.get("/user/new",(req,res) =>{
    res.render("new");
});

app.post("/user/new",(req,res) =>{
    let {username ,email,password} = req.body;
    let id= uuidv4();
    let q = `insert into student (id,username,email,password) values ('${id}','${username}','${email}','${password}')`;
 try{
    connection.query(q,(err,result) =>{
        if(err) throw err;
        console.log("Successfully added a new entry");
        res.redirect("/user");
        
    });
 }catch(err){
    res.send("noting to add");
 }
});

app.listen("3000",(req,res) =>{
    console.log("Hii i am listening to port 3000");
});


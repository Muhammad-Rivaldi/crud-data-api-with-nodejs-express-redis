// console.log('port berhasil dijalankan');

const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');
const app = express();

app.use(express.json()); //-> menangkap request body
const client = redis.createClient();

// ROUTE //

// get all data
app.get('/allDataUser', function(req, res){
    key = 'siswa'

    client.get(key, async function(err, obj){
        data = JSON.parse(obj)

        res.send(data)
    });
});

// get berdasarkan id di redis
app.get('/dataUser/:id', function(req, res){
    let {id} = req.params

    client.get('siswa', function(err, obj){
        // Convert to String
        data = JSON.parse(obj)

        for(var i=0; i < Object.keys(data).length; i++) {
            if (data[i].id == id) {
                res.send(data[i])
            }
            // else{
            //     console.log('User Not Found!')
            // }
        }
    })
})

// tambah data di redis
app.post('/insertUser', function(req,res){
    let key = 'siswa'
    let {id} = req.body
    let {nama} = req.body
    let {usia} = req.body

    let old = []

    client.get(key, async function(err, obj){

        let data = await JSON.parse(obj)
        // console.log(data)

        if(!data) {
            // kalo data lama gak ada jangan jalanin else
        }else {
            // Masukin data lama ke variable old
            old = data
        }

        let newData = {
            'id': id,
            'nama': nama,
            'usia': usia,
        }
        
        // Push data baru ke data yang sudah ada
        old.push(newData)

        // Convert Json to String
        let jsonToStr = JSON.stringify(old)

        client.set(key, jsonToStr, function(err, reply){
            if(err) {
                console.log(err)
            }
            console.log(reply)

            res.send(`Add OK`)
        })
    })
})

// update data di redis
app.post('/updateUser/:param', function(req,res){
    let key = 'siswa'
    let {param} = req.params
    let {id} = req.body
    let {nama} = req.body
    let {usia} = req.body

    client.get(key, async function(err, obj){

        let data = await JSON.parse(obj)
        // console.log(data)

        for(var i=0; i<Object.keys(data).length; i++) {
            if (data[i].id == param) {

                // Override data lama dengan data update
                data[i].id = id
                data[i].nama = nama
                data[i].usia = usia
            }
            else{
                // console.log(data[i].name)
                // console.log('User Not Found!')
            }
        }

        // Convert Json to String
        let jsonToStr = JSON.stringify(data)

        client.set(key, jsonToStr, function(err, reply){
            if(err) {
                console.log(err)
            }
            console.log(reply)

            res.send(`Add OK`)
        })
    })
})

// delete data di redis
app.delete('/deleteUser/:id', function(req,res) {
    let key = 'siswa'
    let {id} = req.params

    client.get(key, async function(err, obj){
        let data = await JSON.parse(obj)

        for(var i = 0; i < Object.keys(data).length; i++) {
            if (data[i].id == id) {
                data.splice([i], 1)
                // console.log(data)
            }
        }

        // Convert JSON to String
        let jsonToStr = JSON.stringify(data)

        client.set(key, jsonToStr, function(err, reply){
            if(err) {
                console.log(err)
            }
            console.log(reply)

            res.send(`Delete OK`)
        })
    })
})

// END ROUTE //

// port
app.listen(9000, () => console.log('listening pn port 9000'));



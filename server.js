const express = require('express');
const app = express();
const path= require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var methodOverride = require('method-override');
var jwt = require('jsonwebtoken'); //no use
var ip = require('ip');
var cluster = require('cluster');
var numCPUs= require('os').cpus().length;
app.use(express.static(__dirname + '/dist'));
app.set('port', (process.env.PORT || 7500));

app.get('/*',(req,res)=>{
    res.sendFile(path.join(__dirname + '/dist/index.html'));
})

if(cluster.isMaster){
    for(var i=0; i < numCPUs;i++){
        cluster.fork();
        cluster.on('exit', function(worker, code, signal)
        {
          console.log('worker ' + worker.process.pid + ' died');
        });
    }
}else{
    app.listen(app.get('port'), () => {
        console.log('app running port ', app.get('port'), 'IP:', ip.address());
    })
}

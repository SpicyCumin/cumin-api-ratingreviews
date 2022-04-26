const cluster = require('cluster');
const http = require('http');
const app = require('./app')
const PORT = process.env.PORT || 3000;


process.stdout.on('error', function( err ) {
  if (err.code == "EPIPE") {
      process.exit(0);
  }
})

const workers = [];


const setupWorkerProcesses = () => {
    // to read number of cores on system
  const numCores = require('os').cpus().length;
  console.log('Master cluster setting up ' + numCores + ' workers');
  let core = 0;
  while (numCores > core) {
      workers.push(cluster.fork());
      workers[core].on('message', (message) => {
        console.log(message);
    });
    core++
  }



  cluster.on('online', (worker) => {
      console.log('Worker ' + worker.process.pid + ' is listening');
  });


  cluster.on('exit', (worker, code, signal) => {
      console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
      console.log('Starting a new worker');
      workers.push(cluster.fork());
      // to receive messages from worker process
      workers[workers.length-1].on('message', (message) => {
          console.log(message);
      });
  });
}





const setUpExpress = () => {

  app.server = http.createServer(app.callback());

  app.server.listen(PORT, () => {
      console.log(`Started server on => http://localhost:${PORT} for Process Id ${process.pid}`);
  });

  app.on('error', (appErr, appCtx) => {
      console.error('app error', appErr.stack);
      console.error('on url', appCtx.req.url);
      console.error('with headers', appCtx.req.headers);
  });
};


const setupServer = (isClusterRequired) => {

  if(isClusterRequired && cluster.isMaster) {
      setupWorkerProcesses();
  } else {
      setUpExpress();
  }
};

setupServer(true);
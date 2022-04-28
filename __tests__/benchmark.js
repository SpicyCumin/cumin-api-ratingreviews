const autocannon = require('autocannon')
const { PassThrough } = require('stream')


const max = 241639
function genRandNum() {
  return Math.round(Math.random() * max)
}



function run (url) {
  const buf = []
  const outputStream = new PassThrough()

  const inst = autocannon({
    url,
    connections: 120,
    duration: 30,
    method: 'GET',

  })

  autocannon.track(inst, { outputStream })

  outputStream.on('data', data => buf.push(data))
  inst.on('done', function () {
    process.stdout.write(Buffer.concat(buf))
  })
}

console.log('Running all benchmarks in parallel ...')

// const endpointId = genRandNum()
const endpointId = 242069

run( `http://localhost:3000/product?product_id=${endpointId}` )
// run( `http://localhost:3000/metas?product_id=${endpointId}` )
// run( `http://localhost:3000/product?product_id=${endpointId}` )
// run( `http://localhost:3000/product?product_id=${endpointId}` )


import http from 'http'
import https from 'https'

const PORT = 3001

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Auth-PSK, SOAPACTION')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  // Extract target TV IP from query params or header
  const url = new URL(req.url, `http://localhost:${PORT}`)
  const tvIp = url.searchParams.get('tv') || req.headers['x-tv-ip']

  if (!tvIp) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Missing TV IP address' }))
    return
  }

  // Forward request to TV
  let body = ''
  req.on('data', chunk => body += chunk)
  req.on('end', () => {
    const path = url.pathname
    const options = {
      hostname: tvIp,
      port: 80,
      path: path,
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'X-Auth-PSK': req.headers['x-auth-psk'] || '',
      }
    }

    if (req.headers['soapaction']) {
      options.headers['SOAPACTION'] = req.headers['soapaction']
    }

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers)
      proxyRes.pipe(res)
    })

    proxyReq.on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Proxy error', details: err.message }))
    })

    proxyReq.write(body)
    proxyReq.end()
  })
})

server.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`)
})

const next = require('next')
const jsonServer = require('json-server')
const express = require('express')
// const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
// const path = require('path')
const { parse } = require('url')

require('dotenv').load()

process.on('uncaughtException', function (err) {
  console.error('Uncaught Exception: ', err)
})

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection: Promise:', p, 'Reason:', reason)
})

// Default when run with `npm start` is 'production' and default port is '80'
// `npm run dev` defaults mode to 'development' & port to '3000'
process.env.NODE_ENV = process.env.NODE_ENV || 'production'
process.env.PORT = process.env.PORT || 80

const router = jsonServer.router('db.json')

// Initialize Next.js
const app = next({
  dir: '.',
  dev: (process.env.NODE_ENV === 'development')
})

app.prepare().then(() => {
  const server = express()
  // server.use(cookieParser())
  const middlewares = [
    bodyParser.urlencoded(),
    bodyParser.json() 

    //cookieParser('sesh-dash'),
    //csrfProtection
  ] 
  server.use(middlewares)

  // Use default router
  server.use('/api', router)

  server.get('/reset', (req, res) => {
    const actualPage = '/resetPassword'
    return app.render(req, res, actualPage)
  })
  server.get('/change/:id/:email', (req, res) => {
    const actualPage = '/changePassword'
    const queryParams = { id: req.params.id, email: req.params.email }
    return app.render(req, res, actualPage, queryParams)
  })

  // PROFILE
  server.get('/change-profile-password', (req, res) => {
    const actualPage = '/profile/changeProfilePassword'
    return app.render(req, res, actualPage)
  })
  server.get('/edit-profile', (req, res) => {
    const actualPage = '/profile/editProfile'
    return app.render(req, res, actualPage)
  })

  // ROUTE AUGMENTED REALITY
  server.get('/register-factory', (req, res) => {
    const actualPage = '/augmentedReality/registerFactory'
    return app.render(req, res, actualPage)
  })
  server.get('/register-factory/detail/:id/:slug', (req, res) => {
    const actualPage = '/augmentedReality/registerFactoryDetail'
    const queryParams = { id: req.params.id }
    return app.render(req, res, actualPage, queryParams)
  })
  server.get('/view-gallery', (req, res) => {
    const actualPage = '/augmentedReality/viewGallery'
    return app.render(req, res, actualPage)
  })
  server.get('/taman-herbal-plant', (req, res) => {
    const actualPage = '/augmentedReality/tamanHerbalTanaman'
    return app.render(req, res, actualPage)
  })
  server.get('/taman-herbal-hero', (req, res) => {
    const actualPage = '/augmentedReality/tamanHerbalHero'
    return app.render(req, res, actualPage)
  })

  // ROUTE USER MANAGEMENT
  server.get('/customer', (req, res) => {
    const actualPage = '/userManagement/customer'
    return app.render(req, res, actualPage)
  })
  server.get('/administrator', (req, res) => {
    const actualPage = '/userManagement/administrator'
    return app.render(req, res, actualPage)
  })
  // server.get('/role', (req, res) => {
  //   const actualPage = '/userManagement/roles'
  //   return app.render(req, res, actualPage)
  // })

  // ROUTE GENERAL SETTING
  server.get('/term-and-condition', (req, res) => {
    const actualPage = '/generalSetting/termCondition'
    return app.render(req, res, actualPage)
  })
  server.get('/main-banner', (req, res) => {
    const actualPage = '/generalSetting/mainBanner'
    return app.render(req, res, actualPage)
  })
  server.get('/campaign-banner', (req, res) => {
    const actualPage = '/generalSetting/campaignBanner'
    return app.render(req, res, actualPage)
  })
  server.get('/faq', (req, res) => {
    const actualPage = '/generalSetting/faq'
    return app.render(req, res, actualPage)
  })


  // ROUTE LOCATIONS
  server.get('/setup-location', (req, res) => {
    const actualPage = '/locations/locationMaster'
    return app.render(req, res, actualPage)
  })

  // ROUTE MASTER DATA
  server.get('/master-product', (req, res) => {
    const actualPage = '/masterData/product'
    return app.render(req, res, actualPage)
  })
  server.get('/master-food', (req, res) => {
    const actualPage = '/masterData/food'
    return app.render(req, res, actualPage)
  })
  server.get('/master-package', (req, res) => {
    const actualPage = '/masterData/package'
    return app.render(req, res, actualPage)
  })
  server.get('/master-schedule', (req, res) => {
    const actualPage = '/masterData/schedule'
    return app.render(req, res, actualPage)
  })
  server.get('/master-location', (req, res) => {
    const actualPage = '/masterData/location'
    return app.render(req, res, actualPage)
  })
  server.get('/master-settings', (req, res) => {
    const actualPage = '/masterData/settings'
    return app.render(req, res, actualPage)
  })

  // ROUTE LOG TRANSACTION
  server.get('/audit-trail', (req, res) => {
    const actualPage = '/logTransaction/auditTrail'
    return app.render(req, res, actualPage)
  })

  //LATIHAN
  server.get('/sample-mobil', (req, res) => {
    const actualPage = '/sampleMobil'
    return app.render(req, res, actualPage)
  })

  // server.get('/banner/:id/:slug', (req, res) => { 
  //   const actualPage = '/banner/detail'
  //   const queryParams = { id: req.params.id }
  //   return app.render(req, res, actualPage, queryParams)
  // })

  server.all('*', (req, res) => {
    let nextRequestHandler = app.getRequestHandler()
    let parsedUrl = parse(req.url, true)
    return nextRequestHandler(req, res, parsedUrl)
  })

  server.listen(process.env.PORT, err => {
    if (err) {
      throw err
    }
    console.log('> Ready on http://localhost:' + process.env.PORT + ' [' + process.env.NODE_ENV + ']')
  })

}).catch(err => {
  console.log('An error occurred, unable to start the server')
  console.log(err)
})




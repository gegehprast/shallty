const express = require('express')
const routes = express.Router()
const Samehadaku = require('../controllers/Samehadaku')
const Meownime = require('../controllers/Meownime')

routes.get('/samehadaku/test', Samehadaku.test)
routes.get('/samehadaku/njiir', Samehadaku.njiir)
routes.get('/meownime/anime', Meownime.anime)
routes.get('/meownime/davinsurance', Meownime.davinsurance)
routes.get('/meownime/meowbox', Meownime.meowbox)

module.exports = routes
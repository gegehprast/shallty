const express = require('express')
const routes = express.Router()
const SamehadakuController = require('../controllers/SamehadakuController')
const MeownimeController = require('../controllers/MeownimeController')

routes.get('/meownime/anime', MeownimeController.anime)
routes.get('/meownime/davinsurance', MeownimeController.davinsurance)
routes.get('/meownime/meowbox', MeownimeController.meowbox)
routes.get('/meownime/meowdrive', MeownimeController.meowdrive)
routes.get('/meownime/checkOnGoingPage', MeownimeController.checkOnGoingPage)
routes.get('/meownime/onGoingAnime', MeownimeController.onGoingAnime)
routes.get('/samehadaku/checkOnGoingPage', SamehadakuController.checkOnGoingPage)
routes.get('/samehadaku/getDownloadLinks', SamehadakuController.getDownloadLinks)
routes.get('/samehadaku/tetew', SamehadakuController.tetew)
routes.get('/samehadaku/njiir', SamehadakuController.njiir)

module.exports = routes
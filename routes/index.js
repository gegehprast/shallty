const express = require('express')
const routes = express.Router()
const SamehadakuController = require('../controllers/SamehadakuController')
const MeownimeController = require('../controllers/MeownimeController')
const NeonimeController = require('../controllers/NeonimeController')
const OploverzController = require('../controllers/OploverzController')
const KusonimeController = require('../controllers/KusonimeController')

routes.get('/meownime/anime', MeownimeController.anime)
routes.get('/meownime/movie', MeownimeController.movie)
routes.get('/meownime/davinsurance', MeownimeController.davinsurance)
routes.get('/meownime/meowbox', MeownimeController.meowbox)
routes.get('/meownime/meowdrive', MeownimeController.meowdrive)
routes.get('/meownime/checkOnGoingPage', MeownimeController.checkOnGoingPage)
routes.get('/meownime/onGoingAnime', MeownimeController.onGoingAnime)

routes.get('/samehadaku/anime', SamehadakuController.anime)
routes.get('/samehadaku/checkOnGoingPage', SamehadakuController.checkOnGoingPage)
routes.get('/samehadaku/getDownloadLinks', SamehadakuController.getDownloadLinks)
routes.get('/samehadaku/tetew', SamehadakuController.tetew)
routes.get('/samehadaku/njiir', SamehadakuController.njiir)

routes.get('/neonime/checkOnGoingPage', NeonimeController.checkOnGoingPage)
routes.get('/neonime/animeList', NeonimeController.animeList)
routes.get('/neonime/tvShow', NeonimeController.tvShow)
routes.get('/neonime/getEpisodes', NeonimeController.getEpisodes) // including download links
routes.get('/neonime/hightech', NeonimeController.hightech)
routes.get('/neonime/getBatchEpisodes', NeonimeController.getBatchEpisodes) // including download links

routes.get('/oploverz/checkOnGoingPage', OploverzController.checkOnGoingPage)
routes.get('/oploverz/series', OploverzController.series)
routes.get('/oploverz/getDownloadLinks', OploverzController.getDownloadLinks)
routes.get('/oploverz/hexa', OploverzController.hexa)

routes.get('/kusonime/homePage', KusonimeController.homePage)
routes.get('/kusonime/animeList', KusonimeController.animeList)
routes.get('/kusonime/getDownloadLinks', KusonimeController.getDownloadLinks)
routes.get('/kusonime/semrawut', KusonimeController.semrawut)

module.exports = routes
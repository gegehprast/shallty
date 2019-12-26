const express = require('express')
const route = express.Router()
const SamehadakuController = require('../controllers/SamehadakuController')
const MeownimeController = require('../controllers/MeownimeController')
const NeonimeController = require('../controllers/NeonimeController')
const OploverzController = require('../controllers/OploverzController')
const KusonimeController = require('../controllers/KusonimeController')
const KiryuuController = require('../controllers/KiryuuController')
const MoenimeController = require('../controllers/MoenimeController')

route.get('/meownime/anime', MeownimeController.anime)
route.get('/meownime/movie', MeownimeController.movie)
route.get('/meownime/davinsurance', MeownimeController.davinsurance)
route.get('/meownime/meowbox', MeownimeController.meowbox)
route.get('/meownime/meowdrive', MeownimeController.meowdrive)
route.get('/meownime/checkOnGoingPage', MeownimeController.checkOnGoingPage)
route.get('/meownime/onGoingAnime', MeownimeController.onGoingAnime)

route.get('/samehadaku/anime', SamehadakuController.anime)
route.get('/samehadaku/checkOnGoingPage', SamehadakuController.checkOnGoingPage)
route.get('/samehadaku/getDownloadLinks', SamehadakuController.getDownloadLinks)
route.get('/samehadaku/tetew', SamehadakuController.tetew)
route.get('/samehadaku/njiir', SamehadakuController.njiir)

route.get('/neonime/checkOnGoingPage', NeonimeController.checkOnGoingPage)
route.get('/neonime/animeList', NeonimeController.animeList)
route.get('/neonime/tvShow', NeonimeController.tvShow)
route.get('/neonime/getEpisodes', NeonimeController.getEpisodes) // including download links
route.get('/neonime/hightech', NeonimeController.hightech)
route.get('/neonime/getBatchEpisodes', NeonimeController.getBatchEpisodes) // including download links

route.get('/oploverz/checkOnGoingPage', OploverzController.checkOnGoingPage)
route.get('/oploverz/series', OploverzController.series)
route.get('/oploverz/getDownloadLinks', OploverzController.getDownloadLinks)
route.get('/oploverz/hexa', OploverzController.hexa)

route.get('/kusonime/homePage', KusonimeController.homePage)
route.get('/kusonime/animeList', KusonimeController.animeList)
route.get('/kusonime/getDownloadLinks', KusonimeController.getDownloadLinks)
route.get('/kusonime/semrawut', KusonimeController.semrawut)

route.get('/kiryuu/mangaList', KiryuuController.mangaList)
route.get('/kiryuu/mangaInfo', KiryuuController.mangaInfo)
route.get('/kiryuu/chapters', KiryuuController.chapters)
route.get('/kiryuu/images', KiryuuController.images)
route.get('/kiryuu/newReleases', KiryuuController.newReleases)

route.get('/moenime/animeList', MoenimeController.animeList)
route.get('/moenime/episodes', MoenimeController.episodes)
route.get('/moenime/newReleases', MoenimeController.newReleases)
route.get('/moenime/teknoku', MoenimeController.teknoku)

module.exports = route
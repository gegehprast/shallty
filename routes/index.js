const express = require('express')
const route = express.Router()
const SamehadakuController = require('../controllers/SamehadakuController')
const NeonimeController = require('../controllers/NeonimeController')
const OploverzController = require('../controllers/OploverzController')
const KusonimeController = require('../controllers/KusonimeController')
const KiryuuController = require('../controllers/KiryuuController')
const MoenimeController = require('../controllers/MoenimeController')

route.get('/samehadaku/episodes', SamehadakuController.episodes)
route.get('/samehadaku/links', SamehadakuController.links)
route.get('/samehadaku/newReleases', SamehadakuController.newReleases)
route.get('/samehadaku/shortlink', SamehadakuController.shortlink)

route.get('/neonime/animeList', NeonimeController.animeList)
route.get('/neonime/tvShow', NeonimeController.tvShow)
route.get('/neonime/getEpisodes', NeonimeController.getEpisodes) // including download links
route.get('/neonime/getBatchEpisodes', NeonimeController.getBatchEpisodes) // including download links
route.get('/neonime/shortlink', NeonimeController.shortlink)
route.get('/neonime/newReleases', NeonimeController.newReleases)

route.get('/oploverz/episodes', OploverzController.episodes)
route.get('/oploverz/links', OploverzController.links)
route.get('/oploverz/newReleases', OploverzController.newReleases)
route.get('/oploverz/shortlink', OploverzController.shortlink)

route.get('/kusonime/animeList', KusonimeController.animeList)
route.get('/kusonime/links', KusonimeController.links)
route.get('/kusonime/newReleases', KusonimeController.homePage)
route.get('/kusonime/shortlink', KusonimeController.shortlink)

route.get('/moenime/animeList', MoenimeController.animeList)
route.get('/moenime/links', MoenimeController.links)
route.get('/moenime/newReleases', MoenimeController.newReleases)
route.get('/moenime/shortlink', MoenimeController.shortlink)

route.get('/kiryuu/mangaList', KiryuuController.mangaList)
route.get('/kiryuu/mangaInfo', KiryuuController.mangaInfo)
route.get('/kiryuu/chapters', KiryuuController.chapters)
route.get('/kiryuu/images', KiryuuController.images)
route.get('/kiryuu/newReleases', KiryuuController.newReleases)

module.exports = route
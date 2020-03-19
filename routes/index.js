const express = require('express')
const web = express.Router()
const MainController = require('../controllers/MainController')
const SamehadakuController = require('../controllers/SamehadakuController')
const NeonimeController = require('../controllers/NeonimeController')
const OploverzController = require('../controllers/OploverzController')
const KusonimeController = require('../controllers/KusonimeController')
const KiryuuController = require('../controllers/KiryuuController')
const MoenimeController = require('../controllers/MoenimeController')
const ShortlinkController = require('../controllers/ShortlinkController')
const ScreenshotController = require('../controllers/ScreenshotController')

const api = web

web.get('/', MainController.index)
web.get('/fake', MainController.fake)

api.get('/samehadaku/animeList', SamehadakuController.animeList)
api.get('/samehadaku/episodes', SamehadakuController.episodes)
api.get('/samehadaku/links', SamehadakuController.links)
api.get('/samehadaku/newReleases', SamehadakuController.newReleases)

api.get('/neonime/animeList', NeonimeController.animeList)
api.get('/neonime/episodes', NeonimeController.episodes)
api.get('/neonime/links', NeonimeController.links)
api.get('/neonime/newReleases', NeonimeController.newReleases)

api.get('/oploverz/animeList', OploverzController.animeList)
api.get('/oploverz/episodes', OploverzController.episodes)
api.get('/oploverz/links', OploverzController.links)
api.get('/oploverz/newReleases', OploverzController.newReleases)

api.get('/kusonime/animeList', KusonimeController.animeList)
api.get('/kusonime/links', KusonimeController.links)
api.get('/kusonime/newReleases', KusonimeController.newReleases)

api.get('/moenime/animeList', MoenimeController.animeList)
api.get('/moenime/links', MoenimeController.links)
api.get('/moenime/newReleases', MoenimeController.newReleases)

api.get('/kiryuu/mangaList', KiryuuController.mangaList)
api.get('/kiryuu/mangaInfo', KiryuuController.mangaInfo)
api.get('/kiryuu/chapters', KiryuuController.chapters)
api.get('/kiryuu/images', KiryuuController.images)
api.get('/kiryuu/newReleases', KiryuuController.newReleases)

api.get('/shortlink', ShortlinkController.index)

api.get('/screenshot', ScreenshotController.screenshot)

module.exports = [web, api]
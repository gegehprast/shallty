const express = require('express')
const web = express.Router()
const MainController = require('../controllers/MainController')
const KiryuuController = require('../controllers/KiryuuController')
const FansubController = require('../controllers/FansubController')
const ShortlinkController = require('../controllers/ShortlinkController')
const ScreenshotController = require('../controllers/ScreenshotController')

const api = web

web.get('/', MainController.index)
web.get('/fake', MainController.fake)

api.get('/kiryuu/mangaList', KiryuuController.mangaList)
api.get('/kiryuu/mangaInfo', KiryuuController.mangaInfo)
api.get('/kiryuu/chapters', KiryuuController.chapters)
api.get('/kiryuu/images', KiryuuController.images)
api.get('/kiryuu/newReleases', KiryuuController.newReleases)

api.get('/:fansub/animeList', FansubController.animeList)
api.get('/:fansub/episodes', FansubController.episodes)
api.get('/:fansub/links', FansubController.links)
api.get('/:fansub/newReleases', FansubController.newReleases)

api.get('/shortlink', ShortlinkController.index)

api.get('/screenshot', ScreenshotController.screenshot)

module.exports = [web, api]
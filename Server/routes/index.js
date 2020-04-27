const express = require('express')
const web = express.Router()
const MainController = require('../controllers/MainController')
const FanscanController = require('../controllers/FanscanController')
const FansubController = require('../controllers/FansubController')
const ShortlinkController = require('../controllers/ShortlinkController')
const ScreenshotController = require('../controllers/ScreenshotController')

const api = web

web.get('/', MainController.index)
web.get('/fake', MainController.fake)

api.get('/:fansub/animeList', FansubController.animeList)
api.get('/:fansub/episodes', FansubController.episodes)
api.get('/:fansub/links', FansubController.links)
api.get('/:fansub/newReleases', FansubController.newReleases)

api.get('/:fanscan/mangaList', FanscanController.mangaList)
api.get('/:fanscan/mangaInfo', FanscanController.mangaInfo)
api.get('/:fanscan/chapters', FanscanController.chapters)
api.get('/:fanscan/images', FanscanController.images)
api.get('/:fanscan/newReleaseManga', FanscanController.newReleases)

api.get('/shortlink', ShortlinkController.index)

api.get('/screenshot', ScreenshotController.screenshot)

module.exports = [web, api]
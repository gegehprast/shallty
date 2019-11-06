const Mangaku = require('../services/Mangaku')

const mangaList = async (req, res) => {
    const manga = await Mangaku.getMangaList()
    if (!manga) {
        res.status(500).json({
            status: 500,
            message: 'Something went wrong',
        })
    } else {
        res.json({
            status: 200,
            message: 'Success',
            data: manga
        })
    }
}

const mangaInfo = async (req, res) => {
    const result = await Mangaku.getMangaInfo(req.query.link)
    if (!result) {
        res.status(500).json({
            status: 500,
            message: 'Something went wrong',
        })
    } else {
        res.json({
            status: 200,
            message: 'Success',
            data: result
        })
    }
}

const chapters = async (req, res) => {
    const chapters = await Mangaku.getChapters(req.query.link)
    if (!chapters) {
        res.status(500).json({
            status: 500,
            message: 'Something went wrong',
        })
    } else {
        res.json({
            status: 200,
            message: 'Success',
            data: chapters
        })
    }
}

const images = async (req, res) => {
    const images = await Mangaku.images(req.query.link)
    if (!images) {
        res.status(500).json({
            status: 500,
            message: images.message && 'Something went wrong',
        })
    } else {
        res.json({
            status: 200,
            message: 'Success',
            data: images
        })
    }
}

const newReleases = async (req, res) => {
    const releases = await Mangaku.newReleases(req.query.link)
    if (!releases) {
        res.status(500).json({
            status: 500,
            message: 'Something went wrong',
        })
    } else {
        res.json({
            status: 200,
            message: 'Success',
            data: releases
        })
    }
}

module.exports = {
    mangaList,
    mangaInfo,
    chapters,
    images,
    newReleases
}
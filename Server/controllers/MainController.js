class MainController {
    async index(req, res) {
        res.send(`<p style="font-weight: 600; margin-top: 15px; font-size: 1.25em;">
            Welcome! You can start crawling via "/api" endpoint. 
            See <a href="https://github.com/gegehprast/shallty/blob/master/README.md" target="_blank">https://github.com/gegehprast/shallty/blob/master/README.md</a> for more information.
        </p>`)
    }

    async fake(req, res) {
        res.render('fake/index', {
            title: 'Home',
            agent: req.query.agent
        })
    }
}

module.exports = new MainController
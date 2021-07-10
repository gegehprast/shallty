import { RequestHandler } from 'express'

const index: RequestHandler = async (req, res) => {
    res.send(`<p style="font-weight: 600; margin-top: 15px; font-size: 1.25em;">
            Welcome! You can start parsing shortlinks via "/api/parse" endpoint. 
            See <a href="https://github.com/gegehprast/shallty/blob/master/README.md" target="_blank">https://github.com/gegehprast/shallty/blob/master/README.md</a> for more information.
        </p>`)
}

const socketTester: RequestHandler = async (req, res) => {
    res.render('test/socket-tester.pug', {
        title: 'Home',
        agent: req.query.agent
    })
}

export default {
    index,
    socketTester
}

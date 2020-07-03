/* eslint-disable no-undef */
require('dotenv').config()
const expect = require('chai').expect
const Browser = require('../../Browser')
const Shortlink = require('../../Shortlinks')

describe('shortlink', function () {
    before(function () {
        this.skip()
    })
    
    describe('teknoku', function () {
        it('should return an object which has url property', async function () {
            this.timeout(60000)
            await Browser.init()
            const data = await Shortlink.parse('https%3A%2F%2Fteknoku.me%2F%3Fid%3DcWFkTnBBZlEvZ1NvUHdYUGNkQ1ZPeGNnb0pjK2s1VDJWY2dlakh2Ykwrbjk0VkRUVGR2bWZwSHNpbVFVZUdhSjNTYUhySnBsS05jN2NmUHMzTk1BMWc9PQ%3D%3D')

            expect(data).to.be.an('object')
            expect(data).to.has.property('url')
            expect(data.url).to.be.a('string')
        })
    })

    describe('jelajahinternet', function () {
        it('should return an object which has a string url property', async function () {
            this.timeout(60000)
            await Browser.init()
            const data = await Shortlink.parse('https%3A%2F%2Fjelajahinternet.me%2Ffull%2F%3Fapi%3Da43e9781fc804e34814e29bf4c2bb518989da6ad%26url%3Dhttps%253A%252F%252Facefile.co%252Ff%252F16742192%252Fkusonime-topeng-macan-w-001-020-360p-rar%26type%3D2')

            expect(data).to.be.an('object')
            expect(data).to.has.property('url')
            expect(data.url).to.be.a('string')
            expect(data.url).to.include('acefile.co')
        })
    })

    describe('xmaster', function () {
        it('should return an object which has a string url property', async function () {
            this.timeout(60000)
            await Browser.init()
            const data = await Shortlink.parse('https%3A%2F%2Fxmaster.xyz%2F%3Fsitex%3DaHR0cHM6Ly9zZW5kaXQuY2xvdWQvN24zNXZlcGNibXpq')

            expect(data).to.be.an('object')
            expect(data).to.has.property('url')
            expect(data.url).to.be.a('string')
            expect(data.url).to.include('sendit.cloud')
        })
    })

    describe('kontenajaib', function () {
        before(function () {
            this.skip()
        })

        it('should return an object which has a string url property', async function () {
            this.timeout(60000)
            await Browser.init()
            const data = await Shortlink.parse('https%3A%2F%2Fkontenajaib.xyz%2F%3Fid%3DemFXMEdBNC9HbDBMUTh0SFdiRHVQaFEyRWhKS3YzVEJSRHlrRVlEbExLZUNlSEdZaENXTW5mWllrNTliSXYrMXQ2NnhXOEZUL1BkSkpvbXAyRHg2ZE9ycVdZTlU3ejc1TUV5RXFWNkhxc3ZQQnVicW9jdTBtYk5SSjMxb2JLOTEwOFVGK1hSTks3N0txTkxOZHdsWUF4enVwVEtkQ0htUFA1LzJhNmZ1bkdkQ3RJNS9mNHhJOFlMMUdLWEtOQnlwSzE0QlVpODkvZ3RBYmZIQVpMbnVBK3IwOG5xRWFnU1FDOFBQRG55dkhKZmtWQldmM2Jtb1lvRCtmRHhMdXdNVE9DUDNzUjlWeUwrTm1FSEVPb1cvTTV3cFk0NTlCbms3NnVFYkpqRmFnSHczNWxFNllDN2E5VHVLdDdjZTU3dU0%3D')

            expect(data).to.be.an('object')
            expect(data).to.has.property('url')
            expect(data.url).to.be.a('string')
            expect(data.url).to.include('zippyshare.com')
        })
    })

    describe('hexa', function () {
        it('should return an object which has a string url property', async function () {
            this.timeout(60000)
            await Browser.init()
            const data = await Shortlink.parse('https%3A%2F%2Fhexafile.net%2Fu3CSw')

            expect(data).to.be.an('object')
            expect(data).to.has.property('url')
            expect(data.url).to.be.a('string')
            expect(data.url).to.include('zippyshare.com')
        })
    })

    describe('hightech', function () {
        it('should return an object which has a string url property', async function () {
            this.timeout(60000)
            await Browser.init()
            const data = await Shortlink.parse('https%3A%2F%2Fhightech.web.id%2Fko82jkl9%2F%3Fxyzkl%3DaHR0cHM6Ly9kcml2ZS5nb29nbGUuY29tL3VjP2lkPTFheVhtZlcwWV9VZjRGMDhqcjVjTDl0NDhDVnBmUlJ2Xw%3D%3D')

            expect(data).to.be.an('object')
            expect(data).to.has.property('url')
            expect(data.url).to.be.a('string')
            expect(data.url).to.include('google')
        })
    })

    describe('anjay', function () {
        it('should return an object which has a string url property', async function () {
            this.timeout(60000)
            await Browser.init()
            const data = await Shortlink.parse('https%3A%2F%2Fanjay.info%2F%3Fid%3DVWErNWlBZmpCUlMvT0pxVHE3YS84bGJVZGkrVjNwejZLTnR2UmVxRVJxell2UmdXdzA4T2tDVjBNK3gzcWk3Lw%3D%3D')

            expect(data).to.be.an('object')
            expect(data).to.has.property('url')
            expect(data.url).to.be.a('string')
            expect(data.url).to.include('zippyshare.com')
        })
    })

    describe('coeg', function () {
        it('should return an object which has a string url property', async function () {
            this.timeout(60000)
            await Browser.init()
            const data = await Shortlink.parse('http%3A%2F%2Fcoeg.in%2Fd5uuo')

            expect(data).to.be.an('object')
            expect(data).to.has.property('url')
            expect(data.url).to.be.a('string')
            expect(data.url).to.include('solidfiles.com')
        })
    })

    describe('neonime', function () {
        it('should return an object which has a string url property', async function () {
            this.timeout(60000)
            await Browser.init()
            const data = await Shortlink.parse('https://neonime.org/?940caec1dc=Z0g4dktlM2RLaWc5dVN2dEtqb3JQZVBMVm4vK2lPeCtxOWtBU3kwV1BwS09jdkNjTHVkTktZa0FiSjVUUXArdlE5ZjJGeVdsM0xhb3VSU0l4OS8xcTI1VS9WcGVscEoza0V6am1PcVFxbWovYkpnM1dIYmtFUXRqYWZBOTREZzM=')
            console.log(data)

            expect(data).to.be.an('object')
            expect(data).to.has.property('url')
            expect(data.url).to.be.a('string')
            expect(data.url).to.include('zippyshare')
        })
    })
})
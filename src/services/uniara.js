const puppeteer = require('puppeteer');
const fs = require('fs');
const cheerio = require('cheerio');

async function getArchives() {
    await page.goto('https://virtual.uniara.com.br/alunos/consultas/arquivos/');
}

module.exports =  {
    open: async(login, password) => {
        const selectLogin = 'input[class="textlogin"]';
        const selectPassword = 'input[name="senha"]';
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto('https://virtual.uniara.com.br/login/');
        await page.waitFor(selectLogin);
        await page.type(selectLogin, login);
        await page.waitFor(selectPassword);
        await page.type(selectPassword, password);
        await page.waitFor('input[type="image"]');
        await page.click('input[type="image"]');
        await page.goto('https://virtual.uniara.com.br/alunos/index/');
        let html = await page.content();
        const $ = cheerio.load(html);
        try {
            // save picture of user in server
                var urlPhoto = $("body > table > tbody > tr:nth-child(7) > td > table > tbody > tr > td:nth-child(3) > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(2) > td > div > img").attr().src;
                urlPhoto = 'https://virtual.uniara.com.br/' + urlPhoto;
                var viewSource = await page.goto(urlPhoto);
                var ra;
                if(login[5] != "-") {
                    ra = login.slice(0, 5);
                    ra = ra + "-" + login.slice(5);
                }
                fs.writeFile('./temp/' + ra + '.jpg', await viewSource.buffer(), (err) => {
                    if (err) {
                        console.log('error on save the photo of user');
                    }
                });
            // finding archives in page
            await page.goto('https://virtual.uniara.com.br/alunos/consultas/arquivos/');
            const archivesHtml = await page.content();
            const _$ = cheerio.load(archivesHtml);
            const tableArchive = _$("body > table > tbody > tr:nth-child(7) > td > table > tbody > tr > td:nth-child(3) > table > tbody > tr > td > table > tbody");
            
            console.log(tableArchive);
            //await browser.close();
            return ({
                status: 1,
                html,
            });
        } catch (error) {
            return({
                status: 0,
                error,
            })
        }
    },


    getName: async(html) => {
        const $ = cheerio.load(html);
        const name = $("body > table > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(6) > table > tbody > tr > td:nth-child(1) > font > b").text().slice(11);
        return name;
    },


    getPhoto: async(html) => {
        const $ = cheerio.load(html);
        var urlPhoto = $("body > table > tbody > tr:nth-child(7) > td > table > tbody > tr > td:nth-child(3) > table > tbody > tr > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(2) > td > div > img").attr().src;
        return urlPhoto = 'https://virtual.uniara.com.br/'+urlPhoto;
    },
}
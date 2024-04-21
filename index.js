import express, {raw} from "express";


import {JSONFilePreset} from "lowdb/node";
import path from "path";

const app = express()

const port = 3000

async function start() {
    const db = await JSONFilePreset('db.json', { ips: [] })

    app.get('/', async (req, res) => {
        const ip = req.headers['x-forwarded-for'] ?? req.socket.remoteAddress;
        const ips = db.data.ips;
        ips.push(ip);
        if (ips.length > 100) {
            ips.splice(0, 1);
        }

        await db.write();

        res.send("Ok");
    })
    app.use('/ip', express.static(path.join('db.json')))

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })

}

(async () => {
    await start();
})();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios')
const protobuf = require('protobufjs');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const url = 'https://api.bilibili.com/x/web-interface/nav';
let cookie = ''
let segProgress

// 验证cookie是否有效
app.post('/validate', (req, res) => {
    const receivedCookie = req.body.cookie;

    console.log(receivedCookie);

    axios.get(url, {
        headers: { 'Cookie': receivedCookie }
    })
        .then(response => {
            console.log('nav');
            if (response.data.code === 0) {
                cookie = receivedCookie
                res.send({
                    code: 0,
                    message: 'Cookie valuable'
                });
            } else {
                res.send({
                    code: -1,
                    message: 'Cookie not valuable'
                });
            }

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

app.get('/progress', (req, res) => {
    res.send(String(segProgress));
});

// 获取bvid
app.post('/data', (req, res) => {
    const bvid = req.body.bvid;

    console.log(bvid);

    // 根据BV号获取视频信息
    async function getVideoInfo(bvid) {
        const res = await axios({
            url: 'https://api.bilibili.com/x/web-interface/view',
            params: {
                bvid,
            },
        })
        console.log('view');

        const message = res.data
        const segNum = Math.ceil(message.data.duration / 360) // 6分钟一个seg

        params = {
            type: 1, // 1代表类型为视频弹幕
            oid: message.data.cid, // oid为获取的cid
            pid: message.data.aid, // pid为获取的aid
            segment_index: segNum // 总seg数量
        }

        // 返回视频信息对象和视频标题
        return [params, message.data.title]
    }

    // 解析弹幕buffer到对象
    async function parseProtobuf(data) {
        const root = await protobuf.load("dm.proto");
        const DmSegMobileReply = root.lookupType("bilibili.community.service.dm.v1.DmSegMobileReply");
        const message = DmSegMobileReply.decode(data);
        const object = DmSegMobileReply.toObject(message, {
            longs: String,
            enums: String,
            bytes: String,
        });
        return object;
    }

    // 获取弹幕数据
    async function getDmSeg(params) {
        const res = await axios({
            url: 'https://api.bilibili.com/x/v2/dm/web/seg.so',
            headers: {
                'Cookie': cookie, // 需要cookie才能获取到完整的弹幕数据
            },
            params: params,
            responseType: 'arraybuffer'
        })
        console.log('seg.so');
        const message = await parseProtobuf(res.data)

        // 返回解析后弹幕数据中的每条弹幕
        return message.elems
    }

    // 根据总seg数获取全部弹幕数据
    async function getAllDm(params) {
        const elemsArray = []
        while (params.segment_index) {
            const dm = await getDmSeg(params)
            elemsArray.push(dm)
            console.log(params.segment_index);
            segProgress = params.segment_index
            params.segment_index--
        }
        return elemsArray
    }

    // 处理获取的全部弹幕数据
    async function processData(bvid) {
        const videoInfo = await getVideoInfo(bvid)
        const data = await getAllDm(videoInfo[0])

        res.send({
            bvid: bvid,
            title: videoInfo[1],
            data: data.flat()
        });
    }

    processData(bvid)
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

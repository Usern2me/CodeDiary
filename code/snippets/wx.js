/**
 * node端和前端调用微信接口
 */

// NODE端
async function getWXApiTicket() {
    const {
        ctx,
        config
    } = this;
    let timestamp = new Date().valueOf();
    if (!ctx.session.tokenObj || ctx.session.tokenObj.expires_in < timestamp || ctx.session.tokenObj.app_id !== config.wx.appId) {
        // 拿微信那边的accesstoken
        const tokenResult = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.wx.appId}&secret=${config.wx.secret}`, {
            dataType: 'json'
        });
        if (tokenResult.status === 200 && tokenResult.data && tokenResult.data.access_token) {
            ctx.session.tokenObj = {
                access_token: tokenResult.data.access_token,
                expires_in: timestamp + tokenResult.data.expires_in * 1000,
                app_id: config.wx.appId
            };
        } else {
            ctx.session.tokenObj = null;
            ctx.logger.error(new Error(`wxconfig: ${JSON.stringify(config.wx)}`));
            ctx.logger.error(new Error(`tokenResult: ${JSON.stringify(tokenResult)}`));
        }
    }
    let res = {
        code: 500,
        msg: '获取失败'
    };
    if (ctx.session.tokenObj && ctx.session.tokenObj.app_id === config.wx.appId) {
        timestamp = new Date().valueOf();
        if (!ctx.session.jsapiObj || ctx.session.jsapiObj.expires_in < timestamp || ctx.session.jsapiObj.app_id !== config.wx.appId) {
            // 把刚刚拿到的token发给微信拿ticket和appid
            const jsapiResult = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${ctx.session.tokenObj.access_token}&type=jsapi`, {
                dataType: 'json'
            });
            if (jsapiResult.status === 200 && jsapiResult.data && jsapiResult.data.errcode === 0) {
                ctx.session.jsapiObj = {
                    ticket: jsapiResult.data.ticket,
                    expires_in: timestamp + jsapiResult.data.expires_in * 1000,
                    app_id: config.wx.appId
                };
            } else {
                ctx.session.jsapiObj = null;
                ctx.logger.error(new Error(`wxconfig: ${JSON.stringify(config.wx)}`));
                ctx.logger.error(new Error(`jsapiResult: ${JSON.stringify(jsapiResult)}`));
            }
        }
        if (ctx.session.jsapiObj && ctx.session.jsapiObj.app_id === config.wx.appId) {
            const jsapi_ticket = ctx.session.jsapiObj.ticket;
            const uuidv1 = require('uuid/v1');
            const noncestr = uuidv1();
            timestamp = new Date().valueOf();
            const {
                url
            } = ctx.query;
            const string1 = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
            const crypto = require('crypto');
            // 使用sha1加密
            const hash = crypto.createHash('sha1');
            hash.update(string1);
            const signature = hash.digest('hex');
            res = {
                code: 0,
                data: {
                    nonceStr: noncestr,
                    timestamp,
                    signature,
                    appId: config.wx.appId,
                    jsapi_ticket,
                    string1
                }
            };
        }
    }
    ctx.body = res;
}

// JS端
const wx = window['wx'];
const url = location.href.split('#')[0];
$.get('/getWXApiTicket?url=' + encodeURIComponent(url), function (res) {
    if (res.code === 0) {
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appId, // 必填，公众号的唯一标识
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'onMenuShareWeibo'] // 必填，需要使用的JS接口列表
        });

        wx.ready(function () {
            const title = '分享标题';
            const desc = '分享描述';
            const imgUrl = '分享图片链接';
            // 朋友圈
            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl // 分享图标
            });

            // 微信朋友
            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '' // 如果type是music或video，则要提供数据链接，默认为空
            });

            // qq
            wx.onMenuShareQQ({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: url, // 分享链接
                imgUrl: imgUrl // 分享图标
            });

            // qq空间
            wx.onMenuShareQZone({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: url, // 分享链接
                imgUrl: imgUrl // 分享图标
            });

            // 腾讯微博
            wx.onMenuShareWeibo({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: url, // 分享链接
                imgUrl: imgUrl // 分享图标
            });
        });
    }
});

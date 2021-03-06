/* eslint-disable */
'use strict';

const Service = require('egg').Service;

class EnvironmentService extends Service {

    // 获得页面性能数据平均值
    async getDataGroupBy(type, url, appId, beginTime, endTime) {
        type = type*1;

        const queryjson = { $match: { app_id: appId, url: url }, }
        if (beginTime && endTime) queryjson.$match.create_time = { $gte: new Date(beginTime), $lte: new Date(endTime) };
        const group_id = {
            url: "$url",
            city: `${type == 1 ? "$city" : ""}`,
            browser: `${type == 2 ? "$browser" : ""}`,
            system: `${type == 3 ? "$system" : ""}`,
        };

        const datas = await this.ctx.model.Web.WebEnvironment.aggregate([
            queryjson,
            {
                $group: {
                    _id: group_id,
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]).exec();

        return datas;
    }

    // 根据mark_page获得用户系统信息
    async getEnvironmentForPage(appId, markPage) {
        return await this.ctx.model.Web.WebEnvironment.findOne({ app_id: appId, mark_page: markPage }).exec();
    }
}

module.exports = EnvironmentService;

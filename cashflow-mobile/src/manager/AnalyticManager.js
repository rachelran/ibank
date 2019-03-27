import RestClient from '../manager/RestClient';

module.exports = {
    getRevenueSummary: function () {
        return RestClient.ajaxGet('gpsummary');
    },

    getGpPerCategory: function (year, month) {
        return RestClient.ajaxGet('gppercategory/' + year+'/'+month);
    },

    getMonthTrend: function () {
        return RestClient.ajaxGet('monthTrendResult');
    },

    getFunds: function(){
        return RestClient.ajaxGet('funds');
    }
}
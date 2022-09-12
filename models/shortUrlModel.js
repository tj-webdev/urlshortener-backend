const mongoose = require("mongoose");

// short url schema
const shortUrlSchema = new mongoose.Schema({
  userId: {
    type: mongoose.ObjectId,
    required: true
  },
  longUrl: {
    type: String,
    required: true,
    trim: true
  },
  shortUrl: {
    type: String,
    required: true
  }
},
{
  timestamps: true
})


// url analytics schema

const urlAnalyticsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.ObjectId,
    required: true
  },
  totalClicks: {
    type: Number,
    required: true,
    default: 0
  },
  refererUrls: [{
    _id: false,
    url: {
      type: String,
      required: true,
      default: "SELF"
    },
    clicks: {
      type: Number,
      required: true,
      default: 1
    }
  }]
},
{
  statics: {
    async updateUrlAnalytics(id,referer) {
      const data = await this.findOneAndUpdate({'urlId': id},{$inc: {'totalClicks': 1}});
      const index = data.refererUrls.findIndex((urls) => urls.url == referer);
      if(index>=0){
        data.refererUrls[index].clicks++;
      }
      else{
        data.refererUrls.push({url: referer, clicks: 1});
      }
      await data.save();
    }
  }
}
)

const urlAnalyticsModel = mongoose.model('url_analytics',urlAnalyticsSchema);
const shortUrlModel = mongoose.model('shorturl',shortUrlSchema);

module.exports = {shortUrlModel, urlAnalyticsModel};
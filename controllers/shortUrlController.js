const shortid = require('shortid');
const {shortUrlModel, urlAnalyticsModel} = require('../models/shortUrlModel');

class shortUrlController
{
  static createShortUrl = async (req,res) => {

    // long url already exist for user
    const longurl = await shortUrlModel.findOne({longUrl: req.body.longUrl, userId: req.body.userId});
    if(longurl){
      return res.status(400).json('URL already exist!');
    }

    // check if short url already exist
    let idExist = true;
    let newid = shortid.generate();
    while(idExist){
      newid = shortid.generate();
      let idCheck = await shortUrlModel.findOne({shortUrl: newid});
      if(!idCheck){
        idExist = false;
      }
    }

    // generate a short url & initialize url analytics
    const data = await shortUrlModel.create({
      userId: req.body.userId, 
      longUrl: req.body.longUrl,
      shortUrl: newid
    });

    urlAnalyticsModel.create({urlId: data._id});

    res.json(data);
  }

  static redirectShortUrl = async (req,res) => {

    // Find short url
    const url = await shortUrlModel.findOne({shortUrl: req.params.shorturl});

    if(!url){
      return res.status(404).json({'error': 'invalid url'});
    }

    // Update clicks count & analytics if `referer` is present
    if(req.query.referer){
      await urlAnalyticsModel.updateUrlAnalytics(url._id,req.query.referer);
    }

    res.json(url.longUrl);
  }

  static getShortUrl = async (req,res) => {
    // Find url records for user
    const urls = await shortUrlModel.find({userId: req.body.userId}).select('longUrl shortUrl');
    return res.json(urls);
  }

  static getAnalytics = async (req,res) => {
    // Find url records for user
    const url = await shortUrlModel.findOne({_id: req.params.id, userId: req.body.userId}).select('longUrl shortUrl');

    if(url){
      const data = await urlAnalyticsModel.findOne({urlId: req.params.id});
      res.json(data);
    }
    else{
      res.status(404).json('Invalid Link!');
    }
  }
}

module.exports = shortUrlController;
'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 
                       global.DATABASE_URL ||
                       'mongodb://admin:password@ds111262.mlab.com:11262/mongooseblogapi';
exports.PORT = process.env.PORT || 8080;
var config = require('./class/config');
config.init();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var url = require('url');
var fs = require('fs');
var CASAuthentication = require('cas-authentication');
var cas = new CASAuthentication(config.cas);
global.cas = cas;

var routes = require('./routes/index');

var passport          =     require('passport');
var FacebookStrategy  =     require('passport-facebook').Strategy;
var FB 				  = 	require('fb');
global.FB = FB;

var app = express();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

function carac(str){
  str=str.replace(/(&#039;)/ig,' ');
  str=str.replace(/\s\((\w+\.*)+(&#064;)(\w+\.*)+\)/ig,'');
  str=str.replace(/[']/g,' ');

  str=str.replace(/[ç]/g,'c');
  str=str.replace(/[Ç]/g,'C');

  str=str.replace(/[æ]/g,'ae');
  str=str.replace(/[Æ]/g,'AE');

  str=str.replace(/[œ]/g,'oe');
  str=str.replace(/[Œ]/g,'OE');

  str=str.replace(/[ÁÀÂÄÃÅ]/g,'A');
  str=str.replace(/[áàâäãå]/g,'a');

  str=str.replace(/[ç]/g,'c');
  str=str.replace(/[Ç]/g,'C');

  str=str.replace(/[ç]/g,'c');
  str=str.replace(/[Ç]/g,'C');


  str=str.replace(/[éèêë]/g,'e');
  str=str.replace(/[ÉÈÊË]/g,'E');

  str=str.replace(/[éèêë]/g,'e');
  str=str.replace(/[ÉÈÊË]/g,'E');

  str=str.replace(/[íìîï]/g,'i');
  str=str.replace(/[ÍÌÎÏ]/g,'I');

  str=str.replace(/[ñ]/g,'i');
  str=str.replace(/[Ñ]/g,'I');

  str=str.replace(/[óòôöõø]/g,'o');
  str=str.replace(/[ÓÒÔÖÕ]/g,'O');

  str=str.replace(/[úùûü]/g,'u');
  str=str.replace(/[ÚÙÛÜ]/g,'U');

  str=str.replace(/[ýÿ]/g,'y');
  str=str.replace(/[ÝŸ]/g,'Y');
  return str;
}

/*passport.use(new FacebookStrategy({
  clientID: config.facebook.api_key,
  clientSecret:config.facebook.api_secret ,
  callbackURL: config.facebook.callback_url,
  profileFields: ['id', 'displayName','first_name','last_name',]
},
function(accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    global.fb_user_access_token=accessToken;
    FB.api(
      '/me/taggable_friends?fields=name&limit=99999',
      'GET',
      {access_token: accessToken},
      function(response) {
        if (typeof response.data != 'undefined'){
          profile.displayName = carac(profile.displayName);
          global.pool.getConnection(function(err, connection) {
            if(err){
              console.error(err);
              return;
            }
            connection.query( "DELETE FROM `link` WHERE `from`=?;",[profile.displayName], function(err, rows) {
              if(err)
                console.error(err);
              connection.release();
            });
          });
          str="source;target;type\n";
          var query=[];
          for(var i = 0; i < response.data.length; i++) {
            var name=carac(response.data[i].name);
            str+=profile.displayName+";"+name+";Undirected\n";
            query.push([profile.displayName,name]);

          }
          global.pool.getConnection(function(err, connection) {
            if(err){
              console.error(err);
              return;
            }
            connection.query( "INSERT IGNORE INTO `link` (`from` ,`to`) VALUES ?;",[query], function(err, rows) {
              if(err)
                console.error(err);
              connection.release();
            });
          });
          fs.writeFile("datas/"+profile.displayName.replace(' ','').replace("'",'')+".csv", str, function(err) {
            if(err) {
              return console.log(err);
            }
            console.log(profile.displayName+" saved!");
          });
        }else{
          console.log("ERROR WITH "+profile.displayName);	
        }
      }
      );
    return done(null, profile);
  });
}
));


FB.api('oauth/access_token', {
  client_id: config.facebook.api_key,
  client_secret: config.facebook.api_secret,
  grant_type: 'client_credentials'
}, function (res) {
  if(!res || res.error) {
    console.error(!res ? 'error occurred' : res.error);
    return;
  }
  console.log("Access token FB : ", res.access_token);
  FB.setAccessToken = res.access_token;
  global.fb_access_token = res.access_token;
});
*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use( session({
  secret            : 'cEstLeMarketPutainMaggle!',
  resave            : false,
  saveUninitialized : true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

/*
app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/auth/facebook', passport.authenticate('facebook',{scope:'user_friends'}));


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect : '/ok', failureRedirect: '/auth/facebook' }),
  function(req, res) {
    res.redirect('ok');
  });
*/
app.get('/logout', function(req, res){
  console.log("User " + req.user.displayName + " logged out.");
  req.logout();
  res.redirect('/');
});

/*
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/auth/facebook')
}
*/
console.log("Routes initialized");

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html.twig', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error.html.twig', {
    message: err.message,
    error: {}
  });
});
console.log("Error handler initialized");

module.exports = app;

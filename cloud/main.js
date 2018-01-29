
Parse.Cloud.define('hello', function(req, res) {
  Parse.Cloud.useMasterKey();
  req.user.fetch({
    success: function (user) {
      response.success(user._sessionToken);
    },
    error: function (user, err) {
      response.error(err.message);
    }
  });
  res.success('Hi this is a testing method');
});

var writeCookie = function (name,value) {
    var date, expires;
    date = new Date();
    date.setTime(date.getTime()+(30*60*1000));
    expires = "; expires=" + date.toGMTString();
    document.cookie = name + "=" + value + expires + "; path=/";
}

var readCookie = function (name) {
    var i, c, ca, nameEQ = name + "=";
    ca = document.cookie.split(';');
    for(i=0;i < ca.length;i++) {
        c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return false;
}

var getSessionId = function() {
  /*
  set cookie 30minute expiry. store 
  */
  var sessionid = readCookie('sess');
  if(sessionid === false){
    $.ajax({
      url: './control/session.php',
      cache: false,
      timeout: 100000,
      dataType: 'text',
      async: false,
      success: function (data) {
        sessionid = $.trim(data);
        writeCookie('sess',sessionid);
      }
    });
  }
  return sessionid;
};

$(window).load(function(){
  
  var sessionid = getSessionId();
  if(sessionid) {
    var date;
    date = new Date();
    date.setTime(date.getTime()+(30*60*1000));
    $.ajax({
      url: './control/stats.php',
      cache: false,
      dataType: 'html',
      data: "id="+sessionid+"&userAgent="+navigator.userAgent+"&platform="+navigator.platform+"&expires="+date.toGMTString(),
      type: 'post'
    });
  }
});
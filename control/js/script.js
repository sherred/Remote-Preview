/*global jQuery */
(function ($) {
  /**
   * Returns full url to the parent directory.
   */
  function getRemotePreviewURL() {
    var path = window.location.pathname;
    // Account for different web server configurations.
    // Normalise to without trailing slash.
    if (path.slice(-1) === '/') {
      path = path.slice(0, -1);
    }
    return window.location.protocol + '//' + window.location.host + path.split('/').slice(0, -1).join('/');
  }

  function isUrl(url) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(url);
  }

  function initUrlValue() {
    $.ajax({
      url: '../url',
      cache: false,
      timeout: 100000,
      dataType: 'text',

      success: function (data) {
        // Remove whitespace from the beginning and end
        var newUrl = $.trim(data);
        if (isUrl(newUrl)) {
          $('#url').val(newUrl);
        }
      }
    });
  }

  //modify this so settimeout every 5 seconds, loader gif. checkstats.php returns the html and checks expires
  //in stats.json, if >= of now delete from stats.json, then build html response.
  function updateStats() {
    $(".stats").html('<img src="./loading.gif" title="loading">');
    $.ajax({
      url: './checkstats.php',
      cache: false,
      timeout: 100000,
      dataType: 'text',
      success: function (data) {
        $(".stats").html(data);
        setTimeout(updateStats, 10000);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setTimeout(updateStats, 5000);
        console.log('error: ' + textStatus + ', ' + errorThrown);
      }

    });
  };

  var fh = {
    init: function () {
      $('#preview-url').html(getRemotePreviewURL());

      initUrlValue();

      updateStats();

      $('#url-form').off('submit').on('submit', function (e) {
        e.preventDefault();
        fh.resetForm();
        if (fh.validateForm()) {
          $.ajax({
            url: './update.php',
            data: $(this).serialize(),
            type: 'post',
            cache: false,
            dataType: 'text',
            success: function (data) {
              fh.msgSuccess(data);
            },
            error: function (jqXhr) {
              fh.msgError(jqXhr.responseText || 'Error: Request failed.');
            }
          });
        }
      });
    },
    resetForm: function () {
      fh.clearMsg();
    },
    validateForm: function () {
      var url = $('#url').val();
      if (!url) {
        fh.msgError('Looks like you forgot to enter a URL...');
        return false;
      }

      if (!isUrl(url)) {
        fh.msgError("Hmmm, that doesn't look like a URL!");
        return false;
      }

      return true;
    },
    msgError: function (message) {
      $('.form-feedback').removeClass('form-success').addClass('form-error').text(message).fadeIn(200);
    },
    msgSuccess: function (message) {
      $('.form-feedback').removeClass('form-error').addClass('form-success').text(message).fadeIn(200);
    },
    clearMsg: function () {
      $('.form-feedback').hide().removeClass('form-success form-error').empty();
    }
  };

  $(fh.init);

}(jQuery));
// Shorthand for $( document ).ready()
let hls = undefined;
$(function () {
  loadHarFromBox();
  registerActions();
  handleErrors();
});

function registerActions() {
  $("#more").on('click', e => {
    if ($("#moreIcon").hasClass("fa-arrow-circle-down")) {
      $("#moreIcon").removeClass("fa-arrow-circle-down");
      $("#moreIcon").addClass("fa-arrow-circle-up");
      $("#moreContents").css('display', 'block');
    } else {
      $("#moreIcon").addClass("fa-arrow-circle-down");
      $("#moreIcon").removeClass("fa-arrow-circle-up");
      $("#moreContents").css('display', 'none');
    }
  });

  $("#token").on('paste', _ => {
    setTimeout(loadHarFromBox, 0);
  });
  $('#inputDatabaseName').keyup(loadHarFromBox);

}

function handleErrors() {
  if (hls) {
    hls.on(Hls.Events.ERROR, function (event, data) {
      var errorType = data.type;
      var errorDetails = data.details;
      var errorFatal = data.fatal;

      switch (data.details) {
        case hls.ErrorDetails.FRAG_LOAD_ERROR:
          // ....
          break;
        default:
          break;
      }
    });
  }
}

function loadHarFromBox() {
  let token = $("#token").val();
  if (token) {
    try {
      let harString = atob(token);
      let har = JSON.parse(harString);
      console.log(har);
      let request = har.request;
      let streamUrl = request.url;
      let cookies = request.cookies;
      let headers = request.headers;
      loadVideo(streamUrl, cookies, headers);
    } catch (e) {
      console.error(e);
    }
  }
}

function createConfig(cookies, headers) {
  return {
    liveDurationInfinity: true,
    xhrSetup: function (xhr, url) {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 1) {
          for (const header of headers) {
            if (header.name && !header.name.startsWith(":")) {
              xhr.setRequestHeader(header.name, header.value);
            }
          }
        }
      };
    },
    loader: CustomLoader
  };
}

function loadVideo(url, cookies, headers) {
  if (Hls.isSupported()) {
    const video = document.getElementById('video');

    const config = createConfig(cookies, headers);
    hls = new Hls(config);
    // bind them together
    hls.attachMedia(video);
    hls.on(Hls.Events.MEDIA_ATTACHED, function () {
      console.log("video and hls.js are now bound together !");
      hls.loadSource(url);
      hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        console.log("manifest loaded, found " + data.levels.length + " quality level");
      });
    });

  }
}


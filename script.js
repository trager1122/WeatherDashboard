$(document).ready(function () {
  const APIKey = "166a433c57516f51dfab1f7edaed8413";
  var queryURL;
  var today=moment().format("(M/D/YYYY)");
  var iconCode;
  var iconImg;

  $(".search-button").on("click", function(event){
      event.preventDefault();
      $(".current-conditions").css("border","solid");
      var citySearched=$(".searched-city").val();
      queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      citySearched +
      "&appid=" +
      APIKey;
      searchCall(queryURL);
      forecastCall(citySearched);
  });

  function uvRender(cityLat,cityLon){
      queryURL="https://api.openweathermap.org/data/2.5/uvi?lat=" + cityLat+ "&lon=" + cityLon + "&appid=" + APIKey;
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function(response) {
        console.log(response);
        var uvIndex=response.value;
        console.log(uvIndex);
        $('.uv-index').text('UV Index: ');
        $('.uv-value').text(uvIndex);
        if (uvIndex < 3){
          $('.uv-value').css("background-color", "green");
        }else if (uvIndex >= 3 && uvIndex < 6){
          $('.uv-value').css("background-color", "yellow");
        }else if (uvIndex >=6 && uvIndex < 8){
          $('.uv-value').css("background-color", "orange");
        }else if (uvIndex >=8 && uvIndex <= 10){
          $('.uv-value').css("background-color", "red");
        } else {$('.uv-value').css("background-color", "purple");}
    });
  }

  function forecastCall(citySearched){
    var cityForecasted = citySearched;
    queryURL="https://api.openweathermap.org/data/2.5/forecast/daily?q="+cityForecasted+"&cnt=5&appid="+APIKey;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response){
      console.log(response);
      $(".day").each(function (daysForecasted) {
        iconCode=response.list[daysForecasted].weather[0].icon;
        iconImg= '<img src=https://openweathermap.org/img/wn/'+ iconCode + '.png alt="weather icon"';
        var forecasttempF=(response.list[daysForecasted].temp.max - 273.15) * 1.8 + 32;
        $(".day").css({"background-color":"#00BFFF", "color": "white"});
        let today = moment();
        today.add(daysForecasted + 1,'days');
        let date = moment(today).format("M/D/YYYY");
        $(this).html('<p>'+date+'</p>'+
                     '<p>'+iconImg+'</p>'+
                     '<p>Temp: '+forecasttempF.toFixed(2)+'°F</p>'+
                     '<p>Humidity: '+response.list[daysForecasted].humidity+'%</p>'
        );
      })
    })
  } 

  function searchCall(queryURL){
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      iconCode=response.weather[0].icon;
      iconImg= '<img src=http://openweathermap.org/img/wn/'+ iconCode + '.png alt="weather icon"';
      $('.city-date-cond').html('<h1>' + response.name +' '+ today + ' '+ iconImg +'</h1>');
      var tempF = (response.main.temp - 273.15) * 1.8 + 32;
      $('.temperature').text('Temperature: ' + tempF.toFixed(1) +'°F');
      $('.humidity').text('Humidity: ' + (response.main.humidity)+'%');
      $('.wind-speed').text('Wind Speed: '+(response.wind.speed) + ' MPH');
      var cityLat = response.coord.lat;
      var cityLon = response.coord.lon;
      uvRender(cityLat,cityLon);
    })
  }    
})

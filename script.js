$(document).ready(function () {
  // Global Variables
  const APIKey = "166a433c57516f51dfab1f7edaed8413";
  var queryURL;
  var today=moment().format("(M/D/YYYY)");
  var iconCode;
  var iconImg;
  var citySearched;

  // Function for Rendering Page with search history and the weather for the most recently searched city
  function historyReload(){
    var storedHistory= JSON.parse(localStorage.getItem("searches")) || [];
    if (storedHistory.length !== null) {
      for (var i = 0; i < storedHistory.length; i++) {
          $(".search-history").prepend('<p><button class="history-button">'+storedHistory[i]+'</button></p>');
      }
      citySearched=storedHistory[storedHistory.length-1];
      queryURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        citySearched +
        "&appid=" +
        APIKey;
        searchCall();
        forecastCall();
    }
  }  

  historyReload();

  //Search Event and Function 
  $(".search-button").on("click", function(event){
      citySearched=$(".searched-city").val();
      queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      citySearched +
      "&appid=" +
      APIKey;
      searchCall();
      forecastCall();
      historyRender();
  });

  //UV Index Call and Classification/Color-Coding Function 
  function uvRender(cityLat,cityLon){
      queryURL="https://api.openweathermap.org/data/2.5/uvi?lat=" + cityLat+ "&lon=" + cityLon + "&appid=" + APIKey;
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function(response) {
        var uvIndex=response.value;
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
  
  //5-Day Forecast Call Function
  function forecastCall(){
    queryURL="https://api.openweathermap.org/data/2.5/forecast/daily?q="+citySearched+"&cnt=5&appid="+APIKey;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response){
        $(".day").each(function (daysForecasted) {
          $(".current-conditions").css("border","solid");
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

  //Search and call for current conditions functions based upon user input
  function searchCall(){
    var citiesSearched= JSON.parse(localStorage.getItem("searches")) || [];
    $.ajax({
      url: queryURL,
      method: "GET",
      error:function (data){
        if (citiesSearched.length !== 0){
          alert("Invalid user input or your choice from search history/last city searched was formatted improperly. Please refer to search directions.");
        }
      }
  }).then(function (response) {
      iconCode=response.weather[0].icon;
      iconImg= '<img src=https://openweathermap.org/img/wn/'+ iconCode + '.png alt="weather icon"';
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
  
  //Dynamic Search History Render Function that lists search from most recent to least recent including incorrect user input as a reminder
  function historyRender(){
    $(".search-history").empty();
    var searchHistory=JSON.parse(localStorage.getItem("searches")) || [];
    searchHistory.push(citySearched);
    localStorage.setItem("searches", JSON.stringify(searchHistory));
    var storedSearches = JSON.parse(localStorage.getItem("searches"));
    $(".searched-city").val("");
    if (storedSearches.length !== 0) {
      for (var i = 0; i < storedSearches.length; i++) {
        if (storedSearches[i] !==null){
          $(".search-history").prepend('<p><button class="history-button">'+storedSearches[i]+'</button></p>');
        }
      }
    }
  }

  //Event Function to call for weather of the city whose button was clicked
  $(".history-button").on("click", function(){
    citySearched=$(this).text();
    queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      citySearched +
      "&appid=" +
      APIKey;
    searchCall();
    forecastCall();
    })
})

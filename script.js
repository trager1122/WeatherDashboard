// This is our API key. Add your own API key between the ""
var APIKey = '166a433c57516f51dfab1f7edaed8413';
// Here we are building the URL we need to query the database
var queryURL =
  'https://api.openweathermap.org/data/2.5/weather?q=Bujumbura,Burundi&appid=' +
  APIKey;
// We then created an AJAX call
$.ajax({
  url: queryURL,
  method: 'GET',
}).then(function (response) {
  console.log('queryURL:', queryURL);
  console.log('response:', response);
  $('.city').html('<h1>' + response.name + 'Weather Details</h1>');
  $('.wind').html('<h1>' + response.wind.speed + ' Wind speed</h1>');
  $('.humidity').html('<h1>' + response.main.humidity + ' Humidity</h1>');
  // Convert the temp to fahrenheit
  var tempF = (response.main.temp - 273.15) * 1.8 + 32;
  // add temp content to html
  $('.temp').text('Temperature (K) ' + response.main.temp);
  $('.tempF').text('Temperature (F) ' + tempF.toFixed(2));
  // Log the data in the console as well
  console.log('Wind Speed: ' + response.wind.speed);
  console.log('Humidity: ' + response.main.humidity);
  console.log('Temperature (F): ' + tempF);
});
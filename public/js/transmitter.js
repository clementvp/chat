$(document).ready(function() {
  $('.button-collapse').sideNav({
    edge: 'right'
  });
});

var socket = io();
socket.on('connect', function () {
  socket.on('authenticated', function () {
    socket.emit("name",name);
    socket.on('update-liste',function(clients){
      $('.users').empty();
      $('#nav-mobile').empty();
      $.each(clients, function(index, value) {
        $('.users').append('<li class ="collection-item" id = '+index+' ><i class="fa fa-user" aria-hidden="true"></i>  <span> '+value+'</span></li>');
        $('#nav-mobile').append('<li><a><i class="fa fa-user" aria-hidden="true"></i> <span>'+value+'</span></a></li>');
        $(document.getElementById(index)).on('click', function(event)
        {
          console.log(index);
        });
      });
    });
    socket.on('earn-client',(name)=>{
      Materialize.toast(name+' is now online!', 4000);
    });
    socket.on('lost-client',(name)=>{
      Materialize.toast(name+' is now offline!', 4000);
    });
    socket.on('msg',function(msg){
      $(".messages").append("<li><p>"+msg+"</p></li>");
      var height = 0;
      $('ul li').each(function(i, value){
        height += parseInt($(this).height());
      });
      height += '';
      $('body').animate({scrollTop: height});
    });
  }).emit('authenticate', {token: jwt}); //send the jwt
});

socket.on("unauthorized", function(error, callback) {
  if (error.data.type == "UnauthorizedError" || error.data.code == "invalid_token") {
    $("body").empty();
    $("body").append("<h1>User's token has expired</h1>");
  };
});



/*
var socket = io();
socket.emit("name",name);
socket.on('update-liste',function(clients){
console.log(clients);
$('.users').empty();
$.each(clients, function(index, value) {
$('.users').append('<li class ="collection-item"><i class="fa fa-user" aria-hidden="true"></i>  <span> '+value+'</span></li>');
});
});
socket.on('earn-client',(name)=>{
Materialize.toast(name+' is now online!', 4000);
});
socket.on('lost-client',(name)=>{
Materialize.toast(name+' is now offline!', 4000);
});
socket.on('msg',function(msg){
$(".messages").append("<li>"+msg+"</li>");
var height = 0;
$('ul li').each(function(i, value){
height += parseInt($(this).height());
});
height += '';
$('body').animate({scrollTop: height});
});
*/

$('.formulaire').submit(function(e){
  var msg = $('#first_name').val();
  $(".messages").append("<li><p>"+name +": "+ msg+"</p> </li>");
  socket.emit('message',msg);
  $('#first_name').val("");
  var height = 0;
  $('ul li').each(function(i, value){
    height += parseInt($(this).height());
  });
  height += '';
  $('body').animate({scrollTop: height});
  return false;
});

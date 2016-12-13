$(document).ready(function() {
  $('.button-collapse').sideNav({
    edge: 'right'
  });
});

var socket = io();
socket.on('connect', function () {
  socket.on('authenticated', function () {
    var userWriting = [];
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
    socket.on("someone-writing",function(username){
      if(userWriting.indexOf(username) == -1){
        userWriting.push(username);
        if(userWriting.length == 1){
         $(".writing").html(username + " is writing....");      
        }else if(userWriting.length > 1 ){
          userWritingList = userWriting.join();
          $(".writing").html(userWriting + " are writing....");
        }

      }
    });
    socket.on("someone-un-writing", function (username) {
      if (userWriting.indexOf(username) != -1) {
        userWriting.splice(userWriting.indexOf(username), 1);  
      }
      console.log("Array => ", userWriting);
      console.log("User => ", username);
      
      userWritingList = userWriting.join();
      console.log("userWritingList = " + userWritingList)
        if(userWriting.length >= 1){
         $(".writing").html(userWritingList + " is writing....");      
        }else{
          $(".writing").html("");
        }
    });
    $("#first_name").on("keyup",function(){
      if($(this).val() == ""){
        socket.emit("un-writing",name);
      }else{
        socket.emit("writing",name);
      }     
        
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
  var regex = /(<([^>]+)>)/ig;
  msg = msg.replace(regex,"");
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

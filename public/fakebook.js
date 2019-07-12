console.log("in the script");

// Calls every time the page has been loaded. Fixes the bug where user
// couldn't do anything after signing up because the HTML hadn't been created
document.addEventListener('DOMContentLoaded', function () {
   // Redirects the user to login page immediately after creating an account
   var url = document.URL;
   if (url.includes("set")) {
      console.log("Everything totally works and Daniel is smart");
      load_sign_up_page();
   }
}, false);

function login(){
  var uname = document.getElementById("login_uname").value
  var psw =  document.getElementById("login_psw").value
   $.post("/login", {uname: uname, psw: psw}, function(data, status){
      load_home_page()
   })
}

function new_message() {
   var message_text = document.getElementById("message_text").value
   console.log(message_text)
   $.post("/new_message", { message_text: message_text}, function (data, status) {
      console.log("Back from /new_message")
      load_home_page()
   })
}
function new_comment() {
   var comment_text = document.getElementById("comment_text").value
   console.log(comment_text)
   $.post("/new_comment", { comment_text: comment_text }, function (data, status) {
      console.log("Back from /new_comment")
      load_home_page()
   })
}

function sign_up() {
   var uname = document.getElementById("sign_up_uname").value
   var psw = document.getElementById("sign_up_psw").value
   var dname = document.getElementById("sign_up_dname").value
   console.log(uname)
   console.log(psw)
   console.log(dname)
   $.post("/sign_up", {uname: uname, psw: psw, dname: dname}, function (data, status) {
      console.log("Back from /Sign_up")
      alert("Your account has been created! Sign in so you can have fun with your friends")
      load_home_page()
   })
}

function load_home_page() {
   var html = ""
   var profile_pic = ""
   $.post("/user", {}, function (data, status) {
      if (status == "success") {
               //alert(JSON.stringify(data))
               var count = 0;
               for(var i = 0; i < data.result.rows.length; i++){
                  $display_name = data.result.rows[i].display_name;
                  $time_day = data.result.rows[i].message_time.substring(8, 10);
                  $time_month = data.result.rows[i].message_time.substring(5, 7);
                  $time_year = data.result.rows[i].message_time.substring(0, 4);
                  $month_array = ['No_zero', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                  $message = data.result.rows[i].message_text;

                  html += `<li class="post">
                  <div class="post__title">
                  <h3>` +  $display_name + `</h3>
                  <p>` + $month_array[parseInt($time_month)] + ` ` + $time_day + `, ` + $time_year + `</p>
                  </div>
                  <div class="post_content">` + $message + `</div>
                  <a class="post_comment" onclick="goto_comments(`+ count +`)"><i>comment</i></a>
                  </li>`;
                  count++;
               }

           if (data.val == "0") {
               load_profile_page();
               console.log("no valid user");
            }
            else if (data.val == "1") {
               document.getElementById("form").style.display = "none";
               document.getElementById("content").style.display = "block";
               document.getElementById("content").innerHTML = html;

            //   var username = "<%= Session['current_display_name'] %>";
            //   var username = sessionStorage.getItem("current_display_name");
              $.post("/getCurrentUser", {}, function (data, status) {
                 if (status == "success") {
                    var username = data.current_display_name;
                  //   alert(username);
                    document.getElementById("profile_picture").innerHTML = username;
                 }
               })

               document.getElementById("main_head").style.display = "flex";
               document.getElementById("login_form").style.display = "none";
               document.getElementById("sign_up_form").style.display = "none";
               document.getElementById("new_user_message").style.display = "none";
               document.getElementById("new_comment").style.display = "none";
               console.log("there is a valid user");
            }
      }
   })
}

function goto_comments(i) {
   console.log("in Comments");
   document.getElementById("form").style.display = "none";
   document.getElementById("main_head").style.display = "none";
   document.getElementById("login_form").style.display = "none";
   document.getElementById("sign_up_form").style.display = "none";
   document.getElementById("new_user_message").style.display = "none";

   var html = ""
   var message_id
   $.post("/user", {}, function (data, status) {
      if (status == "success") {
            message_id = data.result.rows[i].id;
         $.post("/getCommentFeed", { message_id: message_id }, function (comment_data, status) {
            console.log("Back from /getCommetFeed")
            var comments_feed = ""
            for (var k = 0; k < data.result.rows.length; i++) {
               var comment_display_name = comment_data.result.rows[k].display_name;
               var current_comment = comment_data.result.rows[k].display_name;
               comments_feed += `<li class="post">
                  <div class="post__title">
                  <h3>` + comment_display_name + `</h3>
                        </div>
                        <div class="post_content">` + current_comment + `</div>
                        </li>`;
            }
            document.getElementById("comment_feed").style.display = "block";

         })
            $.post("/set_message_id", { message_id: message_id }, function (message_data, status) {
               console.log("Back from /set_message_id")
               console.log(message_id)
            })
            console.log("in goto_comments(), message_id: " + message_id)
            $display_name = data.result.rows[i].display_name;
            $time_day = data.result.rows[i].message_time.substring(8, 10);
            $time_month = data.result.rows[i].message_time.substring(5, 7);
            $time_year = data.result.rows[i].message_time.substring(0, 4);
            $month_array = ['No_zero', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            $message = data.result.rows[i].message_text;

            html += `<li class="post">
            <div class="post__title">
            <h3>` + $display_name + `</h3>
            <p>` + $month_array[parseInt($time_month)] + ` ` + $time_day + `, ` + $time_year + `</p>
                  </div>
                  <div class="post_content">` + $message + `</div>
                  </li>`;
            }
            document.getElementById("content").style.display = "block";
            document.getElementById("content").innerHTML = html;
            document.getElementById("new_comment").style.display = "block";

         })

}

function load_comment_page() {
   document.getElementById("form").style.display = "block";
   document.getElementById("new_comment").style.display = "none";
   document.getElementById("content").style.display = "none";
   document.getElementById("main_head").style.display = "none";
   document.getElementById("login_form").style.display = "none";
   document.getElementById("sign_up_form").style.display = "none";
   document.getElementById("new_user_message").style.display = "none";
}

function load_profile_page() {
   document.getElementById("new_comment").style.display = "none";
   document.getElementById("form").style.display = "none";
   document.getElementById("content").style.display = "none";
   document.getElementById("main_head").style.display = "none";
   document.getElementById("login_form").style.display = "inline-block";
   document.getElementById("sign_up_form").style.display = "none";
   document.getElementById("new_user_message").style.display = "none";
}

function load_sign_up_page() {
   document.getElementById("new_comment").style.display = "none";
   document.getElementById("form").style.display = "none";
   document.getElementById("content").style.display = "none";
   document.getElementById("main_head").style.display = "none";
   document.getElementById("login_form").style.display = "none";
   document.getElementById("sign_up_form").style.display = "inline-block";
   document.getElementById("new_user_message").style.display = "none";
}
function search(text) {
   let url = "home.php?search=" + text;
   window.location = url;
}

function destroy_content() {
   // Destroy half of what's on the page
   console.log("Enter Thanos");
   var element = document.getElementById("content");
   element.parentNode.removeChild(element);
   var element2 = document.getElementById("main_head");
   element2.parentNode.removeChild(element2);
   var element3 = document.getElementById("spacing");
   element3.innerHTML = "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";
}

function create_message_page() {
   var x = document.getElementById("form");
   x.style.display = "block";
}

function add_content() {
   var parent = document.createElement("p");
   var node = document.createTextNode("This is new.");
   parent.appendChild(node);
   var element = document.getElementById("content_parent");
   element.appendChild(parent);
   parent.setAttribute('id', "content");

   console.log("a child is born");
}

function makeRequest(current_id, message_text) {
   url = "https://polar-plateau-20469.herokuapp.com/fakebook/new_message.php";
   // name=value pairs we'll be sending to the server.
   var data = 'action=ping&testName=testValue';

   // GET requires we add the name=value pairs to the end of the URL.
   // ?current_id = 6 & message_text=Hello
   url += '?' + "current_id=" + current_id + "&message_text=" + message_text;

   httpRequest = new XMLHttpRequest();
   if (!httpRequest) {
      alert('ERROR: httpRequest is broken');
      return false;
   }
   else {
      httpRequest.onreadystatechange = alertContents;
      httpRequest.open("GET", url, true);
      httpRequest.send();
   }
}
function alertContents() {
   if (httpRequest.readyState == 4) {
      if (httpRequest.status == 200) {
         console.log("Message Successfully loaded");
      }
      else {
         alert('Problem in else in alert contents');
         alert(httpRequest.status);
      }
   }
}
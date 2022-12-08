$(document).ready(function () {
    var lastUrl = [];
    var returnCode;
    $("#btnreturn").hide();
    $("#pages").hide();

    $("#btnreturn").click(function(){
        if(returnCode==1){
            url = lastUrl[1];
            if(url.includes("/movie/")){
                $.getJSON(url, function (data) {
                    movie(data);
                });
            }
            else{
                $.getJSON(url, function (data) {
                    tv(data);
                });
            }
            returnCode=0;
        }
        else{
            search(lastUrl[0]);
        }
    });

    $("#btntrend").click(function(){
        url = "https://api.themoviedb.org/3/trending/all/day?api_key=596a559ed3e4a3408502d51411f3d607&page=1";
        lastUrl[0] = url; lastUrl[1] = null;
        lastUrl[2] = "https://api.themoviedb.org/3/trending/all/day?api_key=596a559ed3e4a3408502d51411f3d607&page="
        search(url);
    });

    $("#searchbtn").click(function(){
        var input = $("#userSearch").val();
        var type = $("#srcoption").val();
        url = "https://api.themoviedb.org/3/search/"+type+"?query="+input+"&api_key=596a559ed3e4a3408502d51411f3d607&language=en-US&page=1&include_adult=false";
        lastUrl[0] = url; lastUrl[1] = null;
        lastUrl[2] = "https://api.themoviedb.org/3/search/"+type+"?query="+input+"&api_key=596a559ed3e4a3408502d51411f3d607&language=en-US&include_adult=false&page=";
        search(url);
    });

    image = "https://image.tmdb.org/t/p/w500/";


    function search(url) {
        $("#btnreturn").hide();
        $("#pages").show();
        $("#app").empty();
        $("#app").html("Searching ...");
        $("#pages").html("Pages: ");

        $.getJSON(url, function (data) {
            if (data.total_pages > 5) {
                for (i = 1; i <= 5; i++) {
                    $("#pages").append("<a id='page"+i+"' class='page' href='#' data-val='"+i+"'>" + i + "</a> ");
                }
            }
            else {
                for (i = 1; i <= data.total_pages; i++) {
                    $("#pages").append("<a class='page' href='#' data-val='"+i+"'>" + i + "</a> ");
                }
            }

            //Display search results
            $("#app").html("<br><br>");

            $("#app").append('<div id="container">');
            for (i = 0; i < data.results.length; i++) {
                mediatype="";
                if(url.includes("/search/tv")){
                    mediatype="tv";
                }
                else if (url.includes("/search/movie")){
                    mediatype="movie";
                }
                else if (url.includes("/search/person")){
                    mediatype="person";
                }
                else{
                    mediatype=data.results[i].media_type;
                }

                //each result item will have it's own "cell"
                $("#container").append('<div class="cell" id="cell'+i+'" data-media="'+mediatype+'" data-id="'+data.results[i].id+'"></div>');
                
                /*$(".cell").click(function(){
                    details(data.results.media_type, +data.results.id);
                });*/
                //add the image to the cell
                if (data.results[i].hasOwnProperty('poster_path')) {
                    if(data.results[i].poster_path){
                        poster = image + data.results[i].poster_path;
                        $("#cell"+i).append('<img src='+poster+' alt="No Poster" style="height:150px">');
                    }
                    else{
                        $("#cell"+i).append('<div class="altimg">No Image</div>');
                    }
                }
                else{
                    if(data.results[i].profile_path){
                        profile = image + data.results[i].profile_path;
                        $("#cell"+i).append('<img src='+profile+' alt="No Profile" style="height:150px">');
                    }
                    else{
                        $("#cell"+i).append('<div class="altimg">No Image</div>');
                    }
                }
                
                $("#cell"+i).append('</br>');
                
                //add the title or name
                if (data.results[i].hasOwnProperty('name')) {
                    $("#cell"+i).append("<h3>"+data.results[i].name+"</h3>");
                }
                else{
                    $("#cell"+i).append("<h3>"+data.results[i].title+"</h3>");
                }
                
                //brake after cell
                //$("#container").append('<hr>');
            };
            //add some extra space
            $("#app").append('<br><br><br><br><br>');

            $("a").click(function(){
                i = $(this).data('val');
                newurl = lastUrl[2]+i;
                search(newurl);
            });

            $(".cell").on('click', function (){
                media = document.getElementById($(this).attr("id")).getAttribute('data-media');
                id = document.getElementById($(this).attr("id")).getAttribute('data-id');
                details(media, id);
            });
        });
    };

    $("#layout").change(function(){
        value = $(this).val()
        if(value=="grid"){
            $(".cell").css("width", "19%").css("text-align","center");
        }
        else{
            $(".cell").css("width", "99%").css("text-align","left");
        }
    });

    /*$(".cell").click(function(){
        media = $(this).getAttribute('data-media');
        id = $(this).getAttribute('data-id');
        console.log(media);
        console.log(id);
        details(media, id);
    });
    
    $(".cell").on('click', function (){
        console.log("hello");
        media = document.getElementById($(this).attr("id")).getAttribute('data-media');
        console.log(media);
    });*/

    function details(type, id){
        $("#btnreturn").show();
        $("#pages").hide();
        $("#app").empty();
        $("#app").html("Loading details...");

        url = "https://api.themoviedb.org/3/"+type+"/"+id+"?api_key=596a559ed3e4a3408502d51411f3d607&language=en-US";
        $.getJSON(url, function (data) {
            if (type=="movie"){
                lastUrl[1]=url;
                movie(data);
            }
            else if (type=="tv"){
                lastUrl[1]=url;
                tv(data);
            }
            else {
                person(data);
            }
        });
    }

    function movie(data){
        $("#app").html("<br><br>");
        $("#app").append("<div id='movdisplay'></div>");

        $("#movdisplay").html("<div id='movcol1' class='col'></div><div id='movcol2' class='col'></div><div id='movcol3' class='col'></div>");

        $("#movcol2").append("<h1>"+data.title+"</h1><br>");
        if(data.poster_path){
            poster = image + data.poster_path;
            $("#movcol1").append('<img src='+poster+' alt="No Poster" style="height:400px">');
        }
        else{
            $("#movcol1").append('<div class="altimg">No Image</div>');
        }
        $("#movcol2").append("Release Date: "+data.release_date+"<br>");
        $("#movcol2").append("Genres: ");
        for (i = 0; i < data.genres.length; i++) {
            if(i<data.genres.length-1){$("#movcol2").append(data.genres[i].name+", ");}
            else{$("#movcol2").append(data.genres[i].name);}
        };
        $("#movcol2").append("<br>");
        $("#movcol2").append("Runtime: "+data.runtime+" Minutes<br>");
        $("#movcol2").append("Budget: $"+data.budget+"<br>");
        $("#movcol2").append("Revenue: $"+data.revenue+"<br>");
        $("#movcol2").append("Production Companies: ");
        for (i = 0; i < data.production_companies.length; i++) {
            if(i<data.genres.length-1){$("#movcol2").append(data.production_companies[i].name+", ");}
            else{$("#movcol2").append(data.production_companies[i].name);}
        };
        $("#movcol2").append("<br>");
        $("#movcol2").append("Spoken Languages: ");
        for (i = 0; i < data.spoken_languages.length; i++) {
            if(i<data.spoken_languages.length-1){$("#movcol2").append(data.spoken_languages[i].english_name+", ");}
            else{$("#movcol2").append(data.spoken_languages[i].english_name);}
        };
        $("#movcol2").append("<br>");
        $("#movcol2").append("Average Rating: "+data.vote_average+"<br>");
        $("#movcol2").append("Raving Count: "+data.vote_count+"<br>");
        $("#movcol2").append("Overview: "+data.overview+"<br>");
        $("#movcol2").append("<br>");
        //Search the Cast
        url = "https://api.themoviedb.org/3/movie/"+data.id+"/credits?api_key=596a559ed3e4a3408502d51411f3d607&language=en-US";
        cast(url);
    }

    function tv(data){
        $("#app").html("<br><br>");
        $("#app").append("<div id='movdisplay'></div>");

        $("#movdisplay").html("<div id='movcol1' class='col'></div><div id='movcol2' class='col'></div><div id='movcol3' class='col'></div>");


        $("#movcol2").append("<h1>"+data.name+"</h1>");
        if(data.poster_path){
            poster = image + data.poster_path;
            $("#movcol1").append('<img src='+poster+' alt="No Poster" style="height:400px">');
        }
        else{
            $("#movcol1").append('<div class="altimg">No Image</div>');
        }
        $("#movcol2").append("First Aired: "+data.first_air_date+"<br>");
        if(data.last_air_date){
            $("#movcol2").append("Last Aired: "+data.last_air_date+"<br>");
        }
        $("#movcol2").append("Genres: ");
        for (i = 0; i < data.genres.length; i++) {
            if(i<data.genres.length-1){$("#movcol2").append(data.genres[i].name+", ");}
            else{$("#movcol2").append(data.genres[i].name);}
        };
        $("#movcol2").append("<br>");
        $("#movcol2").append("Network(s): ");
        for (i = 0; i < data.networks.length; i++) {
            if(i<data.networks.length-1){$("#movcol2").append(data.networks[i].name+", ");}
            else{$("#movcol2").append(data.networks[i].name);}
        };
        $("#movcol2").append("<br>");
        $("#movcol2").append("Seasons: "+data.seasons.length+"<br>");
        $("#movcol2").append("Status: "+data.status+"<br>");
        $("#movcol2").append("Spoken Languages: ");
        for (i = 0; i < data.spoken_languages.length; i++) {
            if(i<data.spoken_languages.length-1){$("#movcol2").append(data.spoken_languages[i].english_name+", ");}
            else{$("#movcol2").append(data.spoken_languages[i].english_name);}
        };
        $("#movcol2").append("<br>");
        $("#movcol2").append("Average Rating: "+data.vote_average+"<br>");
        $("#movcol2").append("Raving Count: "+data.vote_count+"<br>");
        $("#movcol2").append("Overview: "+data.overview+"<br>");
        $("#movcol2").append("<br>");
        //Search the Cast
        url = "https://api.themoviedb.org/3/tv/"+data.id+"/credits?api_key=596a559ed3e4a3408502d51411f3d607&language=en-US";
        cast(url);
    }

    function cast(url){
        $("#movcol3").append("Top Cast: <br>");
        $.getJSON(url, function (data) {
            if(!data.cast.length > 0){
                $("#movcol3").append("Unknown");
                return;
            }

            if(data.cast.length<10){
                for (i = 0; i < data.cast.length; i++) {
                    $("#movcol3").append("<div id='Cast"+i+"' class=castMem data-id="+data.cast[i].id+"><b>"+data.cast[i].name+"</b> as "+data.cast[i].character+"</div>");
                };
            }
            else{
                for (i = 0; i < 10; i++) {
                    $("#movcol3").append("<div id='Cast"+i+"' class=castMem data-id="+data.cast[i].id+"><b>"+data.cast[i].name+"</b> as "+data.cast[i].character+"</div>");
                };
            }
            
            $(".castMem").on('click', function (){
                id = document.getElementById($(this).attr("id")).getAttribute('data-id');
                returnCode=1;
                details("person", id);
            });
        });
    }

    function person(data){
        $("#app").html("<br><br>");
        $("#app").append("<div id='movdisplay'></div>");

        $("#movdisplay").html("<div id='movcol1' class='col'></div><div id='percol2' class='col'></div><div id='percol3' class='col'></div>");


        $("#percol2").append("<h1>"+data.name+"<h1>");
        if(data.profile_path){
            profile = image + data.profile_path;
            $("#movcol1").append('<img src='+profile+' alt="No Image" style="height:400px">');
        }
        else{
            $("#movcol1").append('<div class="altimg">No Image</div>');
        }
        $("#percol2").append("Date of Birth: "+data.birthday+"<br>");
        $("#percol2").append("Place of Birth: "+data.place_of_birth+"<br>");
        if(data.deathday){
            $("#percol2").append("Date of death: "+data.deathday+"<br>");
        }

        if(data.gender==1){
            $("#percol2").append("Gender: Female<br>");
        }
        else if(data.gender==2){
            $("#percol2").append("Gender: Male<br>");
        }
        else{
            $("#percol2").append("Gender: -<br>");
        }
        $("#percol2").append("Also Known As: ");
        if(data.also_known_as.length<5){
            for (i = 0; i < data.also_known_as.length; i++) {
                if(i<(data.also_known_as.length-1)){$("#percol2").append(data.also_known_as[i]+", ");}
                else{$("#percol2").append(data.also_known_as[i]);}
            };
        }
        else{
            for (i = 0; i < 5; i++) {
                if(i<4){$("#percol2").append(data.also_known_as[i]+", ");}
                else{$("#percol2").append(data.also_known_as[i]);}
            };
        }
        $("#percol2").append("<br>");
        $("#percol3").append("<b>Biography: </b>"+data.biography+"<br>");
    }
});

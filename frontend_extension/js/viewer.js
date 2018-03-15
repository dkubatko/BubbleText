/*
Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

    http://aws.amazon.com/apache2.0/

or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/*

  Set Javascript specific to the extension viewer view in this file.

*/

var curr_choice = -1;

$(document).ready(function() {
    $.ajax(
        {
            url: "http://127.0.0.1:5000/streamer/123456/texts",
            type: "GET",
            success: function(data) {
             populateButtons(data);   
            },
        }
    )
});

function populateButtons(data) {
    for (var i = 0; i < data.buttons.length; i++) {
        var $btn = $("<button class='button'></button>");
        $btn.attr("id", String(data.buttons[i].text_id));
        $btn.attr("onclick", "choice(" + data.buttons[i].text_id + ")");
        $btn.text(data.buttons[i].text);
        $("#buttons").append($btn);
    }
    
    var $buybtn = $("<button class='button disabled' id='buy'></button>");
    $buybtn.attr("onclick", "purchase()");
    $buybtn.text("Buy: 10 bits");
    // disable until something is chosen
    $buybtn.prop("disabled", true);
    $("#buttons").append($buybtn);
}

function choice(id) {
    console.log("Clicked");
    if (curr_choice != -1) {
        $("#" + curr_choice).removeClass("chosen");
    }
    // if unclicked the button
    if (id == curr_choice) {
        console.log("Here");
        $("#" + curr_choice).removeClass("chosen");
        curr_choice = -1;
        // make buy button back disabled
        $("#buy").addClass("disabled");
        $("#buy").prop("disabled", true);
        return;
    }
    curr_choice = id;
    $("#" + id).addClass("chosen");
    // make buy button enabled
    $("#buy").removeClass("disabled");
    $("#buy").prop("disabled", false);
}

function purchase() {
    alert("Purchasing product #" + curr_choice);
}
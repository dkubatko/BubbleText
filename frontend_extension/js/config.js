/*
Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

    http://aws.amazon.com/apache2.0/

or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/*

  Set Javascript specific to the extension configuration view in this file.

*/

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

function updateButtons() {
    // clear buttons
    $("#buttons").html("");
    // reload buttons
    $.ajax(
        {
            url: "http://127.0.0.1:5000/streamer/123456/texts",
            type: "GET",
            success: function(data) {
             populateButtons(data);   
            },
        }
    )
}

function populateButtons(data) {
    for (var i = 0; i < data.buttons.length; i++) {
        var $div_wrapper = $("<div class='btndiv'></div>");
        var $delete = $("<button class='delete'>✖</button>");
        $delete.attr("onclick", "deleteChoice(" + data.buttons[i].text_id + ")");
        var $btn = $("<button class='button'></button>");
        $btn.attr("id", String(data.buttons[i].text_id));
//        $btn.attr("onclick", "choice(" + data.buttons[i].text_id + ")");
        $btn.text(data.buttons[i].text);
        $div_wrapper.append($delete);
        $div_wrapper.append($btn)
        $("#buttons").append($div_wrapper);
    }
}

function addChoice() {
    var text = $("#text").val();
    if (text) {
        $.ajax(
        {
            url: "http://127.0.0.1:5000/streamer/123456/add",
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({"text": text}),
            success: function(data) {
                updateButtons();
                $("#log").append("Deleted " + text + " with success " + data.success + "<br>");
            },
        }
    )
    }
}

function deleteChoice(choice) {
    $.ajax(
        {
            url: "http://127.0.0.1:5000/streamer/123456/delete",
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify({"text_id": choice}),
            success: function(data) {
                updateButtons();
             $("#log").append("Removed " + choice + " with success " + data.success + "<br>");
            },
        }
    )
}
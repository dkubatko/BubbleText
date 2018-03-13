/*
Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

    http://aws.amazon.com/apache2.0/

or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/*

  Set Javascript specific to the extension configuration view in this file.

*/

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
             $("#log").append("Added " + text + " with success " + data.success + "<br>");
            },
        }
    )
    }
}
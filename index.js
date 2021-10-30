(function () {
    var myConnector = tableau.makeConnector();

    myConnector.init = function (initCallback) {

        tableau.authType = tableau.authTypeEnum.basic;
        initCallback();
    };

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "priority_name",
            alias: "priority",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "subject",
            alias: "subject",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "status_name",
            alias: "status",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "responder_name",
            alias: "agent",
            dataType: tableau.dataTypeEnum.string
        },];

        var tableSchema = {
            id: "freshdeskFeed",
            alias: "Freshdesk Ticket Info",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };



    myConnector.getData = function (table, doneCallback) {
        const apiKey = tableau.password;
        function loop(x) {



            $.ajax({
                type: "GET",
                url: `https://syssero.freshdesk.com/helpdesk/tickets/filter/all_tickets?format=json&page=${x}`,
                dataType: 'json',
                headers: {
                    "Authorization": "Basic " + btoa(apiKey + ":123")
                },
                success: function (resp, status, xhr) {
                    var response = resp,
                        tableData = [];
                    console.log(xhr)
                    console.log(response)

                    if (resp.length > 0) {
                        // Iterate over the JSON object
                        for (var i = 0, len = response.length; i < len; i++) {
                            tableData.push({
                                "id": response[i].display_id,
                                "priority_name": response[i].priority_name,
                                "subject": response[i].subject,
                                "status_name": response[i].status_name,
                                "responder_name": response[i].responder_name,

                            });
                        }

                        table.appendRows(tableData);
                        loop(x + 1)

                    } else { doneCallback(); }

                }

            });

        }

        loop(1)

    };

    tableau.registerConnector(myConnector);

    $(document).ready(function () {

        $("#submitButton").click(function () {
            if ($("#key").val().length > 0) {
                tableau.password = $("#key").val()
                tableau.connectionName = "Freshdesk Feed";

                tableau.submit();
            } else {
                alert('Please enter API key')
            }



        });
    });
})();
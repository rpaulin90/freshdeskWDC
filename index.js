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
        },
        {
            id: "source",
            alias: "source",
            dataType: tableau.dataTypeEnum.int
        },
        {
            id: "priority_name",
            alias: "priority",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "created_at",
            alias: "Created at",
            dataType: tableau.dataTypeEnum.datetime
        },
        {
            id: "updated_at",
            alias: "updated_at",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "first_response_escalated",
            alias: "first_response_escalated",
            dataType: tableau.dataTypeEnum.bool
        },
        {
            id: "documentation_required",
            alias: "documentation_required",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "ticket_type",
            alias: "ticket_type",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "group_id",
            alias: "group_id",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "due_by",
            alias: "due_by",
            dataType: tableau.dataTypeEnum.datetime
        },
        {
            id: "requester_name",
            alias: "requester_name",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "requester_id",
            alias: "requester_id",
            dataType: tableau.dataTypeEnum.string
        },
        {
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
                        var dateFormat = "Y-MM-DD HH:mm:ss";
                        // Iterate over the JSON object
                        for (var i = 0, len = response.length; i < len; i++) {
                            tableData.push({
                                "id": (response[i].display_id).toString(),
                                "source": response[i].source,
                                "priority_name": response[i].priority_name,
                                "created_at": moment(response[i].created_at).format(dateFormat),
                                "updated_at": moment(response[i].updated_at).format(dateFormat),
                                "first_response_escalated": response[i].fr_escalated,
                                "documentation_required": (response[i].custom_field.cf_documentation_required_876066 == null ? 'Empty' : response[i].custom_field.cf_documentation_required_876066),
                                "ticket_type": (response[i].ticket_type == null ? 'Empty' : response[i].ticket_type),
                                "group_id": (response[i].group_id == null ? 123 : response[i].group_id).toString(),
                                "due_by": moment(response[i].due_by).format(dateFormat),
                                "requester_name": response[i].requester_name,
                                "requester_id": (response[i].requester_id).toString(),
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
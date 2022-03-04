$(document).ready(function () {
    var intervalId = window.setInterval(function () {
        $("#timeout").modal('show');
        $("#gettoken").addClass('btn btn-danger');
        sessionStorage.clear();
        console.log("Session Timeout")
    }, 3599999);

    $("#report").change(function () {

        var report = $('#report option:selected').text();

        if (report == "teamPerformanceTotal") {
            $("#dategroup").show();
            $("#skillgroup").hide();
            $("#teamgroup").show();
            $("#agentgroup").hide();
        }

        if (report == 'skillSummaries' || report == 'serviceLevelSummaries') {
            $("#dategroup").show();
            $("#skillgroup").show();
            $("#teamgroup").hide();
            $("#agentgroup").hide();
        }

        if (report == 'agentPerformance') {
            $("#dategroup").show();
            $("#skillgroup").hide();
            $("#teamgroup").hide();
            $("#agentgroup").show();
        }

    });

    printreport.addEventListener('click', function () {

        if ($('#report option:selected').text() === "teamPerformanceTotal") {
            var reportTitle = '<h1 class="display-4">' + $('#report option:selected').text() + ' (' + $('#teams option:selected').text() + ')</h1>'
        }

        if ($('#report option:selected').text() === 'skillSummaries' || $('#report option:selected').text() === 'serviceLevelSummaries') {
            var reportTitle = '<h1 class="display-4">' + $('#report option:selected').text() + ' (' + $('#skills option:selected').text() + ')</h1>'
        }

        if ($('#report option:selected').text() === 'agentPerformance') {
            var reportTitle = '<h1>' + $('#report option:selected').text() + ' (' + $('#agents option:selected').text() + ')</h1>'
        }

        const chart = document.getElementById('myChart').toDataURL();
        const reportData = document.getElementById('data').innerHTML;

        let windowContent = '<!DOCTYPE html>';
        windowContent += '<html>';
        windowContent += '<head><title>' + $('#report option:selected').text() + ' ' + $('#agents option:selected').text() + '</title></head>';
        windowContent += '<body>';
        windowContent += '<p align="center">' + reportTitle + '</p>';
        windowContent += '<br/><br/>'
        windowContent += '<p align="center">' + $('#startDate').val() + ' - ' + $('#endDate').val() + '</p>';
        windowContent += '<br/><br/>'
        windowContent += '<img src="' + chart + '">';
        windowContent += '<br/><br/>'
        windowContent += '<p align="center">' + reportData + '</p>';
        windowContent += '</body>';
        windowContent += '</html>';

        const printWin = window.open('', '', 'width=' + screen.availWidth + ',height=' + screen.availHeight);
        printWin.document.open();
        printWin.document.write(windowContent);

        printWin.document.addEventListener('load', function () {
            printWin.focus();
            printWin.print();
            printWin.document.close();
            printWin.close();
        }, true);

    })

    gettoken.addEventListener('click', function () {

        token = $("#access_token").val();

        newtoken = token.replace("StudioLogin::cxone::", "")

        access_token = newtoken.replace("::https://na1.nice-incontact.com::1", "")

        console.log(access_token);

        sessionStorage.setItem("access_token", access_token);

        $("#gettoken").addClass('btn btn-success');

        $("#reportfrm").toggle();

        var settings = {
            "url": "https://api-na1.niceincontact.com/incontactapi/services/v23.0/teams?isActive=true",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "accept": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("access_token"),
            },
        };

        $.ajax(settings).done(function (response) {

            teams = '<select class="form-control" id="team">'

            $.each(response.teams, function (index, value) {
                teams += '<option value="' + value.teamId + '">' + value.teamName + '</option>';
            });
            teams += '</select>';

            $('#teams').html(teams);
        });

        var settings = {
            "url": "https://api-na1.niceincontact.com/incontactapi/services/v23.0/skills?isActive=true",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "accept": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("access_token"),
            },
        };

        $.ajax(settings).done(function (response) {

            skills = '<select class="form-control" id="skill">'

            $.each(response.skills, function (index, value) {
                skills += '<option value="' + value.skillId + '">' + value.skillName + '</option>';
            });
            skills += '</select>';

            $('#skills').html(skills);
        });

        var settings = {
            "url": "https://api-na1.niceincontact.com/incontactapi/services/v23.0/agents?isActive=true",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "accept": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("access_token"),
            },
        };

        $.ajax(settings).done(function (response) {

            agents = '<select class="form-control" id="agent">'

            $.each(response.agents, function (index, value) {
                agents += '<option value="' + value.agentId + '">' + value.firstName + ' ' + value.lastName + '</option>';
            });
            agents += '</select>';

            $('#agents').html(agents);
        });

    });

    getreport.addEventListener('click', function () {

        $('#myChart').remove();
        $('#results').append('<canvas id="myChart" width="400" height="400"></canvas>');

        var report = $('#report option:selected').text();

        if (report == "teamPerformanceTotal") {
            $('#reportTitle').html('<h1 class="display-4">' + report + ' (' + $('#teams option:selected').text() + ')</h1>')
        }

        if (report == 'skillSummaries' || report == 'serviceLevelSummaries') {
            $('#reportTitle').html('<h1 class="display-4">' + report + ' (' + $('#skills option:selected').text() + ')</h1>')
        }

        if (report == 'agentPerformance') {
            $('#reportTitle').html('<h1 class="display-4">' + report + ' (' + $('#agents option:selected').text() + ')</h1>')
        }

        if (report == "teamPerformanceTotal") {

            var charttype = $("#charttype").val();

            var settings = {
                "url": "https://api-na1.niceincontact.com/incontactapi/services/v23.0/teams/" + $('#teams option:selected').val() + "/performance-total?startDate=" + $('#startDate').val() + "&endDate=" + $('#endDate').val(),
                "method": "GET",
                "timeout": 0,
                "headers": {
                    "accept": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("access_token"),
                },
            };

            $.ajax(settings).done(function (response) {

                agentOffered = response.teamPerformanceTotal[0].agentOffered;
                inboundHandled = response.teamPerformanceTotal[0].inboundHandled;
                outboundHandled = response.teamPerformanceTotal[0].outboundHandled;
                totalHandled = response.teamPerformanceTotal[0].totalHandled;
                totalAvgHandled = response.teamPerformanceTotal[0].totalAvgHandled;
                refused = response.teamPerformanceTotal[0].refused;
                workingRate = response.teamPerformanceTotal[0].workingRate;
                occupancy = response.teamPerformanceTotal[0].occupancy;

                const ctx = document.getElementById('myChart').getContext('2d');
                const myChart = new Chart(ctx, {
                    type: charttype,
                    data: {
                        labels: ['agentOffered', 'inboundHandled', 'outboundHandled', 'totalHandled', 'totalAvgHandled', 'refused'],
                        datasets: [{
                            label: $('#teams option:selected').text(),
                            data: [agentOffered, inboundHandled, outboundHandled, totalHandled, totalAvgHandled, refused],
                            backgroundColor: [
                                'rgba(0, 0, 128, 0.2)',
                                'rgba(0, 0, 255, 0.2)',
                                'rgba(0, 128, 0, 0.2)',
                                'rgba(1, 128, 128, 0.2)',
                                'rgba(0, 255, 0, 0.2)',
                                'rgba(0, 255, 255, 0.2)',
                                'rgba(128, 0, 0, 0.2)',
                                'rgba(128, 0, 128, 0.2)',
                                'rgba(128, 128, 0, 0.2)',
                                'rgba(128, 128, 128, 0.2)',
                                'rgba(192, 192, 192, 0.2)',
                                'rgba(255, 0, 0, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(0, 0, 128, 1)',
                                'rgba(0, 0, 255, 1)',
                                'rgba(0, 128, 0, 1)',
                                'rgba(1, 128, 128, 1)',
                                'rgba(0, 255, 0, 1)',
                                'rgba(0, 255, 255, 1)',
                                'rgba(128, 0, 0, 1)',
                                'rgba(128, 0, 128, 1)',
                                'rgba(128, 128, 0, 1)',
                                'rgba(128, 128, 128, 1)',
                                'rgba(192, 192, 192, 1)',
                                'rgba(255, 0, 0, 1)',
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: true,
                                position: 'left'
                            },
                            title: {
                                display: false
                            }
                        },
                        maintainAspectRatio: false,
                    }
                });

                myChart.canvas.parentNode.style.height = '600px';
                myChart.canvas.parentNode.style.width = '600px';

                chartdata = '<table  style="width:100%">'
                chartdata += '<tr>'
                chartdata += '<td>agentOffered</td><td>' + agentOffered + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>inboundHandled</td><td>' + inboundHandled + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr">'
                chartdata += '<td>outboundHandled</td><td>' + outboundHandled + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>refused</td><td>' + refused + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>totalAvgHandled</td><td>' + totalAvgHandled + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>totalHandled</td><td>' + totalHandled + '</td>'
                chartdata += '</tr>'
                chartdata += '</table>'

                $("#data").html(chartdata);


            });

            //end teamPerformanceTotal

        }

        if (report == 'skillSummaries') {

            var charttype = $("#charttype").val();

            var settings = {
                "url": "https://api-na1.niceincontact.com/incontactapi/services/v23.0/skills/" + $('#skills option:selected').val() + "/summary?startDate=" + $('#startDate').val() + "&endDate=" + $('#endDate').val(),
                "method": "GET",
                "timeout": 0,
                "headers": {
                    "accept": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("access_token"),
                },
            };

            $.ajax(settings).done(function (response) {

                console.log(response.skillSummaries[0].abandonCount)

                AbandonCount = response.skillSummaries[0].abandonCount;
                AbandonRate = response.skillSummaries[0].abandonRate;
                AgentsACW = response.skillSummaries[0].agentsAcw;
                AgentsAvailable = response.skillSummaries[0].agentsAvailable;
                AgentsIdle = response.skillSummaries[0].agentsIdle;
                AgentsLoggedIn = response.skillSummaries[0].agentsLoggedIn;
                AgentsUnavailable = response.skillSummaries[0].agentsUnavailable;
                AgentsWorking = response.skillSummaries[0].agentsWorking;
                ContactsActive = response.skillSummaries[0].contactsActive;
                ContactsHandled = response.skillSummaries[0].contactsHandled;
                ContactsOffered = response.skillSummaries[0].contactsOffered;
                ContactsQueued = response.skillSummaries[0].contactsQueued;
                ContactsOutOfSLA = response.skillSummaries[0].contactsOutOfSLA;
                ContactsWithinSLA = response.skillSummaries[0].contactsWithinSLA;
                SkillName = response.skillSummaries[0].skillName;
                AverageHandleTime = response.skillSummaries[0].averageHandleTime;
                AverageInqueueTime = response.skillSummaries[0].averageInqueueTime;
                AverageSpeedToAnswer = response.skillSummaries[0].averageSpeedToAnswer;
                AverageTalkTime = response.skillSummaries[0].averageTalkTime;
                AverageWrapTime = response.skillSummaries[0].averageWrapTime;
                HoldTime = response.skillSummaries[0].holdTime;
                LongestQueueDuration = response.skillSummaries[0].longestQueueDur;
                TotalContactTime = response.skillSummaries[0].totalContactTime;

                console.log(response.skillSummaries[0])

                const ctx = document.getElementById('myChart').getContext('2d');
                const myChart = new Chart(ctx, {
                    type: charttype,
                    data: {
                        labels: ['AbandonCount', 'ContactsHandled', 'ContactsOffered', 'ContactsQueued', 'ContactsOutOfSLA', 'ContactsWithinSLA'],
                        datasets: [{
                            label: SkillName,
                            data: [AbandonCount, ContactsHandled, ContactsOffered, ContactsQueued, ContactsOutOfSLA, ContactsWithinSLA],
                            backgroundColor: [
                                'rgba(0, 0, 128, 0.2)',
                                'rgba(0, 0, 255, 0.2)',
                                'rgba(0, 128, 0, 0.2)',
                                'rgba(1, 128, 128, 0.2)',
                                'rgba(0, 255, 0, 0.2)',
                                'rgba(0, 255, 255, 0.2)',
                                'rgba(128, 0, 0, 0.2)',
                                'rgba(128, 0, 128, 0.2)',
                                'rgba(128, 128, 0, 0.2)',
                                'rgba(128, 128, 128, 0.2)',
                                'rgba(192, 192, 192, 0.2)',
                                'rgba(255, 0, 0, 0.2)',
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(0, 0, 128, 1)',
                                'rgba(0, 0, 255, 1)',
                                'rgba(0, 128, 0, 1)',
                                'rgba(1, 128, 128, 1)',
                                'rgba(0, 255, 0, 1)',
                                'rgba(0, 255, 255, 1)',
                                'rgba(128, 0, 0, 1)',
                                'rgba(128, 0, 128, 1)',
                                'rgba(128, 128, 0, 1)',
                                'rgba(128, 128, 128, 1)',
                                'rgba(192, 192, 192, 1)',
                                'rgba(255, 0, 0, 1)',
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: true,
                                position: 'left'
                            },
                            title: {
                                display: false
                            }
                        },
                        maintainAspectRatio: false,
                    }
                });

                myChart.canvas.parentNode.style.height = '600px';
                myChart.canvas.parentNode.style.width = '600px';

                chartdata = '<table style="width:100%">'
                chartdata += '<tr>'
                chartdata += '<td>AbandonCount</td><td>' + AbandonCount + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>AbandonRate</td><td>' + AbandonRate + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>ContactsHandled</div><td>' + ContactsHandled + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>ContactsOffered</td><td>' + ContactsOffered + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>ContactsQueued</td><td>' + ContactsQueued + '</td>'
                chartdata += '</div>'
                chartdata += '<tr>'
                chartdata += '<td>ContactsOutOfSLA</td><td>' + ContactsOutOfSLA + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>ContactsWithinSLA</td><td>' + ContactsWithinSLA + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>AverageHandleTime</td><td>' + AverageHandleTime + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>AverageInqueueTime</td><td>' + AverageInqueueTime + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>AverageSpeedToAnswer</td><td>' + AverageSpeedToAnswer + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>AverageTalkTime</td><td>' + AverageTalkTime + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>AverageWrapTime</td><td>' + AverageWrapTime + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>HoldTime</td><td>' + HoldTime + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>LongestQueueDuration</td><td>' + LongestQueueDuration + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>TotalContactTime</td><td>' + TotalContactTime + '</td>'
                chartdata += '</tr>'
                chartdata += '</table>'

                $("#data").html(chartdata);


            });

            //end skillSummaries

        }

        if (report == 'serviceLevelSummaries') {

            var charttype = $("#charttype").val();

            var settings = {
                "url": "https://api-na1.niceincontact.com/incontactapi/services/v23.0/skills/" + $('#skills option:selected').val() + "/sla-summary?startDate=" + $('#startDate').val() + "&endDate=" + $('#endDate').val(),
                "method": "GET",
                "timeout": 0,
                "headers": {
                    "accept": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("access_token"),
                },
            };

            $.ajax(settings).done(function (response) {

                ContactsWithinSLA = response.serviceLevelSummaries[0].ContactsWithinSLA;
                ContactsOutOfSLA = response.serviceLevelSummaries[0].ContactsOutOfSLA;
                TotalContacts = response.serviceLevelSummaries[0].TotalContacts;
                ServiceLevel = response.serviceLevelSummaries[0].ServiceLevel;
                skillName = response.serviceLevelSummaries[0].SkillName;

                console.log(response.serviceLevelSummaries[0])

                const ctx = document.getElementById('myChart').getContext('2d');
                const myChart = new Chart(ctx, {
                    type: charttype,
                    data: {
                        labels: ['ContactsWithinSLA', 'ContactsOutOfSLA', 'TotalContacts'],
                        datasets: [{
                            label: skillName,
                            data: [ContactsWithinSLA, ContactsOutOfSLA, TotalContacts],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: true,
                                position: 'left'
                            },
                            title: {
                                display: false
                            }
                        },
                        maintainAspectRatio: false,
                    }
                });

                myChart.canvas.parentNode.style.height = '600px';
                myChart.canvas.parentNode.style.width = '600px';

                chartdata = '<table style="width:100%">'
                chartdata += '<tr>'
                chartdata += '<td>ContactsWithinSLA</td><td>' + ContactsWithinSLA + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>ContactsOutOfSLA</td><td>' + ContactsOutOfSLA + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>TotalContacts</td><td>' + TotalContacts + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>ServiceLevel</td><td>' + ServiceLevel + '</td>'
                chartdata += '</tr>'
                chartdata += '</table>'

                $("#data").html(chartdata);

            });

            //end serviceLevelSummaries

        }

        if (report == 'agentPerformance') {

            var charttype = $("#charttype").val();

            var settings = {
                "url": "https://api-na1.niceincontact.com/incontactapi/services/v23.0/agents/" + $('#agents option:selected').val() + "/performance?startDate=" + $('#startDate').val() + "&endDate=" + $('#endDate').val(),
                "method": "GET",
                "timeout": 0,
                "headers": {
                    "accept": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("access_token"),
                },
            };

            $.ajax(settings).done(function (response) {

                agentOffered = response.agentPerformance[0].agentOffered;
                inboundHandled = response.agentPerformance[0].inboundHandled;
                outboundHandled = response.agentPerformance[0].outboundHandled;
                totalHandled = response.agentPerformance[0].totalHandled;
                refused = response.agentPerformance[0].refused;
                inboundTime = response.agentPerformance[0].inboundTime;
                inboundTalkTime = response.agentPerformance[0].inboundTalkTime;
                inboundAvgTalkTime = response.agentPerformance[0].inboundAvgTalkTime;
                outboundTime = response.agentPerformance[0].outboundTime;
                outboundTalkTime = response.agentPerformance[0].outboundTalkTime;
                outboundAvgTalkTime = response.agentPerformance[0].outboundAvgTalkTime;
                totalTalkTime = response.agentPerformance[0].totalTalkTime;
                totalAvgTalkTime = response.agentPerformance[0].totalAvgTalkTime;
                totalAvgHandleTime = response.agentPerformance[0].totalAvgHandleTime;
                consultTime = response.agentPerformance[0].consultTime;
                availableTime = response.agentPerformance[0].availableTime;
                unavailableTime = response.agentPerformance[0].unavailableTime;
                acwTime = response.agentPerformance[0].acwTime;
                loginTime = response.agentPerformance[0].loginTime;
                percentRefused = response.agentPerformance[0].percentRefused;
                workingRate = response.agentPerformance[0].workingRate;
                occupancy = response.agentPerformance[0].occupancy;
                agentId = response.agentPerformance[0].agentId;

                console.log(response.agentPerformance[0])

                const ctx = document.getElementById('myChart').getContext('2d');
                const myChart = new Chart(ctx, {
                    type: charttype,
                    data: {
                        labels: ['agentOffered', 'inboundHandled', 'outboundHandled', 'totalHandled', 'refused'],
                        datasets: [{
                            label: $('#agents option:selected').text(),
                            data: [agentOffered, inboundHandled, outboundHandled, totalHandled, refused],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: true,
                                position: 'left'
                            },
                            title: {
                                display: false
                            }
                        },
                        maintainAspectRatio: false,
                    }
                });

                myChart.canvas.parentNode.style.height = '600px';
                myChart.canvas.parentNode.style.width = '600px';

                chartdata = '<table style="width:100%">'
                chartdata += '<tr>'
                chartdata += '<td>agentOffered</td><td>' + agentOffered + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>inboundHandled</td><td>' + inboundHandled + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>outboundHandled</td><td>' + outboundHandled + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>totalHandled</td><td>' + totalHandled + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>refused</td><td>' + refused + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>inboundTime</td><td>' + inboundTime + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>inboundTalkTime</td><td>' + inboundTalkTime + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>inboundAvgTalkTime</td><td>' + inboundAvgTalkTime + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>outboundTime</td><td>' + outboundTime + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>outboundTalkTime</td><td>' + outboundTalkTime + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>outboundAvgTalkTime</td><td>' + outboundAvgTalkTime + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>totalTalkTime</td><td>' + totalTalkTime + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>totalAvgTalkTime</td><td>' + totalAvgTalkTime + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>totalAvgHandleTime</td><td>' + totalAvgHandleTime + '</td>'
                chartdata += '</div>'
                chartdata += '<tr>'
                chartdata += '<td>consultTime</td><td>' + consultTime + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>availableTime</td><td>' + availableTime + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>unavailableTime</td><td>' + unavailableTime + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>acwTime</td><td>' + acwTime + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>loginTime</td><td>' + loginTime + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>percentRefused</td><td>' + percentRefused + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>workingRate</td><td>' + workingRate + '</td>'
                chartdata += '</tr>'
                chartdata += '<tr>'
                chartdata += '<td>occupancy</td><td>' + occupancy + '</td>'
                chartdata += '</tr>'
                chartdata += '</table>'

                $("#data").html(chartdata);

            });

            //end agentPerformance

        }


    });
});
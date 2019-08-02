$(function () {
	$.post('../route/getNumUsers/',{},
    function(data){
        if(data){
			var labels = []
			var numOfUsersData = []
			for (var i in data){
				labels.push(i)
				numOfUsersData.push(data[i])
			}
			var ctxL = document.getElementById("lineChart").getContext('2d');
			var myLineChart = new Chart(ctxL, {
				type: 'line',
				data: {
					labels: labels,
					datasets: [{
					label: "No. of Users",
					data: numOfUsersData,
					backgroundColor: [
					'rgba(105, 0, 132, .0)',
					],
					borderColor: [
					'rgba(200, 99, 132, .7)',
					],
					borderWidth: 2
					}
					]
				},
				options: {
				responsive: true
				}
			});
        }
	})
	
	$.post('../route/getQuickFeedback/',{},
    function(data){
        if(data){
			var labels = []
			var emotionStats = []
			for (var i in data){
				labels.push(i)
				emotionStats.push(data[i])
			}
		}
		var ctxP = document.getElementById("pieChart").getContext('2d');
		var myPieChart = new Chart(ctxP, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
				data: emotionStats,
				backgroundColor: ["#FDB45C" ,"#F7464A", "#46BFBD" ],
				hoverBackgroundColor: ["#FFC870", "#FF5A5E", "#5AD3D1"]
				}]
			},
			options: {
			responsive: true
			}
		});
    })
})
$(document).ready(function(){
    $.ajax({
        url: "http://localhost/sims/charts/datainventorygauge.php",
        method: "GET",
        success: function(data) {
            console.log(data);
            var product_sku = [];
            var no_of_avstock = [];

            for (var i in data) {
                product_sku.push(data[i].product_sku);
                no_of_avstock.push(data[i].no_of_avstock);
            }

            var chartdata = {
                labels: product_sku,
                datasets: [
                    {
                        label: 'Number of Available Stock Left',
                        backgroundColor: '#D84465',
                        borderColor: 'rgba(200, 200, 200, 0.75)',
                        hoverBackgroundColor: 'rgba(200, 200, 200, 1)',
                        hoverBorderColor: 'rgba(200, 200, 200, 1)',
                        data: no_of_avstock
                    }
                ]
            };

            var ctx = $("#inventorygauge");

            var horizontalBarGraph = new Chart(ctx, {
                type: 'horizontalBar',
                data: chartdata,
               options: {
                  scales: {
                      yAxes: [{
                          ticks: {
                              beginAtZero:true
                          }
                      }]
                  }
               }
            });
        },
        error: function(data) {
            console.log(data);
        }
    });
});

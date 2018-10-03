$(document).ready(function() {
    $.ajax({
        url: "http://localhost/sims/charts/datamostselling.php",
        method: "GET",
        success: function(data) {
            console.log(data);
            var product_sku = [];
            var jacket_sold = [];

            for (var i in data) {
                product_sku.push(data[i].product_sku);
                jacket_sold.push(data[i].jacket_sold);
            }

            var barChartdata = {
                labels: product_sku,
                datasets: [
                    {
                        label: 'Items sold',
                        backgroundColor: '#0DD9FD',
                        borderColor: 'rgba(200, 200, 200, 0.75)',
                        hoverBackgroundColor: 'rgba(200, 200, 200, 1)',
                        hoverBorderColor: 'rgba(200, 200, 200, 1)',
                        data: jacket_sold
                    }
                ]
            };

            var ctx = $("#mostselling");

            var barGraph = new Chart(ctx, {
                type: 'bar',
                data: barChartdata
            });
        },
        error: function (data) {
            console.log(data);
        }
    });
});

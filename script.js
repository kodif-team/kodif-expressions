/*
return 0: refund
return 1: contact support
*/

function run() {
    
    debugger

    //  Rule 1: Agent 
    if (ctx.INITIAL_PARAMS.origin == 'agent') {
        return 0;
    }

    // Rule 2: if refunded before go contact support
    if(typeof ctx.selectedOrder[2][0].refunded_amount == "number"){
        return 1
    }
    


    // Rule 3: 10 Days old order
    var creation_date = new Date(ctx.selectedOrder[2][0].creation_datetime);
    var today = new Date();
    var diffTime = today.getTime() - creation_date.getTime();
    var diffDay = diffTime / (1000 * 3600 * 24);
    if(diffDay > 10){
        return 1
    }

    // Rule 4: if order amount is more than 500 then contact support
    if(ctx.refundAmount > 500 && ctx.selectedOrder[2][0].order_amount > 500){
        return 1
    }
    
    // Rule 5: if order is first 2 orders and less than 500 then return
    if(ctx.allOrders[2].count < 3){
        return 0;
    }

    // Rule 6: order ratio less than 20%
    var refunded = 0;
    var last30Days = ctx.allOrders[2].all_jobs.filter(job => {
        if (job.refunded_amount) {
            refunded++
        }
        var orderDate = new Date(job.creation_datetime);
        var today = new Date();
        var diffTime = today.getTime() - orderDate.getTime();
        var diffDay = diffTime / (1000 * 3600 * 24);
        return diffDay < 31
    })
    if(last30Days.length > 1 && refunded * 100 / (last30Days.length -1) > 20) {
        return 1;
    }


    return 0
}
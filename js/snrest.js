function restRequest(inpObj, callback) {
	jQuery.ajax({
		url: buildRequestString(inpObj),
		method: 'GET',
		headers: {
			'X-UserToken': (typeof g_ck === 'undefined') ? '' : g_ck,
			'Cache-Control': 'no-cache',
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}).done(function (rspns) {
		callback(rspns.result);
	}).fail(function (jqXHR, textStatus) {
		callback(textStatus);
	});
}


function buildRequestString(inpObj){
	
	var obj = inpObj || {};
		var url = obj.u || obj.url || '';
		var api = obj.a || obj.api || '/api/now/table/';
		var table = obj.t || obj.table || 'incident';
		var sysId = obj.s || obj.sysId || '';
		var query = obj.q || obj.query || '';
		var values = obj.vals || obj.values || [];
		var order = obj.o || obj.order || '';
		order = _createOrderBy(order);
		query = query + order;
		query = query || 'ORDERBYDESCsys_updated_on';
		for (var i = 0; i < values.length; i++){
			query = query.replace(new RegExp('\\{' + i +'\\}', 'gi'), '' + values[i]);
			}
			
			query = encodeURIComponent(query);
			var displayValue = '' + (obj.d || obj.displayValue || false);
			var excludeReferenceLink = '' + (obj.e || obj.excludeReferenceLink || true);
			var suppressPaginationHeader = '' + (obj.s || obj.suppressPaginationHeader || true);
			var fields = obj.f || obj.fields || '';
			fields = encodeURIComponent(fields);
			var limit = obj.l || obj.limit || 10;
			var view = obj.v || obj.view || '';
			
			var result = url + api + table + '?sysparm_query=' + query +
			'&sysparm_display_value=' + displayValue +
			'&sysparm_exclude_reference_link='+ excludeReferenceLink +
			'&sysparm_suppress_pagination_header=' + suppressPaginationHeader +
			((fields) ? '&sysparm_fields='+ fields : '' )+
			((view) ? '&sysparm_view='+ view : '' )+
			'&sysparm_limit=' + limit;
			
			return result;
}
		
		
function _createOrderBy(o){
	var order = o || '';
	
	if (order.startsWith('ORDERBY')) return '^' + order;
		if (order.startsWith('^ORDERBY') || order == '') return order;
		
	var orders = order.split(',');
	order = '';
	for (var i = 0;i < orders.length;i++){
		order += '^ORDERBY' + (orders[i][0] == '!' ? 'DESC' : '') + orders[i].replace('!','');
	}
	return order;
}
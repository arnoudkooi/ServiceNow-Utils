var serverscoped =`
/** ServiceNow processors are equivalent to Java servlets. Processors provide a customizable URL endpoint that can execute arbitrary server-side Javascript code and produce output such as TEXT, JSON, or HTML. The GlideServletRequest API is used in processor scripts to access the HttpServletRequest object. The GlideServletRequest object provides a subset of the HttpServletRequest APIs. The methods are called using the global variable g_request. A useful global variable, g_target, is available in processor scripts. It contains the table name extracted from the URL. The URL to a processor has the format: https://<instance name.servicenow.com>/<path endpoint>.do?<parameter endpoint>=<value> where the path endpoint and parameter endpoint are defined on the processor form */
class GlideServletRequest{

    constructor(){};
    
    /** Returns an array of headers as a string */
    getHeaders(name: string) : [string] {};
    
    /** Returns an array of header names as a string */
    getHeaderNames() : [string] {};
    
    /** Returns the query string from the request */
    getQueryString() : string {};
    
    /** Returns the content type */
    getContentType() : string {};
    
    /** Returns an array of parameter names as a string */
    getParameterNames() : [string] {};
    
    /** Returns the header */
    getHeader(name: string) : string {};
    
    /** Returns an object */
    getParameter(name: string) : ? {};
    
    }
    
    /** The scoped XMLNode API allows you to query values from XML nodes. XMLNodes are extracted from XMLDocument2 objects, which contain XML strings */
    class XMLNode{
    
    constructor(){};
    
    /** Gets the node's value */
    getNodeValue() : string {};
    
    /**  */
    appendChild(newChild: XMLNode) {};
    
    /**  */
    setAttribute(attribute: string, value: string) {};
    
    /** Gets the node's XMLNodeIterator object */
    getChildNodeIterator() : XMLNodeIterator {};
    
    /** Gets the value of the specified attribute */
    getAttribute(attribute: string) : string {};
    
    /** Determines if the node has the specified attribute */
    hasAttribute(attribute: string) : bool {};
    
    /** Gets the node's first child node */
    getFirstChild() : XMLNode {};
    
    /** Gets the node's string value */
    toString() : string {};
    
    /** Gets the node's text content */
    getTextContent() : string {};
    
    /** Gets the node's name */
    getNodeName() : string {};
    
    /** Gets the node's last child node */
    getLastChild() : XMLNode {};
    
    }
    
    /** The API allows you to evaluate scripts from a GlideRecord field */
    class GlideScopedEvaluator{
    
    constructor(){};
    
    /** Evaluates a script from a GlideRecord field. variables parameter is optional */
    evaluateScript(gr: GlideRecord, scriptField: string, variables: ?) : ? {};
    
    /** Puts a variable into the GlideScopedEvaluator object */
    putVariable(name: string, value: ?) {};
    
    /** Gets a variable from a GlideScopedEvaluator object */
    getVariable(name: string) : ? {};
    
    }
    
    /** The Scoped GlideTableHierarchy API provides methods for handling information about table relationships */
    class GlideTableHierarchy{
    
    constructor(){};
    
    /** Returns true of this class has been extended */
    hasExtensions() : bool {};
    
    /** Returns the table's name */
    getName() : string {};
    
    /** Returns true if this table is not in a hierarchy */
    isSoloClass() : bool {};
    
    /** Returns a list of the table names in the hierarchy */
    getTables() : [] {};
    
    /** Returns a list of all tables that extend the current table and includes the current table */
    getAllExtensions() : [] {};
    
    /** Returns true if this is a base class */
    isBaseClass() : bool {};
    
    /** Returns a list of all tables that extend the current table */
    getTableExtensions() : [] {};
    
    /** Returns the parent class */
    getBase() : string {};
    
    /** Returns the top level class in the hierarchy */
    getRoot() : string {};
    
    /** Returns a list of all classes in the hierarchy of the given table */
    getHierarchy() : [] {};
    
    }
    
    /** Scoped API for PluginManager */
    class GlidePluginManager{
    
    constructor(){};
    
    /** Determine if a plugin is activated */
    isActive(pluginID: string) : bool {};
    
    }
    
    /** Authentication API */
    namespace sn_auth {
    class GlideOAuthClient{
    
    constructor(){};
    
    /** Revokes the access or refresh token for the client, with the request and optional header parameters set into a GlideOAuthClientRequest object */
    revokeToken(clientName: string, accessToken: string, refreshToken: string, request: GlideOAuthClientRequest) : sn_auth.GlideOAuthClientResponse {};
    
    /** Retrieves the token for the client, with the request and optional header parameters set into a GlideOAuthClientRequest object */
    requestTokenByRequest(clientName: string, request: GlideOAuthClientRequest) : sn_auth.GlideOAuthClientResponse {};
    
    /** Retrieves the token for the client, with the request parameters encoded in JSON format */
    requestToken(clientName: string, jsonString: string) : sn_auth.GlideOAuthClientResponse {};
    
    }
    
    class GlideOAuthClientRequest{
    
    constructor(){};
    
    /** Retrieves the refresh token */
    getRefreshToken() : string {};
    
    /** Sets the password with the string you provide */
    setPassword(password: string) {};
    
    /** Retrieves the HTTP headers */
    getHeaders() : ? {};
    
    /** Sets the HTTP headers for the nave:value pair that you provide */
    setHeader(name: string, value: string) {};
    
    /** Retrieves the HTTP headers for the string you provide */
    getHeader(name: string) {};
    
    /** Retrieves the password */
    getPassword() : string {};
    
    /** Sets the user name with the string you provide */
    setUserName(userName: string) {};
    
    /** Sets the parameters for the name:value pair of strings you provide */
    setParameter(name: string, value: string) {};
    
    /** Retrieves the grant type */
    getGrantType() {};
    
    /** Sets the grant type with the string you provide */
    setGrantType() {};
    
    /** Retrieves the user name */
    getUserName() : string {};
    
    /** Sets the scope with the string you provide */
    setScope(scope: string) {};
    
    /** Sets the refresh token with the string you provide */
    setRefreshToken(refreshToken: string) {};
    
    /** Retrieves the scope */
    getScope() : string {};
    
    /** Retrieves the parameter for the parameter name you provide */
    getParameter(name: string) {};
    
    }
    
    class GlideOAuthClientResponse{
    
    constructor(){};
    
    /** Retrieves the response content from an external OAuth provider. The response is in a name:value pair */
    getResponseParameters() : ? {};
    
    /** Retrieves all of the response information, including instance information */
    getBody() : string {};
    
    /** Retrieves the refresh token */
    getToken() : sn_auth.GlideOAuthToken {};
    
    /** Retrieves the HTTP response code from the external OAuth provider */
    getResponseCode() : string {};
    
    /** Retrieves the HTTP response content header from an external OAuth provider */
    getContentType() : string {};
    
    /** Retrieves the error message if authentication is not successful */
    getErrorMessage() : string {};
    
    }
    
    class GlideOAuthToken{
    
    constructor(){};
    
    /** Retrieves the refresh token */
    getRefreshToken() : number {};
    
    /** Retrieves the sys_id of the refresh token */
    getRefreshTokenSysID() : string {};
    
    /** Retrieves the lifespan of the access token in seconds */
    getExpiresIn() : number {};
    
    /** Retrieves the sys_id of the token ID */
    getAccessTokenSysID() : string {};
    
    /** Retrieves the scope, which is the amount of access granted by the access token */
    getScope() : string {};
    
    /** Retrieves the access token */
    getAccessToken() : string {};
    
    }
    
    }
    
    /** Scoped GlideRecord is used for database operations instead of writing SQL queries. Provides data access APIs to retrieve, update, and delete records from a table */
    class GlideRecord{
    
    constructor(tableName: string){};
    
    /** Retrieves the last error message */
    getLastErrorMessage() : string {};
    
    /** The label of the field as a String */
    getLabel() : string {};
    
    /** Adds a filter to return records based on a relationship in a related table */
    addJoinQuery(joinTable: string, primaryField: ?, joinTableField: ?) : GlideQueryCondition {};
    
    /** Sets the value of category for the query */
    setCategory(category: string) {};
    
    /** Adds a filter to return active records */
    addActiveQuery() : GlideQueryCondition {};
    
    /** Determines if the Access Control Rules which include the user's roles permit deleting records in this table */
    canDelete() : bool {};
    
    /** Sets a flag to indicate if the next database action (insert, update, delete) is to be aborted */
    setAbortAction(b: bool) {};
    
    /** Retrieves the number of rows in the GlideRecord */
    getRowCount() : number {};
    
    /** Retrieve the specified platform function in addition of the field values */
    addFunction(functionDefinition: string) {};
    
    /** Runs the query against the table based on the specified filters by addQuery and addEncodedQuery */
    query() {};
    
    /** Retrieves the table name associated with this GlideRecord */
    getTableName() : string {};
    
    /** Gets the optional category value of the query */
    getCategory() : string {};
    
    /** Specifies a descending orderBy */
    orderByDesc(fieldName: string) {};
    
    /** Determines if there are any more records in the GlideRecord */
    hasNext() : bool {};
    
    /**  */
    getClassDisplayValue() : string {};
    
    /** Checks if the current record is a new record that has not yet been inserted into the database */
    isNewRecord() : bool {};
    
    /** Retrieves the query condition of the current result set as an encoded query string */
    getEncodedQuery() : string {};
    
    /** Updates each GlideRecord in the list with any changes that have been made */
    updateMultiple() {};
    
    /** Retrieves the class name for the current record */
    getRecordClassName() : string {};
    
    /**  */
    autoSysFields(b: bool) {};
    
    /** Retrieves the name of the display field */
    getDisplayName() : string {};
    
    /** Adds a filter to return records by specifying a field and a value it should equal */
    addQuery(name: string, value: string) : GlideQueryCondition {};
    /** Adds a filter to return records based on a field, an operator, and a value */
    addQuery(name: string, operator: string, value: string) : GlideQueryCondition {};
    
    /** Sets the maximum number of records in the GlideRecord to be fetched in the next query */
    setLimit(limit: number) {};
    
    /** Gets the primary key of the record, which is usually the sys_id unless otherwise specified */
    getUniqueValue() : string {};
    
    /** Moves to the next record in the GlideRecord */
    next() : bool {};
    
    /** Deletes records that satisfy current query condition */
    deleteMultiple() {};
    
    /** Determines if the Access Control Rules which include the user's roles permit reading records in this table */
    canRead() : bool {};
    
    /** Insert a new record using the field values that have been set for the current record */
    insert() : string {};
    
    /** Updates the current GlideRecord with any changes that have been made */
    update(reason: ?) : string {};
    
    /** Specifies an orderBy column */
    orderBy(fieldName: string) {};
    
    /** Adds a filter to return records where the specified field is not null */
    addNotNullQuery(fieldName: string) : GlideQueryCondition {};
    
    /** Adds a filter to return records where the specified field is null */
    addNullQuery(fieldName: string) : GlideQueryCondition {};
    
    /** Adds an encoded query to the other queries that may have been set */
    addEncodedQuery(query: string) {};
    
    /** Gets the attributes on the field in question from the dictionary */
    getAttribute(attribute: string) : string {};
    
    /** Defines a GlideRecord based on the specified expression of name = value */
    get(name: ?, value: ?) : bool {};
    
    /** Determines if current record is a valid record */
    isValidRecord() : bool {};
    
    /** Sets sys_id value for the current record */
    setNewGuidValue(guid: string) {};
    
    /** Determines whether the table exists or not */
    isValid() : bool {};
    
    /** Determines whether the current database action is to be aborted. Available in Fuji patch 3 */
    isActionAborted() : bool {};
    
    /** Sets a range of rows to be returned by subsequent queries. If forceCount is true, getRowCount() method will return all possible records */
    chooseWindow(firstRow: number, lastRow: number, forceCount: bool) {};
    
    /** Determines if the Access Control Rules which include the user's roles permit editing records in this table */
    canWrite() : bool {};
    
    /** Provide additional options for text search query */
    setTextSearchOpts(textSearchOpts: ?) {};
    
    /** Determines if the Access Control Rules which include the user's roles permit inserting new records in this table */
    canCreate() : bool {};
    
    /** Enables and disables the running of business rules and script engines. When disabled, inserts and updates are not audited */
    setWorkflow(e: bool) {};
    
    /** Retrieves the underlying value of a field */
    getValue(fieldName: string) : string {};
    
    /** Retrieves a link to the current record */
    getLink(nostack: bool) : string {};
    
    /** Retrieves the GlideElement for a specified field */
    getElement(fieldName: string) : GlideElement {};
    
    /** Sets the value for the specified field. */
    setValue(fieldName: string, value: ?) {};
    
    /** Retrieves the display value for the current record */
    getDisplayValue(fieldName: string) : string {};
    
    /** Determines if the given field is defined in the current table */
    isValidField(fieldName: string) : bool {};
    
    /** Creates an empty record suitable for population before an insert */
    initialize() {};
    
    /** Retrieves the current operation being performed, such as insert, update, or delete */
    operation() : string {};
    
    /** Creates a new GlideRecord, sets the default values for the fields, and assigns a unique ID to the record */
    newRecord() {};
    
    /** Deletes the current record */
    deleteRecord() : bool {};
    
    }
    
    /** Web Services API, to send a message to a web service provider */
    namespace sn_ws {
    class RESTResponseV2{
    
    constructor(){};
    
    /** Get the numeric HTTP status code returned by the REST provider */
    getStatusCode(name: string) : number {};
    
    /** Deprecated -- use getAllHeaders instead */
    getHeaders() : Object {};
    
    /** Set the amount of time the instance waits for the response */
    waitForResponse(timeoutSecs: number) {};
    
    /** Get the content of the REST response body */
    getBody() : string {};
    
    /** Get the numeric error code, if there was an error during the REST transaction */
    getErrorCode() : number {};
    
    /** Get the error message if there was an error during the REST transaction */
    getQueryString() : string {};
    
    /** Get all headers returned in the REST response and the associated values */
    getAllHeaders() : [GlideHTTPHeader] {};
    
    /** Indicate if there was an error during the REST transaction */
    haveError() : bool {};
    
    /** Get the value for a specified header */
    getHeader(name: string) : string {};
    
    /** Get the query used for this request */
    getErrorMessage() : string {};
    
    }
    
    class SOAPMessageV2{
    
    constructor(soapMessage: string, soapFunction: string){};
    
    /** Configure the SOAP message to be sent through a MID Server */
    setMIDServer(midServerName: string) {};
    
    /** Get the content of the SOAP message body */
    getRequestBody() : string {};
    
    /** Get the value for an HTTP header specified by the SOAP client */
    getRequestHeader(headerName: string) : string {};
    
    /** Set basic authentication headers for the SOAP message */
    setBasicAuth(userName: string, userPass: string) {};
    
    /** Set WS-Security Username token */
    setWSSecurityUsernameToken(username: string, password: string) {};
    
    /** Set an HTTP header in the SOAP message to the specified value */
    setRequestHeader(headerName: string, headerValue: string) {};
    
    /** Get the URL of the endpoint for the SOAP message */
    getEndpoint() : string {};
    
    /** Set WS-Security X.509 token */
    setWSSecurityX509Token(keystoreId: string, keystoreAlias: string, keystorePassword: string, certificateId: string) {};
    
    /** Set a variable from the SOAP message record to the specified value without escaping XML reserved characters */
    setStringParameterNoEscape(name: string, value: string) {};
    
    /** Send the SOAP Message to the endpoint */
    execute() : sn_ws.SOAPResponse {};
    
    /** Set the amount of time the request waits for a response from the web service provider before the request times out */
    setHttpTimeout(timeoutMs: number) {};
    
    /** Set the endpoint for the SOAP message */
    setEndpoint(endpoint: string) {};
    
    /** Set the body content to send to the web service provider */
    setRequestBody(requestBody: string) {};
    
    /** Get name and value for all HTTP headers specified by the SOAP client */
    getRequestHeaders() : Object {};
    
    /** Set a variable from the SOAP message record to the specified value */
    setStringParameter(name: string, value: string) {};
    
    /** Define the SOAP action this SOAP message performs */
    setSOAPAction(soapAction: string) {};
    
    /** Set the mutual authentication protocol profile for the SOAP message */
    setMutualAuth(profileName: string) {};
    
    /** Associate outbound requests and the resulting response record in the ECC queue */
    setEccCorrelator(correlator: string) {};
    
    /** Set web service security values for the SOAP message */
    setWSSecurity(keystoreId: string, keystoreAlias: string, keystorePassword: string, certificateId: string) {};
    
    /** Override a value from the database by writing to the SOAP message payload */
    setEccParameter(name: string, value: string) {};
    
    /** Send the SOAP Message to the endpoint asynchronously */
    executeAsync() : sn_ws.SOAPResponse {};
    
    }
    
    class SOAPResponseV2{
    
    constructor(){};
    
    /** Get the numeric HTTP status code returned by the SOAP provider */
    getStatusCode() : number {};
    
    /** Deprecated -- use getAllHeaders instead */
    getHeaders() : Object {};
    
    /** Set the amount of time the instance waits for a response */
    waitForResponse(timeoutSecs: number) {};
    
    /** Get the content of the SOAP response body */
    getBody() : string {};
    
    /** Get the numeric error code if there was an error during the SOAP transaction */
    getErrorCode() : number {};
    
    /** Get all HTTP headers returned in the SOAP response and the associated values */
    getAllHeaders() : [GlideHTTPHeader] {};
    
    /** Indicate if there was an error during the SOAP transaction */
    haveError() : bool {};
    
    /** Get the value for a specified HTTP header */
    getHeader(name: string): string {};
    
    /** Get the error message if there was an error during the SOAP transaction */
    getErrorMessage() : string {};
    
    }
    
    class RESTMessageV2{
    
    constructor(name: string, methodName: string){};
    
    /** Configure the REST message to communicate through a MID Server */
    setMIDServer(midServer: string) {};
    
    /** Get the content of the REST message body */
    getRequestBody() : string {};
    
    /** Get the value for an HTTP header specified by the REST client */
    getRequestHeader(headerName: string) : string {};
    
    /** The HTTP method this REST message performs, such as GET or PUT. You must set an HTTP method when using the RESTMessageV2() constructor with no parameters */
    setHttpMethod(method: string) {};
    
    /** Set basic authentication headers for the REST message */
    setBasicAuth(userName: string, userPass: string) {};
    
    /** Set an HTTP header to the specified value */
    setRequestHeader(name: string, value: string) {};
    
    /** Set the credentials for the REST message using an existing basic auth or OAuth 2.0 profile. Valid types are 'basic' and 'oauth2'. Valid profileIds are the sys_id of a Basic Auth Configuration [sys_auth_profile_basic] record or an OAuth Entity Profile [oauth_entity_profile] record */
    setAuthenticationProfile(type: string, profileId: string) {};
    
    /** Append a name-value parameter to the request URL */
    setQueryParameter(name: string, value: string) {};
    
    /** Uses the specified attachment as the request body of this REST Message. Mutually exclusive with setRequestBody */
    setRequestBodyFromAttachment(attachmentSysId: string) {};
    
    /** Get the URL of the endpoint for the REST message */
    getEndpoint() : string {};
    
    /** Set a REST message function variable to the specified value without escaping XML reserved characters */
    setStringParameterNoEscape(name: string, value: string) {};
    
    /** Send the REST message to the endpoint */
    execute() : sn_ws.RESTResponseV2 {};
    
    /** Set the amount of time the REST message waits for a response from the REST provider */
    setHttpTimeout(timeoutMs: number) {};
    
    /** Set the endpoint for the REST message */
    setEndpoint(endpoint: string) {};
    
    /** Set the body content of a PUT or POST request. Mutually exclusive with setRequestBodyFromAttachment */
    setRequestBody(body: string) {};
    
    /** Get name and value for all HTTP headers specified by the REST client */
    getRequestHeaders() : Object {};
    
    /** Setup the response body to be saved into the specified attachment when the request is sent. encryptCtxSysId is optional */
    saveResponseBodyAsAttachment(tableName: string, recordSysId: string, filename: string, encryptCtxSysId: string) {};
    
    /** Set a REST message function variable to the specified value */
    setStringParameter(name: string, value: string) {};
    
    /** Set the mutual authentication protocol profile for the REST message */
    setMutualAuth(profileName: string) {};
    
    /** Set the ECC topic for the REST message. The default ECC topic is RESTProbe if topic is not set. In most cases it is unnecessary to set ECC topic */
    setEccTopic(topic: string) {};
    
    /** Associate outbound requests and the resulting response record in the ECC queue */
    setEccCorrelator(correlator: string) {};
    
    /** Override a value from the database by writing to the REST message payload */
    setEccParameter(name: string, value: string) {};
    
    /** Send the REST message to the endpoint asynchronously. The instance does not wait for a response from the web service provider when making asynchronous calls */
    executeAsync() : sn_ws.RESTResponseV2 {};
    
    /** Get the ECC topic for the REST message */
    getEccTopic() : string {};
    
    }
    
    }
    
    /** ServiceNow processors are equivalent to Java servlets. Processors provide a customizable URL endpoint that can execute arbitrary server-side Javascript code and produce output such as TEXT, JSON, or HTML. The GlideServletResponse API is used in processor scripts to access the HttpServletResponse object. The GlideServletResponse object provides a subset of the HttpServletResponse APIs. The methods are called using the global variable g_response. A useful global variable, g_target, is available in processor scripts. It contains the table name extracted from the URL. The URL to a processor has the format: https://<instance name.servicenow.com>/<path endpoint>.do?<parameter endpoint>=<value> where the path endpoint and parameter endpoint are defined on the processor form */
    class GlideServletResponse{
    
    constructor(){};
    
    /** Sets the MIME type of the response */
    setContentType(type: string) {};
    
    /** Sends a temporary redirect to the client */
    sendRedirect(location: string) {};
    
    /** Sets the status code for the response */
    setStatus(status: number) {};
    
    /** Sets a response header to the specified value */
    setHeader(key: string, value: string) {};
    
    }
    
    /** The scoped GlideElementDescriptor class provides information about individual fields */
    class GlideElementDescriptor{
    
    constructor(){};
    
    /** Returns the field's name */
    getName() : string {};
    
    /** Returns the field's data type */
    getInternalType() : string {};
    
    /** Returns the field's label */
    getLabel() : string {};
    
    /** Returns the field's length */
    getLength() : number {};
    
    }
    
    /** The scoped QueryCondition API provides additional AND or OR conditions that can be added to the current condition, allowing you to build complex queries such as: category='hardware' OR category='software' AND priority='2' AND priority='1' */
    class GlideQueryCondition{
    
    constructor(){};
    
    /** Adds an OR condition to the current condition. oper is an optional parameter */
    addOrCondition(name: string, oper: string, value: ?) : GlideQueryCondition {};
    
    /** Adds an AND condition to the current condition. oper is an optional parameter */
    addCondition(name: string, oper: string, value: ?) : GlideQueryCondition {};
    
    }
    
    /** A wrapper around an InputStream. No functions are provided to manipulate the stream from script. Rather this object can be passed to any API which takes an InputStream as an input parameter */
    class GlideScriptableInputStream{
    
    constructor(){};
    
    }
    
    /** These objects are relevant to Scripted GraphQL APIs and are accessed via the env input parameters to Scripted APIs */
    namespace sn_scripted_gql {
    class TypeResolutionEnvironment{
    
    constructor(){};
    
    /** The object returned from data fetcher */
    getObject() {};
    
    /** Represents the arguments that have been provided on a field */
    getArguments() {};
    
    /** Name of Interface or Union GraphQL Type */
    getTypeName() : string {};
    
    }
    
    class ResolverEnvironment{
    
    constructor(){};
    
    /** Information on the field. It is the result of the parent field fetch */
    getSource() {};
    
    /** Represents the arguments that have been provided on a field */
    getArguments() {};
    
    }
    
    }
    
    /** GlideRecordSecure is a class inherited from GlideRecord that performs the same functions as GlideRecord, and also enforces ACLs */
    class GlideRecordSecure extends GlideRecord{
    }
    
    /** Scoped GlideRecord is used for database operations instead of writing SQL queries. Provides data access APIs to retrieve, update, and delete records from a table */
    class current_proto{
    /**  */
    attested_date : GlideElement;
    
    /** Flag used to prevent loops when synchronizing data between a CI and its asset */
    skip_sync : GlideElement;
    
    /**  */
    operational_status : GlideElement;
    
    /**  */
    sys_updated_on : GlideElement;
    
    /**  */
    attestation_score : GlideElement;
    
    /**  */
    discovery_source : GlideElement;
    
    /**  */
    first_discovered : GlideElement;
    
    /**  */
    sys_updated_by : GlideElement;
    
    /** Modifies the due date with an offset */
    due_in : GlideElement;
    
    /**  */
    sys_created_on : GlideElement;
    
    /** Domain to which the configuration item belongs */
    sys_domain : GlideElement;
    
    /**  */
    install_date : GlideElement;
    
    /**  */
    gl_account : GlideElement;
    
    /**  */
    invoice_number : GlideElement;
    
    /**  */
    sys_created_by : GlideElement;
    
    /**  */
    warranty_expiration : GlideElement;
    
    /**  */
    asset_tag : GlideElement;
    
    /**  */
    fqdn : GlideElement;
    
    /**  */
    change_control : GlideElement;
    
    /** Business manager */
    owned_by : GlideElement;
    
    /** When the asset was checked out */
    checked_out : GlideElement;
    
    /**  */
    sys_domain_path : GlideElement;
    
    /**  */
    business_unit : GlideElement;
    
    /**  */
    delivery_date : GlideElement;
    
    /**  */
    maintenance_schedule : GlideElement;
    
    /**  */
    install_status : GlideElement;
    
    /**  */
    cost_center : GlideElement;
    
    /**  */
    attested_by : GlideElement;
    
    /**  */
    supported_by : GlideElement;
    
    /**  */
    dns_domain : GlideElement;
    
    /** Unique name, often is the DNS hostname or computer name */
    name : GlideElement;
    
    /**  */
    assigned : GlideElement;
    
    /**  */
    life_cycle_stage : GlideElement;
    
    /**  */
    purchase_date : GlideElement;
    
    /**  */
    subcategory : GlideElement;
    
    /**  */
    short_description : GlideElement;
    
    /**  */
    u_users : GlideElement;
    
    /**  */
    assignment_group : GlideElement;
    
    /** IT manager */
    managed_by : GlideElement;
    
    /**  */
    managed_by_group : GlideElement;
    
    /** Provides network printing service */
    can_print : GlideElement;
    
    /**  */
    last_discovered : GlideElement;
    
    /**  */
    sys_class_name : GlideElement;
    
    /**  */
    manufacturer : GlideElement;
    
    /**  */
    sys_id : GlideElement;
    
    /**  */
    po_number : GlideElement;
    
    /** When the asset was checked in */
    checked_in : GlideElement;
    
    /**  */
    sys_class_path : GlideElement;
    
    /**  */
    life_cycle_stage_status : GlideElement;
    
    /** Context MAC Address */
    mac_address : GlideElement;
    
    /**  */
    vendor : GlideElement;
    
    /** Customer name */
    company : GlideElement;
    
    /**  */
    justification : GlideElement;
    
    /**  */
    model_number : GlideElement;
    
    /**  */
    department : GlideElement;
    
    /** Person using or primarily responsible for this item */
    assigned_to : GlideElement;
    
    /**  */
    start_date : GlideElement;
    
    /**  */
    comments : GlideElement;
    
    /**  */
    cost : GlideElement;
    
    /**  */
    attestation_status : GlideElement;
    
    /** Operational Technology asset details */
    cmdb_ot_entity : GlideElement;
    
    /**  */
    sys_mod_count : GlideElement;
    
    /** Enable monitoring of the configuration item */
    monitor : GlideElement;
    
    /**  */
    serial_number : GlideElement;
    
    /** Context IP Address */
    ip_address : GlideElement;
    
    /**  */
    model_id : GlideElement;
    
    /** Which CI is this a duplicate of */
    duplicate_of : GlideElement;
    
    /**  */
    sys_tags : GlideElement;
    
    /**  */
    cost_cc : GlideElement;
    
    /**  */
    order_date : GlideElement;
    
    /**  */
    schedule : GlideElement;
    
    /**  */
    support_group : GlideElement;
    
    /**  */
    environment : GlideElement;
    
    /** When the asset is due for check in */
    due : GlideElement;
    
    /**  */
    attested : GlideElement;
    
    /**  */
    correlation_id : GlideElement;
    
    /**  */
    unverified : GlideElement;
    
    /** Attributes that describe the configuration item, usually XML */
    attributes : GlideElement;
    
    /**  */
    location : GlideElement;
    
    /** Associated asset, automatically created along with the CI when model requires it */
    asset : GlideElement;
    
    /**  */
    category : GlideElement;
    
    /**  */
    fault_count : GlideElement;
    
    /**  */
    lease_id : GlideElement;
    
    }
    
    var current = new current_proto();
    /** XMLDocument2 is a JavaScript Object wrapper for parsing and extracting XML data from an XML string. Use this JavaScript class to instantiate an object from an XML string, usually a return value from a Web Service invocation, or the XML payload of ECC Queue */
    class XMLDocument2{
    
    constructor(){};
    
    /** Gets the first node in the specified xpath */
    getFirstNode(xpath: string) : XMLNode {};
    
    /** Creates an element node with a text child node and adds it to the current node */
    createElementWithTextValue(name: string, value: string) : XMLNode {};
    
    /** Gets the node after the specified node */
    getNextNode(prev: XMLNode) : XMLNode {};
    
    /** Checks if the XMLDocument is valid */
    isValid() : bool {};
    
    /** Makes the node passed in as a parameter the current node */
    setCurrentElement(element: XMLNode) {};
    
    /** Gets the document element node of the XMLDocument2. The document element node is the root node */
    getDocumentElement() : XMLNode {};
    
    /** Parses the XML string and loads it into the XMLDocument2 object */
    parseXML(xmlDoc: string) : bool {};
    
    /** Creates and adds an element node to the current node. The element name is the string passed in as a parameter. The new element node has no text child nodes */
    createElement(name: string) : XMLNode {};
    
    /** Returns a string containing the XML */
    toString() : string {};
    
    /** Gets the node specified in the xpath */
    getNode(xpath: string) : XMLNode {};
    
    /** Gets all the text child nodes from the node referenced in the xpath */
    getNodeText(xpath: string) : string {};
    
    }
    
    /** The scoped GlideDuration class provides methods for working with spans of time or durations. GlideDuration objects store the duration as a date and time from January 1, 1970, 00:00:00. As a result, setValue() and getValue() use the GlideDateTime object for parameters and return values */
    class GlideDuration{
    
    constructor(){};
    
    /** Adds a given duration to the current duration */
    add(value: GlideDuration) : GlideDuration {};
    
    /** Gets the current duration in the given format */
    getByFormat(format: string) : string {};
    
    /** Gets internal value of the this duration object. GlidDuration is stored as DateTime */
    getValue() : string {};
    
    /**  */
    subtract(value: GlideDuration) : GlideDuration {};
    
    /** Gets the display value of the duration in number of days, hours, and minutes */
    getDisplayValue() : string {};
    
    /** Sets the internal value of the GlideDuration object. Internally, GlidDuration is stored as DateTime */
    setValue(o: ?) {};
    
    /** Gets the number of days */
    getDayPart() : number {};
    
    /** Sets the display value */
    setDisplayValue(asDisplayed: string) {};
    
    /** Gets the rounded number of days. If the time part is more than 12 hours, the return value is rounded up. Otherwise, it is rounded down */
    getRoundedDayPart() : number {};
    
    /** Gets the duration value in d HH:mm:ss format */
    getDurationValue() : string {};
    
    }
    
    /** The scoped GlideAggregate class is an extension of GlideRecord and allows database aggregation (COUNT, SUM, MIN, MAX, AVG) queries to be done. This can be helpful in creating customized reports or in calculations for calculated fields. The GlideAggregate class works only on number fields. Since currency fields are strings, you can't use the GlideAggregate class on currency fields */
    class GlideAggregate{
    
    constructor(tableName: string){};
    
    /** Moves to the next record in the GlideAggregate */
    next() : bool {};
    
    /** Retrieves the number of rows in the GlideRecord */
    getRowCount() : number {};
    
    /** Gets the query necessary to return the current aggregate */
    getAggregateEncodedQuery() : string {};
    
    /** Adds an aggregate */
    addAggregate(aggregate: string, field: string) {};
    
    /** Issues the query and gets the results */
    query() {};
    
    /** Retrieves the table name associated with this GlideRecord */
    getTableName() : string {};
    
    /** Gets the optional category value of the query */
    getCategory() : string {};
    
    /** Orders the aggregates using the value of the specified field. The field will also be added to the group-by list */
    orderBy(field: string) {};
    
    /** Sorts the aggregates into descending order based on the specified field */
    orderByDesc(field: string) {};
    
    /** Determines if there are any more results in the GlideAggregate */
    hasNext() : bool {};
    
    /** Provides the name of a field to use in grouping the aggregates. May be called numerous times to set multiple group fields */
    groupBy(field: string) {};
    
    /** Retrieves the encoded query */
    getEncodedQuery() : string {};
    
    /** Adds a NOT NULL query to the aggregate */
    addNotNullQuery(field: string) : GlideQueryCondition {};
    
    /** Sorts the aggregates based on the specified aggregate and field */
    orderByAggregate(aggregate: string, field: string) {};
    
    /** Adds a NULL query to the aggregate */
    addNullQuery(field: string) : GlideQueryCondition {};
    
    /** Gets the value of a field */
    getValue(field: string) : string {};
    
    /** Sets whether the results are to be grouped */
    setGroup(value: bool) {};
    
    /** Adds a query to the aggregate. Adds an encoded query to the other queries that may have been set for this aggregate */
    addEncodedQuery(query: string) {};
    
    /** Sets the value of category for the query */
    setCategory(category: string) {};
    
    /** Adds a query to the aggregate */
    addQuery(field: string, operator: string, value: string) : GlideQueryCondition {};
    
    /** Gets the value of the specified aggregate */
    getAggregate(aggregate: string, field: string) : string {};
    
    }
    
    /** Scoped GlideRecord is used for database operations instead of writing SQL queries. Provides data access APIs to retrieve, update, and delete records from a table */
    class previous_proto{
    /**  */
    attested_date : GlideElement;
    
    /** Flag used to prevent loops when synchronizing data between a CI and its asset */
    skip_sync : GlideElement;
    
    /**  */
    operational_status : GlideElement;
    
    /**  */
    sys_updated_on : GlideElement;
    
    /**  */
    attestation_score : GlideElement;
    
    /**  */
    discovery_source : GlideElement;
    
    /**  */
    first_discovered : GlideElement;
    
    /**  */
    sys_updated_by : GlideElement;
    
    /** Modifies the due date with an offset */
    due_in : GlideElement;
    
    /**  */
    sys_created_on : GlideElement;
    
    /** Domain to which the configuration item belongs */
    sys_domain : GlideElement;
    
    /**  */
    install_date : GlideElement;
    
    /**  */
    gl_account : GlideElement;
    
    /**  */
    invoice_number : GlideElement;
    
    /**  */
    sys_created_by : GlideElement;
    
    /**  */
    warranty_expiration : GlideElement;
    
    /**  */
    asset_tag : GlideElement;
    
    /**  */
    fqdn : GlideElement;
    
    /**  */
    change_control : GlideElement;
    
    /** Business manager */
    owned_by : GlideElement;
    
    /** When the asset was checked out */
    checked_out : GlideElement;
    
    /**  */
    sys_domain_path : GlideElement;
    
    /**  */
    business_unit : GlideElement;
    
    /**  */
    delivery_date : GlideElement;
    
    /**  */
    maintenance_schedule : GlideElement;
    
    /**  */
    install_status : GlideElement;
    
    /**  */
    cost_center : GlideElement;
    
    /**  */
    attested_by : GlideElement;
    
    /**  */
    supported_by : GlideElement;
    
    /**  */
    dns_domain : GlideElement;
    
    /** Unique name, often is the DNS hostname or computer name */
    name : GlideElement;
    
    /**  */
    assigned : GlideElement;
    
    /**  */
    life_cycle_stage : GlideElement;
    
    /**  */
    purchase_date : GlideElement;
    
    /**  */
    subcategory : GlideElement;
    
    /**  */
    short_description : GlideElement;
    
    /**  */
    u_users : GlideElement;
    
    /**  */
    assignment_group : GlideElement;
    
    /** IT manager */
    managed_by : GlideElement;
    
    /**  */
    managed_by_group : GlideElement;
    
    /** Provides network printing service */
    can_print : GlideElement;
    
    /**  */
    last_discovered : GlideElement;
    
    /**  */
    sys_class_name : GlideElement;
    
    /**  */
    manufacturer : GlideElement;
    
    /**  */
    sys_id : GlideElement;
    
    /**  */
    po_number : GlideElement;
    
    /** When the asset was checked in */
    checked_in : GlideElement;
    
    /**  */
    sys_class_path : GlideElement;
    
    /**  */
    life_cycle_stage_status : GlideElement;
    
    /** Context MAC Address */
    mac_address : GlideElement;
    
    /**  */
    vendor : GlideElement;
    
    /** Customer name */
    company : GlideElement;
    
    /**  */
    justification : GlideElement;
    
    /**  */
    model_number : GlideElement;
    
    /**  */
    department : GlideElement;
    
    /** Person using or primarily responsible for this item */
    assigned_to : GlideElement;
    
    /**  */
    start_date : GlideElement;
    
    /**  */
    comments : GlideElement;
    
    /**  */
    cost : GlideElement;
    
    /**  */
    attestation_status : GlideElement;
    
    /** Operational Technology asset details */
    cmdb_ot_entity : GlideElement;
    
    /**  */
    sys_mod_count : GlideElement;
    
    /** Enable monitoring of the configuration item */
    monitor : GlideElement;
    
    /**  */
    serial_number : GlideElement;
    
    /** Context IP Address */
    ip_address : GlideElement;
    
    /**  */
    model_id : GlideElement;
    
    /** Which CI is this a duplicate of */
    duplicate_of : GlideElement;
    
    /**  */
    sys_tags : GlideElement;
    
    /**  */
    cost_cc : GlideElement;
    
    /**  */
    order_date : GlideElement;
    
    /**  */
    schedule : GlideElement;
    
    /**  */
    support_group : GlideElement;
    
    /**  */
    environment : GlideElement;
    
    /** When the asset is due for check in */
    due : GlideElement;
    
    /**  */
    attested : GlideElement;
    
    /**  */
    correlation_id : GlideElement;
    
    /**  */
    unverified : GlideElement;
    
    /** Attributes that describe the configuration item, usually XML */
    attributes : GlideElement;
    
    /**  */
    location : GlideElement;
    
    /** Associated asset, automatically created along with the CI when model requires it */
    asset : GlideElement;
    
    /**  */
    category : GlideElement;
    
    /**  */
    fault_count : GlideElement;
    
    /**  */
    lease_id : GlideElement;
    
    }
    
    var previous = new previous_proto();
    /** Error types which can be set as the response body of a Scripted REST API */
    namespace sn_ws_err {
    class NotAcceptableError{
    
    constructor(message: string){};
    
    }
    
    class ServiceError{
    
    constructor(){};
    
    /** The detailed error message */
    setDetail(detail: string) {};
    
    /** The error message */
    setMessage(message: string) {};
    
    /** The response status code -- defaults to 500 */
    setStatus(code: number) {};
    
    }
    
    class UnsupportedMediaTypeError{
    
    constructor(message: string){};
    
    }
    
    class ConflictError{
    
    constructor(message: string){};
    
    }
    
    class NotFoundError{
    
    constructor(message: string){};
    
    }
    
    class BadRequestError{
    
    constructor(message: string){};
    
    }
    
    }
    
    /** GlideSession manages all of the information for a user session. You can retrieve this from gs.getSession() */
    class GlideSession{
    
    constructor(){};
    
    /** Get the Time Zone name associated with the user */
    getTimeZoneName() : string {};
    
    /** Store a value in an active session */
    putClientData(name: string, value: string) {};
    
    /** Language used by the user */
    getLanguage() : string {};
    
    /** Gets the current URI for the session */
    getUrlOnStack() : string {};
    
    /** Fetch the value in active session based on the name */
    getClientData(name: string) : string {};
    
    /** Checks if the current session is interactive */
    isInteractive() : bool {};
    
    /** Gets the client IP address */
    getClientIP() : string {};
    
    /** Determines if the current user is currently logged in */
    isLoggedIn() : bool {};
    
    /** Gets the ID of current application, defined as a user preference and set by the application picker */
    getCurrentApplicationId() : string {};
    
    }
    
    /** The scoped GlideSystem (referred to by the variable name 'gs' in any server-side JavaScript) API provides a number of convenient methods to get information about the system, the current logged in user, etc. */
    class GlideSystem{
    /** Returns the (UTC) start of the quarter that was the specified number of months ago adjusted for the timezone of the server */
    monthsAgo(month: number) : string {};
    
    /** Returns the (UTC) end of the hour that was the specified number of hours ago adjusted for the timezone of the server */
    hoursAgoEnd(hours: number) : string {};
    
    /** Gets the date and time for the end of this month in UTC, adjusted for the timezone of the server */
    endOfThisMonth() : string {};
    
    /** Checks if the current session is interactive */
    isInteractive() : bool {};
    
    /** Returns the (UTC) end of the day that was the specified number of days ago adjusted for the timezone of the server */
    daysAgoEnd(daysAgo: number) : string {};
    
    /** Gets the date and time for the beginning of next month in UTC, adjusted for the timezone of the server */
    beginningOfNextMonth() : string {};
    
    /** number of hours ago */
    hoursAgo(hours: number) : string {};
    
    /** Returns the (UTC) end of the quarter that was the specified number of quarters ago adjusted for the timezone of the server */
    quartersAgoEnd(quarters: number) : string {};
    
    /** Gets the date and time for the beginning of this year in UTC, adjusted for the timezone of the server */
    beginningOfThisYear() : string {};
    
    /** Gets the ID of current application, defined as a user preference and set by the application picker */
    getCurrentApplicationId() : string {};
    
    /** Gets the date and time for the end of last year in UTC, adjusted for the timezone of the server */
    endOfLastYear() : string {};
    
    /** Gets the date and time for the end of next year in UTC, adjusted for the timezone of the server */
    endOfNextYear() : string {};
    
    /** Queries an object and returns true if the object is null, undefined, or contains an empty string */
    nil(o: Object) : bool {};
    
    /** Gets the date and time for the beginning of this quarter in UTC, adjusted for the timezone of the server */
    beginningOfThisQuarter() : string {};
    
    /** Determines if debugging is active for a specific scope */
    isDebugging() : bool {};
    
    /** Set the redirect URI for this transaction. This determines the next page the user will see */
    setRedirect(url: string) {};
    
    /** Returns a String of the form :interval,value,operator */
    datePart(interval: string, value: string, operator: string) : string {};
    
    /** Generates a GUID that can be used when a unique identifier is required */
    generateGUID(obj: Object) : string {};
    
    /**  */
    getNewAppScopeCompanyPrefix() : string {};
    
    /** Gets the username, or User ID, of the current user (e.g., abel.tuter) */
    getUserName() : string {};
    
    /** Determines if the UI is running as mobile */
    isMobile() : bool {};
    
    /** Uses the info level to log a message to the system log */
    info(message: string, parm1: Object, parm2: Object, parm3: Object, parm4: Object, parm5: Object) {};
    
    /**  */
    base64Encode(s: string) : string {};
    
    /** Gets the current URI for the session */
    getUrlOnStack() : string {};
    
    /** Returns the (UTC) start of the quarter that was the specified number of months ago adjusted for the timezone of the server */
    monthsAgoStart(month: number) : string {};
    
    /** Gets a string representing the cache version for a CSS file */
    getCssCacheVersionString() : string {};
    
    /** Gets the caller scope name, or returns null if there is no caller */
    getCallerScopeName() : string {};
    
    /**  */
    base64Decode(s: string) : string {};
    
    /** number of minutes ago */
    minutesAgo(minutes: number) : string {};
    
    /** Returns the (UTC) start of the hour that was the specified number of hours ago adjusted for the timezone of the server */
    hoursAgoStart(hours: number) : string {};
    
    /** Uses the warn level to log a message to the system log */
    warn(message: string, parm1: Object, parm2: Object, parm3: Object, parm4: Object, parm5: Object) {};
    
    /** Returns the (UTC) end of next week adjusted for the timezone of the server */
    endOfNextWeek() : string {};
    
    /** Gets the date and time for the beginning of last week in UTC, adjusted for the timezone of the server */
    beginningOfLastWeek() : string {};
    
    /** Determines if the current user has the specified role */
    hasRole(role: string) : bool {};
    
    /** Determines if the current user is currently logged in */
    isLoggedIn() : bool {};
    
    /** Gets the date and time for the end of this week in UTC, adjusted for the timezone of the server */
    endOfThisWeek() : string {};
    
    /** Gets the display name of the current user (e.g., Abel Tuter, as opposed to abel.tuter) */
    getUserDisplayName() : string {};
    
    /** Gets the date and time for the beginning of this week in UTC, adjusted for the timezone of the server */
    beginningOfThisWeek() : string {};
    
    /** Returns a reference to the GlideUser object for the current user */
    getUser() : GlideUser {};
    
    /**  */
    urlDecode(url: string) : string {};
    
    /** Gets the date and time for the beginning of last year in UTC, adjusted for the timezone of the server */
    beginningOfLastYear() : string {};
    
    /** Determines if a database table exists */
    tableExists(name: string) : bool {};
    
    /** Uses the error level to log a message to the system log */
    error(message: string, parm1: Object, parm2: Object, parm3: Object, parm4: Object, parm5: Object) {};
    
    /**  */
    urlEncode(url: string) : string {};
    
    /** Gets the date and time for the end of this year in UTC, adjusted for the timezone of the server */
    endOfThisYear() : string {};
    
    /** Gets the name of the current scope */
    getCurrentScopeName() : string {};
    
    /** Returns (UTC) 24 hours ago adjusted for the timezone of the current session */
    yesterday() : string {};
    
    /** Returns the (UTC) start of the day that was the specified number of days ago adjusted for the timezone of the server */
    daysAgoStart(daysAgo: number) : string {};
    
    /** Gets the date and time for the beginning of last month in UTC, adjusted for the timezone of the server */
    beginningOfLastMonth() : string {};
    
    /** Gets the date and time for the beginning of this month in UTC, adjusted for the timezone of the server */
    beginningOfThisMonth() : string {};
    
    /** Gets the date and time for the beginning of next year in UTC, adjusted for the timezone of the server */
    beginningOfNextYear() : string {};
    
    /** Returns the date of the duration time after January 1 */
    getDurationDate(duration: string) : string {};
    
    /** Adds an error message for the current session */
    addErrorMessage(message: string) {};
    
    /** Returns the (UTC) beginning of the specified week adjusted for the timezone of the current session */
    beginningOfWeek(o: Object) : string {};
    
    /** Returns the (UTC) end of the minute that was the specified number of minutes ago adjusted for the timezone of the serve */
    minutesAgoEnd(minutes: number) : string {};
    
    /** Gets the GlideSession Session ID */
    getSessionID() : string {};
    
    /** Gets the date and time for the end of next month in UTC, adjusted for the timezone of the server */
    endOfNextMonth() : string {};
    
    /** Gets the sys_id of the current user */
    getUserID() : string {};
    
    /** Provides a safe way to call from the sandbox, allowing only trusted scripts to be included */
    include(name: string) : bool {};
    
    /** Returns the (UTC) start of the day that was the specified number of days ago adjusted for the timezone of the server */
    daysAgo(days: number) : string {};
    
    /** Returns the (UTC) start of the minute that was the specified number of minutes ago adjusted for the timezone of the serve */
    minutesAgoStart(minutes: number) : string {};
    
    /** Retrieves a message from UI messages */
    getProperty(key: string, alt: Object) : string {};
    
    /** Returns the (UTC) end of the specified week adjusted for the timezone of the current session */
    endOfWeek(o: Object) : string {};
    
    /** Gets the date and time for the end of last month in UTC, adjusted for the timezone of the server */
    endOfLastMonth() : string {};
    
    /** Uses the debug level to log a message to the system log */
    debug(message: string, parm1: Object, parm2: Object, parm3: Object, parm4: Object, parm5: Object) {};
    
    /** Retrieves a message from UI messages. args is an optional paramter */
    getMessage(id: string, args: ?) : string {};
    
    /** Gets the date and time for the end of this quarter in UTC, adjusted for the timezone of the server */
    endOfThisQuarter() : string {};
    
    /** Queues an event for the event manager */
    eventQueue(name: string, record: GlideRecord, parm1: string, parm2: string, queue: string) {};
    
    /**  */
    xmlToJSON(xmlString: string) : Object {};
    
    /** Adds an info message for the current session */
    addInfoMessage(message: string) {};
    
    /** Gets the date and time for the beginning of next week in UTC, adjusted for the timezone of the server */
    beginningOfNextWeek() : string {};
    
    /**  */
    getMaxSchemaNameLength() : number {};
    
    /** Returns the (UTC) end of last week adjusted for the timezone of the server */
    endOfLastWeek() : string {};
    
    /** Returns the (UTC) start of the quarter that was the specified number of quarters ago adjusted for the timezone of the server */
    quartersAgoStart(quarters: number) : string {};
    
    /** Gets a reference to the current Glide session */
    getSession() : GlideSession {};
    
    }
    
    var gs = new GlideSystem();
    /** The scoped GlideFilter class allows you to determine if a record meets a specified set of requirements. There is no constructor for scoped GlideFilter, it is accessed by using the global object 'GlideFilter' */
    class GlideFilter{
    
    constructor(){};
    
    }
    
    /** The scoped GlideDate class provides methods for performing operations on GlideDate objects, such as instantiating GlideDate objects or working with GlideDate fields */
    class GlideDate{
    
    constructor(){};
    
    /** Gets the date in the given date format */
    getByFormat(format: string) : string {};
    
    /** Returns the month part of a date with no timezone conversion */
    getMonthNoTZ() : number {};
    
    /** Gets the date value stored in the database by the GlideDate object in the internal format, yyyy-MM-dd, and the system time zone, UTC by default */
    getValue() : string {};
    
    /** Returns the year part of a date with no timezone conversion */
    getYearNoTZ() : number {};
    
    /** Gets the duration difference between two GlideDate values */
    subtract(start: GlideDate, end: GlideDate) : GlideDuration {};
    
    /** Gets the date in the current user's display format and time zone */
    getDisplayValue() : string {};
    
    /** Sets the date of the GlideDate object */
    setValue(o: ?) {};
    
    /** Gets the display value in the internal format (yyyy-MM-dd). Note: This method is useful for date or time fields, but not date fields */
    getDisplayValueInternal() : string {};
    
    /** Returns the day part of a date with no timezone conversion */
    getDayOfMonthNoTZ() : number {};
    
    /** Sets a date value using the current user's display format and time zone */
    setDisplayValue(asDisplayed: string) {};
    
    }
    
    /** Custom Parse By Script Result API */
    namespace sn_impex {
    class ImportSetTable{
    
    constructor(){};
    
    /** Defines a string column with the max size */
    addColumn(label: string, maxLength: number) {};
    
    /** Inserts a data row given as a Map<String, String> to import set table */
    insert(rowData: map<string, string>) {};
    
    /** Returns 20 when the user clicks on test load 20 records, in every other case, returns -1 */
    getMaximumRows() : integer {};
    
    /** Defines a JSON column with the max size */
    addJSONColumn(label: string, maxLength: number) {};
    
    /** Defines an XML column with the max size */
    addXMLColumn(label: string, maxLength: number) {};
    
    }
    
    class CSVParser{
    
    constructor(){};
    
    /** This method returns Map where key=column header and value=parsed value in that column */
    parseLineToObject(csv: string, headers: Array<string>, delimiter: string, quoteCharacter: string) : Object {};
    
    /** This method returns list of parsed values */
    parseLineToArray(csv: string, delimiter: string, quoteCharacter: string) : Array<string> {};
    
    }
    
    class ScriptParseResult{
    
    constructor(){};
    
    /** Get the skip flag, if the flag is true, the result is ignored in staging table */
    getSkip() : boolean {};
    
    /** Set the skip flag, if the flag is true, the result is ignored in staging table */
    setSkip(skip: boolean) {};
    
    /** Get all rows of column names and values map */
    getRows() : List<Map<String,String>> {};
    
    /** Add a row of column names and values map into result list */
    addRow(map: Map<String, String>) {};
    
    }
    
    }
    
    /** ServiceNow processors are equivalent to Java servlets. Processors provide a customizable URL endpoint that can execute arbitrary server-side Javascript code and produce output such as TEXT, JSON, or HTML. The GlideScriptedProcessor APIs are used in processor scripts to access the the processor (servlet) capabilities. There are no constructors for the GlideScriptedProcessor APIs. The methods are called using the global variable g_processor. A useful global variable, g_target, is available in processor scripts. It contains the table name extracted from the URL. The URL to a processor has the format: https://<instance name.servicenow.com>/<path endpoint>.do?<parameter endpoint>=<value> where the path endpoint and parameter endpoint are defined on the processor form */
    class GlideScriptedProcessor{
    
    constructor(){};
    
    /** Redirects to the specified URL */
    redirect(url: string) {};
    
    /** Writes the contents of the given string to the response */
    writeOutput(contentType: string, value: string) {};
    
    /** Writes a JSON object to the current URL. Note: Works only in scoped apps */
    writeJSON(jsonObject: ?) {};
    
    }
    
    /** These objects are relevant to Scripted REST APIs and are accessed via the request or response input parameters to Scripted APIs */
    namespace sn_ws_int {
    class WSSoapRequestDocument extends Object{
    }
    
    class RESTAPIResponseStream{
    
    constructor(){};
    
    /** Write an InputStream directly to the response stream. Can be called multiple times. Caller responsible for response format and setting proper Content-Type and status code prior to calling */
    writeStream(inputStream: Object) {};
    
    /** Write a string directly to the response stream. Can be called multiple times. Caller responsible for response format and setting proper Content-Type and status code prior to calling */
    writeString(stringToWrite: string) {};
    
    }
    
    class RESTAPIResponse{
    
    constructor(){};
    
    /** Set response headers from the specified object */
    setHeaders(headers: ?) {};
    
    /** Return stream writer. Caller responsible to set proper content type and status using setStatus and setHeader methods. Caller responsible to populate all headers on response before actually writing to stream */
    getStreamWriter() : sn_ws_int.RESTAPIResponseStream {};
    
    /** Set the Location header */
    setLocation(locationValue: string) {};
    
    /** Set Response Error */
    setError(error: ?) {};
    
    /** Set the Content-Type header */
    setContentType(contentType: string) {};
    
    /** Use the specified object as the response body */
    setBody(body: ?) {};
    
    /** Set response HTTP status code */
    setStatus(code: number) {};
    
    /** Set a response header */
    setHeader(name: string, value: string) {};
    
    }
    
    class WSRequest{
    
    constructor(){};
    
    }
    
    class WSResponse{
    
    constructor(){};
    
    /** Use this variable to assign a response value as a DOM Element */
    soapResponseElement
    
    }
    
    class WSSoapRequestXML extends string{
    }
    
    class RESTAPIRequest{
    
    constructor(){};
    
    /** All headers from the request */
    headers
    
    /** The variable path parameters passed in the request URI as an object */
    pathParams
    
    /** The query parameters from the request as an object */
    queryParams
    
    /** Get the query category (i.e. read replica category) from query parameter 'sysparm_query_category' */
    getRequestedQueryCategory() : string {};
    
    /** Obtain a set of media types that are common between what the client request accepts and what this service is able to produce */
    getSupportedResponseContentTypes() : Object {};
    
    /** The body of the request */
    body : sn_ws_int.RESTAPIRequestBody;
    
    /** The entire query string from the request URI */
    queryString : string;
    
    /** The request URI, excluding domain information */
    uri : string;
    
    /** The entire request URL, including domain */
    url : string;
    
    /** Get the value of a specific header from the request */
    getHeader(headerName: string) : string {};
    
    }
    
    class RESTAPIRequestBody{
    
    constructor(){};
    
    /** Returns the next entry from the request body as an object if request is array. If not an array then returns entire request body as an object */
    nextEntry() : Object {};
    
    /** The request body de-serialized as an object */
    data
    
    /** The request body as a string -- be careful to consider impact to memory */
    dataString : string;
    
    /** The body of the request as a stream. Note, this object provides no functions to manipulate the stream from script. Rather this object can be passed to another API which takes an InputStream as an input parameter */
    dataStream : GlideScriptableInputStream;
    
    /** Return true if request has more entries. Use this in conjunction with nextEntry */
    hasNext() : bool {};
    
    }
    
    }
    
    /** The scoped GlideTime class provides methods for performing operations on GlideTime objects, such as instantiating GlideTime objects or working with GlideTime fields */
    class GlideTime{
    
    constructor(){};
    
    /** Gets the time in the given time format */
    getByFormat(format: string) : string {};
    
    /** Gets the duration difference between two GlideTime values */
    subtract(start: GlideTime, end: GlideTime) : GlideDuration {};
    
    /** Returns hour part of local time 0-11 */
    getHourLocalTime() : number {};
    
    /** Sets a time value using the current user's display format and time zone */
    setDisplayValue(asDisplayed: string) {};
    
    /** Returns hour part of UTC time 0-11 */
    getHourUTC() : number {};
    
    /** Gets the time value stored in the database by the GlideTime object in the internal format, HH:mm:ss, and the system time zone, UTC by default */
    getValue() : string {};
    
    /** Returns minutes part of UTC time */
    getMinutesUTC() : number {};
    
    /** Returns seconds part of time */
    getSeconds() : number {};
    
    /** Gets the time in the current user's display format and time zone */
    getDisplayValue() : string {};
    
    /** Sets the time of the GlideTime object in the internal time zone, which is UTC by default or the value of the glide.sys.internal.tz property, if set */
    setValue(value: ?) {};
    
    /** Gets the display value in the current user's time zone and the internal format (HH:mm:ss). Useful for date/time fields, but not for date fields */
    getDisplayValueInternal() : string {};
    
    /** Returns hour-of-the-day part of local time 0-23 */
    getHourOfDayLocalTime() : number {};
    
    /** Returns the hour-of-the-day part of UTC time 0-23 */
    getHourOfDayUTC() : number {};
    
    /** Returns minutes part of local time */
    getMinutesLocalTime() : number {};
    
    }
    
    /** The Scoped GlideUser API provides access to information about the current user and current user roles. Using the Scoped GlideUser API avoids the need to use the slower GlideRecord queries to get user information */
    class GlideUser{
    
    constructor(){};
    
    /** Gets the user id, or login name, of the current user */
    getName() : string {};
    
    /** Gets the display name of the current user */
    getDisplayName() : string {};
    
    /** Gets the Company ID of the current user */
    getCompanyID() : string {};
    
    /** Determines if the current user has the specified role */
    hasRole(role: string) : bool {};
    
    /** Gets the sys_id of current user */
    getID() : string {};
    
    /** Determines if the current user is a member of the specified group */
    isMemberOf(group: string) : bool {};
    
    /** Saves a user preference value to the database */
    savePreference(name: string, value: string) {};
    
    /** Gets the specified user preference value for the current user */
    getPreference(name: string) : string {};
    
    }
    
    /** The scoped GlideSchedule API provides methods for performing operations on GlideSchedule objects, such as adding new schedule segments to a schedule, determining if a datetime is within the schedule, or setting the schedule timezone */
    class GlideSchedule{
    
    constructor(){};
    
    /** Adds a new schedule segment to the current schedule */
    add(startDate: GlideDateTime, offset: GlideDuration) : GlideDateTime {};
    
    /** Determines the elapsed time in the schedule between two date time values using the timezone of the schedule or, if that is not specified, the timezone of the session */
    duration(startDate: GlideDateTime, endDate: GlideDateTime) : GlideDuration {};
    
    /** Gets the current schedule name */
    getName() : string {};
    
    /** Loads a schedule with the schedule information. If a timezone is not specified or is nil, the current session timezone is used for the schedule */
    load(sysID: string, timeZone: string, excludeSpanID: string) {};
    
    /** Determines if the current schedule is valid. A schedule is valid if it has at least one schedule span */
    isValid() : bool {};
    
    /** Sets the timezone for the current schedule */
    setTimeZone(tz: string) {};
    
    }
    
    /** The Scoped GlideElement API provides methods for dealing with fields and their values. Scoped GlideElement methods are available for the fields of the current GlideRecord */
    class GlideElement{
    
    constructor(){};
    
    /** Gets the currency ISO code for a record */
    getCurrencyCode() : string {};
    
    /** Gets the object's label */
    getLabel() : string {};
    
    /** Gets the name of the field */
    getName() : string {};
    
    /** Gets the value of the attribute on the field in question from the dictionary as a string. To get the value as a string, use getAttribute(string) */
    getBooleanAttribute(attribute: string) : bool {};
    
    /** Determines if the GlideRecord table can be read from */
    canRead() : bool {};
    
    /** Determines if the current field has been modified */
    changes() : bool {};
    
    /** Gets the display value */
    getReferenceDisplayValue() : string {};
    
    /** Gets currency in a string */
    getCurrencyString() : string {};
    
    /** Gets table name for a reference field */
    getReferenceTable() : string {};
    
    /** Gets the reference value */
    getReferenceValue() : string {};
    
    /** Determines whether the field is null */
    nil() : bool {};
    
    /** Gets the currency value in the sessions currency format */
    getSessionDisplayValue() : string {};
    
    /** Gets the decrypted value */
    getDecryptedValue() : string {};
    
    /** Gets the value of the attribute on the field in question from the dictionary as a string. If the attribute is a boolean attribute, use getBooleanAttribute(String) to get the value as a boolean rather than as a string */
    getAttribute(attribute: string) : string {};
    
    /** Gets the currency display value */
    getCurrencyDisplayValue() : string {};
    
    /** Gets the sessions currency ISO code */
    getSessionCurrencyCode() : string {};
    
    /** Gets a currency value */
    getCurrencyValue() : string {};
    
    /** The currency ISO code, in the base system currency */
    getReferenceCurrencyCode() : string {};
    
    /** Determines if the new value of a field after a change matches a certain object */
    changesTo(value: ?) : bool {};
    
    /** Retrieves the choice list for a field */
    getChoices(dependent: string) : [] {};
    
    /** Gets the table name */
    getTableName() : string {};
    
    /** Determines whether a field has a particular attribute */
    hasAttribute(attribute: string) : bool {};
    
    /** Sets a date to a numeric value */
    setDateNumericValue(value: ?) {};
    
    /** Sets the display value of the field */
    setDisplayValue(value: ?) {};
    
    /** Gets a GlideRecord object for a reference element */
    getRefRecord() : GlideRecord {};
    
    /** Determines if the GlideRecord table can be written to */
    canWrite() : bool {};
    
    /** Determines the previous value of the current field matched a certain object */
    changesFrom(value: ?) : bool {};
    
    /** Determines if the user's role permits creation of new records in this field */
    canCreate() : bool {};
    
    /** Gets the field's element descriptor */
    getED() : GlideElementDescriptor {};
    
    /** Gets the ammount in the sessions currency */
    getSessionValue() : string {};
    
    /** Gets date in numberic value */
    dateNumericValue(value: string) : number {};
    
    /** Adds an error message. Can be retrieved using getError() */
    setError(message: string) {};
    
    /** Sets the display value of the field */
    setValue(value: ?) {};
    
    /** Gets the formatted display value of the field */
    getDisplayValue(maxCharacters: number) : string {};
    
    /** Converts the value to a string */
    toString() : string {};
    
    }
    
    /** The scoped GlideDateTime default constructor, instantiates a new GlideDateTime object with the current date and time in Greenwich Mean Time (GMT). Optional 'value' parameter with a date and time value in the UTC time zone specified with the format yyyy-MM-dd HH:mm:ss */
    class GlideDateTime{
    
    constructor(value: string){};
    
    /** Gets the day of the week stored by the GlideDateTime object, expressed in the user's time zone */
    getDayOfWeekLocalTime() : number {};
    
    /** Returns true if the object's data time is before the input argument */
    before(object: GlideDateTime) : bool {};
    
    /** Adds a specified number of weeks to the current GlideDateTime object, expressed in the UTC time zone */
    addWeeksUTC(amount: number) {};
    
    /** Sets the day of the month to a specified value in the user's time zone */
    getDaysInMonthLocalTime() : number {};
    
    /** Sets the month stored by the GlideDateTime object to a specified value using the UTC time zone */
    setMonthUTC(month: number) {};
    
    /** Compares two GlideDateTime objects */
    compareTo(object: GlideDateTime) : number {};
    
    /** Sets the date and time of the current object using an existing GlideDateTime object. This method is equivalent to instantiating a new object with a GlideDateTime parameter */
    setGlideDateTime(gdt: GlideDateTime) {};
    
    /** Sets the month stored by the GlideDateTime object to a specified value using the current user's time zone */
    setMonthLocalTime(month: number) {};
    
    /** Gets the month stored by the GlideDateTime object, expressed in the current user's time zone */
    getMonthLocalTime() : number {};
    
    /** Gets the date for the user's time zone */
    getLocalDate() : GlideDate {};
    
    /** Sets the year stored by the GlideDateTime object to a specified value using the UTC time zone */
    setYearUTC(year: number) {};
    
    /** Gets the day of the week stored by the GlideDateTime object, expressed in the UTC time zone */
    getDayOfWeekUTC() : number {};
    
    /** Gets the number of the current week of the current year */
    getWeekOfYearUTC() : number {};
    
    /** Sets the day of the month to a specified value in the local time zone */
    setDayOfMonthLocalTime(day: number) {};
    
    /** Adds a specified number of years to the current GlideDateTime object, expressed in the UTC time zone */
    addYearsUTC(amount: number) {};
    
    /** Returns true if the object's data time is on or after the input argument */
    onOrAfter(object: GlideDateTime) : bool {};
    
    /** Adds a GlideTime object to the current GlideDateTime object */
    add(gt: GlideTime) {};
    
    /** Returns local time with internal time format */
    getInternalFormattedLocalTime() : string {};
    
    /** Gets the duration difference between two GlideDateTime values. Pass a single paramter which specifies milliseconds to subtract from the current GlideDateTime object */
    subtract(start: GlideDateTime, end: GlideDateTime) : GlideDuration {};
    
    /** Gets the number of the week stored by the GlideDateTime object, expressed in the user's time zone */
    getWeekOfYearLocalTime() : number {};
    
    /**  */
    getDisplayValueWithoutTZ() : string {};
    
    /** Sets a date and time value using the current user's display format and time zone. Also set an optional parameter 'format', to set date and time format */
    setDisplayValue(value: string, format: string) {};
    
    /** Returns local time with user time format */
    getUserFormattedLocalTime() : string {};
    
    /** Gets the month stored by the GlideDateTime object, expressed in the UTC time zone */
    getMonthUTC() : number {};
    
    /** Adds a specified number of seconds to the current GlideDateTime object */
    addSeconds(value: number) {};
    
    /** Gets the number of days in the month stored by the GlideDateTime object, expressed in the UTC time zone */
    getDaysInMonthUTC() : number {};
    
    /** Returns a GlideTime object that represents the time portion of the GlideDateTime object in the user's time zone */
    getLocalTime() : GlideTime {};
    
    /** Adds a specified number of years to the current GlideDateTime object, expressed in the user's time zone */
    addYearsLocalTime(amount: number) {};
    
    /** Gets the year stored by the GlideDateTime object, expressed in the current user's time zone */
    getYearLocalTime() : number {};
    
    /** Gets the day of the month stored by the GlideDateTime object, expressed in the UTC time zone */
    getDayOfMonthUTC() : number {};
    
    /** Gets the number of milliseconds since January 1, 1970, 00:00:00 Greenwich Mean Time (GMT) */
    getNumericValue() : number {};
    
    /** Returns a GlideTime object that represents the time portion of the GlideDateTime object */
    getTime() : GlideTime {};
    
    /** Determines if an object's time uses a daylight savings offset */
    isDST() : bool {};
    
    /** Adds a specified number of months to the current GlideDateTime object, expressed in the UTC time zone */
    addMonthsUTC(amount: number) {};
    
    /** Adds a specified number of days to the current GlideDateTime object, expressed in the user's timezone */
    addDaysLocalTime(amount: number) {};
    
    /** Gets the amount of time that daylight savings time is offset */
    getDSTOffset() : number {};
    
    /**  */
    hashCode() : number {};
    
    /** Adds a specified number of months to the current GlideDateTime object, expressed in the user's time zone */
    addMonthsLocalTime(amount: number) {};
    
    /** Gets the display value in the internal datetime format */
    getDisplayValueInternal() : string {};
    
    /** Gets the day of the month stored by the GlideDateTime object, expressed in the current user's time zone */
    getDayOfMonthLocalTime() : number {};
    
    /** Gets the date in the system time zone */
    getDate() : GlideDate {};
    
    /** Returns true if the object's data time is after the input argument */
    after(object: GlideDateTime) : bool {};
    
    /** Gets the current error message */
    getErrorMsg() : string {};
    
    /**  */
    getTZOffset() : number {};
    
    /** Sets a date and time value using the internal format and the current user's time zone */
    setDisplayValueInternal(value: string) {};
    
    /** Returns true if the object's data time is on or before the input argument */
    onOrBefore(object: GlideDateTime) : bool {};
    
    /** Sets the day of the month to a specified value in the UTC time zone */
    setDayOfMonthUTC(day: number) {};
    
    /** Determines if a value is a valid datetime */
    isValid() : bool {};
    
    /** Determines if an object's date is set */
    hasDate() : bool {};
    
    /** Sets the year stored by the GlideDateTime object to a specified value using the current user's time zone */
    setYearLocalTime(year: number) {};
    
    /** Sets a date and time value using the UTC time zone and the specified date and time format */
    setValueUTC(dt: string, format: string) {};
    
    /** Gets a datetiime value in the same format as it is stored in the database */
    getValue() : string {};
    
    /** Gets the year stored by the GlideDateTime object, expressed in the UTC time zone */
    getYearUTC() : number {};
    
    /**  */
    equals(object: GlideDateTime) : bool {};
    
    /** Gets the datetime in the current user's display format and time zone */
    getDisplayValue() : string {};
    
    /** Sets the date and time */
    setValue(value: number) {};
    
    /** Converts a datetime value to a string */
    toString() : string {};
    
    /** Adds a specified number of days to the current GlideDateTime object, expressed in the UTC time zone */
    addDaysUTC(amount: number) {};
    
    /** Adds a specified number of weeks to the current GlideDateTime object, expressed in the user's timezone */
    addWeeksLocalTime(amount: number) {};
    
    }
    
    /** The Scoped GlideDBFunctionBuilder provides a builder API for creating platform function definition */
    class GlideDBFunctionBuilder{
    
    constructor(){};
    
    /** Start an addition function */
    add() : GlideDBFunctionBuilder {};
    
    /** Add a constant parameter to the current function */
    constant(constant: string) : GlideDBFunctionBuilder {};
    
    /** End the current function */
    endfunc() : GlideDBFunctionBuilder {};
    
    /** Start a subtraction function */
    subtract() : GlideDBFunctionBuilder {};
    
    /** Start a length function */
    length() : GlideDBFunctionBuilder {};
    
    /** Start a function that will return the first non-null value in a list of values */
    coalesce() : GlideDBFunctionBuilder {};
    
    /** Start a concatenation function */
    concat() : GlideDBFunctionBuilder {};
    
    /** Start a function that will return a substring when given a string and an integer position. Optionally a third length parameter can be included to limit the length of the resulting substring. */
    substring() : GlideDBFunctionBuilder {};
    
    /** Start a function that return the duration between 2 dates */
    datediff() : GlideDBFunctionBuilder {};
    
    /** Add a field parameter to the current function */
    field(fieldName: string) : GlideDBFunctionBuilder {};
    
    /** Return the completed function definition */
    build() : string {};
    
    /** Start a function that returns the current timestamp in the UTC timezone. This function should be used as a parameter to the datediff function to calculate a duration between the current datetime and another datetime field or datetime constant */
    now() : GlideDBFunctionBuilder {};
    
    /** Start a function that returns the day of the week of a given date */
    dayofweek() : GlideDBFunctionBuilder {};
    
    /** Start a division function */
    divide() : GlideDBFunctionBuilder {};
    
    /** Start a function that will return the first occurrence of a substring within a string. Takes optional search start position as third arg. */
    position() : GlideDBFunctionBuilder {};
    
    /** Start a multiplication function */
    multiply() : GlideDBFunctionBuilder {};
    
    }
    
    /** MetricBase JavaScript API */
    namespace sn_clotho {
    class TransformResult{
    
    constructor(){};
    
    /** Returns a series with the specified label */
    getByLabel(label: string) : sn_clotho.Data {};
    
    /** Returns a mapping of group names to their series */
    byGroup() : map {};
    
    /** Returns the all series of this TransformResult in the form of an array */
    toArray() : [sn_clotho.Data] {};
    
    /** Returns this result's series, assuming that there is a single resultant series */
    getData() : sn_clotho.Data {};
    
    }
    
    class Transformer{
    
    constructor(gr: GlideRecord){};
    
    /** Specifies the metric field that this transformer operates on */
    metric(metricName: string) : sn_clotho.TransformPart {};
    
    /** Groups the subject records by the specified field */
    groupBy(field: string) : sn_clotho.TransformPart {};
    
    /** Executes the transforms defined by this transformer over the specified time range and returns an object containing the results */
    execute(rangeStart: GlideDateTime, rangeEnd: GlideDateTime) : sn_clotho.TransformResult {};
    
    }
    
    class DataBuilder{
    
    constructor(cx: Context, args: [object], ctorObj: Function, inNewExpr: boolean){};
    
    /** Adds the specified value to the data at the specified time */
    add(start: GlideDateTime, value: number) : sn_clotho.DataBuilder {};
    
    }
    
    class TransformPart{
    
    constructor(){};
    
    /** Subtracts the specified constant quantity from all values */
    sub(substrahend: number) : sn_clotho.TransformPart {};
    
    /** Multiplies all values by the specified constant quantity */
    mul(factor: number) : sn_clotho.TransformPart {};
    
    /** Performs a logarithm on all values with the specified constant base */
    log(base: number) : sn_clotho.TransformPart {};
    
    /** Produces a new series where each value is the sum of all of the values at each timestamp */
    sum() : sn_clotho.TransformPart {};
    
    /** Groups the subject records by the specified field */
    groupBy(field: string) : sn_clotho.TransformPart {};
    
    /** Divides all values by the specified constant quantity */
    div(divisor: number) : sn_clotho.TransformPart {};
    
    /** Fits the series to the specified model using the specified parameters */
    fit(_params: object) : sn_clotho.TransformPart {};
    
    /** Produces a new series where each value is the average of all of the values at each timestamp */
    avg() : sn_clotho.TransformPart {};
    
    /** Produces a new series with the smallest values at each timestamp */
    min() : sn_clotho.TransformPart {};
    
    /** Produces a new series with the values filtered (AVG, MAX, MIN or LAST) by non-overlapping windows */
    partition(_aggregator: string, _window: string, _base: string) : sn_clotho.TransformPart {};
    
    /** Produces a set of series with the top 'count' (specified) largest values at each timestamp */
    top(count: number) : sn_clotho.TransformPart {};
    
    /** Limits the number of data points in each series to the specified count */
    limit(count: number) : sn_clotho.TransformPart {};
    
    /** Produces a set of new series by specified condition */
    where(condition: Condition) : sn_clotho.TransformPart {};
    
    /** Produces a new series with the standard deviation of the values at each timestamp */
    stddev() : sn_clotho.TransformPart {};
    
    /** Floors all values to the specified precision */
    floor(precision: number) : sn_clotho.TransformPart {};
    
    /** Produces a set of series where each is one of the specified percentiles of all of the data */
    fractiles(fractions: [number]) : sn_clotho.TransformPart {};
    
    /** Adds the specified constant quantity to all values */
    add(summand: number) : sn_clotho.TransformPart {};
    
    /** Produces a new series with the largest values at each timestamp */
    max() : sn_clotho.TransformPart {};
    
    /** Produces a set of series with the bottom 'count' (specified) smallest values at each timestamp */
    bottom(count: number) : sn_clotho.TransformPart {};
    
    /** Produces a new series that counts the number of series with values in the input */
    count() : sn_clotho.TransformPart {};
    
    /** Populates missing (NaN) values with two-point linear regression using the specified tolerance for maximum range of missing data */
    interpolate(countOrDuration: object) : sn_clotho.TransformPart {};
    
    /** Labels this series */
    label(label: string) : sn_clotho.TransformPart {};
    
    /** Ceils all values to the specified precision */
    ceil(precision: number) : sn_clotho.TransformPart {};
    
    /** Produces a new series with the values filtered (AVG, MAX, MIN or LAST) by sliding windows */
    filter(_aggregator: string, _window: string) : sn_clotho.TransformPart {};
    
    /** Produces a new series with the median of the values at each timestamp */
    median() : sn_clotho.TransformPart {};
    
    /** Rounds all values to the specified precision */
    round(precision: number) : sn_clotho.TransformPart {};
    
    /** Specifies the metric field that this transformer operates on */
    metric(metricName: string) : sn_clotho.TransformPart {};
    
    /** Includes this intermediate transform as part of the result */
    collect() : sn_clotho.TransformPart {};
    
    /** Aligns all series to have the specified number of data points */
    resample(numValues: number) : sn_clotho.TransformPart {};
    
    }
    
    class Data{
    
    constructor(){};
    
    /** Returns the value of the subject this series operates on */
    getSubject() : string {};
    
    /** Converts the specified model string into a series */
    fromModelString(model: string) : sn_clotho.Data {};
    
    /** Returns the label of this series */
    getLabel() : string {};
    
    /** Returns the start time of this series */
    getStart() : GlideDateTime {};
    
    /** Returns the number of values in this series */
    size() : number {};
    
    /** Returns the values in this series in the form of an array of numbers */
    getValues() : [number] {};
    
    /** Returns the name of the table this series operates on */
    getTableName() : string {};
    
    /** Returns the name of the metric this series operates on */
    getMetricName() : string {};
    
    /** Converts this series into a model string */
    toModelString() : string {};
    
    /** Returns the end time of this series */
    getEnd() : GlideDateTime {};
    
    /** Returns the period of this series */
    getPeriod() : number {};
    
    }
    
    class Client{
    
    constructor(){};
    
    /** Performs the specified transform(s) over the specified range */
    transform(o1: object, o2: GlideDateTime, o3: GlideDateTime) : object {};
    
    /** Uses the specified DataBuilder to put data into MetricBase */
    put(dataBuilder: sn_clotho.DataBuilder) {};
    
    }
    
    }
    
    /** GlideLocale is a global object that can be called in scripts. Use the get() method to get a GlideLocale object */
    class GlideLocale{
    
    constructor(){};
    
    /** Returns the decimal separator */
    getGroupingSeparator() : string {};
    
    /** Returns the grouping separator */
    getDecimalSeparator() : string {};
    
    }
    
    /** The scoped XMLNodeIterator class allows you to iterate through a node of a XML document */
    class XMLNodeIterator{
    
    constructor(){};
    
    /** Gets the next element in the iteration */
    next() : XMLNode {};
    
    /** Determines if the iteration has more elements */
    hasNext() : bool {};
    
    }
    `
    
    var serverglobal =`
/** ServiceNow processors are equivalent to Java servlets. Processors provide a customizable URL endpoint that can execute arbitrary server-side Javascript code and produce output such as TEXT, JSON, or HTML. The GlideServletRequest API is used in processor scripts to access the HttpServletRequest object. The GlideServletRequest object provides a subset of the HttpServletRequest APIs. The methods are called using the global variable g_request. A useful global variable, g_target, is available in processor scripts. It contains the table name extracted from the URL. The URL to a processor has the format: https://<instance name.servicenow.com>/<path endpoint>.do?<parameter endpoint>=<value> where the path endpoint and parameter endpoint are defined on the processor form */
class GlideServletRequest{

    constructor(){};
    
    /** Returns an array of headers as a string */
    getHeaders(name: string) : [string] {};
    
    /** Returns an array of header names as a string */
    getHeaderNames() : [string] {};
    
    /** Returns the query string from the request */
    getQueryString() : string {};
    
    /** Returns the content type */
    getContentType() : string {};
    
    /** Returns an array of parameter names as a string */
    getParameterNames() : [string] {};
    
    /** Returns the header */
    getHeader(name: string) : string {};
    
    /** Returns an object */
    getParameter(name: string) : ? {};
    
    }
    
    /** The scoped XMLNode API allows you to query values from XML nodes. XMLNodes are extracted from XMLDocument2 objects, which contain XML strings */
    class XMLNode{
    
    constructor(){};
    
    /** Gets the node's value */
    getNodeValue() : string {};
    
    /**  */
    appendChild(newChild: XMLNode) {};
    
    /**  */
    setAttribute(attribute: string, value: string) {};
    
    /** Gets the node's XMLNodeIterator object */
    getChildNodeIterator() : XMLNodeIterator {};
    
    /** Gets the value of the specified attribute */
    getAttribute(attribute: string) : string {};
    
    /** Determines if the node has the specified attribute */
    hasAttribute(attribute: string) : bool {};
    
    /** Gets the node's first child node */
    getFirstChild() : XMLNode {};
    
    /** Gets the node's string value */
    toString() : string {};
    
    /** Gets the node's text content */
    getTextContent() : string {};
    
    /** Gets the node's name */
    getNodeName() : string {};
    
    /** Gets the node's last child node */
    getLastChild() : XMLNode {};
    
    }
    
    /** The API allows you to evaluate scripts from a GlideRecord field */
    class GlideScopedEvaluator{
    
    constructor(){};
    
    /** Evaluates a script from a GlideRecord field. variables parameter is optional */
    evaluateScript(gr: GlideRecord, scriptField: string, variables: ?) : ? {};
    
    /** Puts a variable into the GlideScopedEvaluator object */
    putVariable(name: string, value: ?) {};
    
    /** Gets a variable from a GlideScopedEvaluator object */
    getVariable(name: string) : ? {};
    
    }
    
    /** The Scoped GlideTableHierarchy API provides methods for handling information about table relationships */
    class GlideTableHierarchy{
    
    constructor(){};
    
    /** Returns true of this class has been extended */
    hasExtensions() : bool {};
    
    /** Returns the table's name */
    getName() : string {};
    
    /** Returns true if this table is not in a hierarchy */
    isSoloClass() : bool {};
    
    /** Returns a list of the table names in the hierarchy */
    getTables() : [] {};
    
    /** Returns a list of all tables that extend the current table and includes the current table */
    getAllExtensions() : [] {};
    
    /** Returns true if this is a base class */
    isBaseClass() : bool {};
    
    /** Returns a list of all tables that extend the current table */
    getTableExtensions() : [] {};
    
    /** Returns the parent class */
    getBase() : string {};
    
    /** Returns the top level class in the hierarchy */
    getRoot() : string {};
    
    /** Returns a list of all classes in the hierarchy of the given table */
    getHierarchy() : [] {};
    
    }
    
    /** Scoped API for PluginManager */
    class GlidePluginManager{
    
    constructor(){};
    
    /** Determine if a plugin is activated */
    isActive(pluginID: string) : bool {};
    
    }
    
    /** Authentication API */
    namespace sn_auth {
    class GlideOAuthClient{
    
    constructor(){};
    
    /** Revokes the access or refresh token for the client, with the request and optional header parameters set into a GlideOAuthClientRequest object */
    revokeToken(clientName: string, accessToken: string, refreshToken: string, request: GlideOAuthClientRequest) : sn_auth.GlideOAuthClientResponse {};
    
    /** Retrieves the token for the client, with the request and optional header parameters set into a GlideOAuthClientRequest object */
    requestTokenByRequest(clientName: string, request: GlideOAuthClientRequest) : sn_auth.GlideOAuthClientResponse {};
    
    /** Retrieves the token for the client, with the request parameters encoded in JSON format */
    requestToken(clientName: string, jsonString: string) : sn_auth.GlideOAuthClientResponse {};
    
    }
    
    class GlideOAuthClientRequest{
    
    constructor(){};
    
    /** Retrieves the refresh token */
    getRefreshToken() : string {};
    
    /** Sets the password with the string you provide */
    setPassword(password: string) {};
    
    /** Retrieves the HTTP headers */
    getHeaders() : ? {};
    
    /** Sets the HTTP headers for the nave:value pair that you provide */
    setHeader(name: string, value: string) {};
    
    /** Retrieves the HTTP headers for the string you provide */
    getHeader(name: string) {};
    
    /** Retrieves the password */
    getPassword() : string {};
    
    /** Sets the user name with the string you provide */
    setUserName(userName: string) {};
    
    /** Sets the parameters for the name:value pair of strings you provide */
    setParameter(name: string, value: string) {};
    
    /** Retrieves the grant type */
    getGrantType() {};
    
    /** Sets the grant type with the string you provide */
    setGrantType() {};
    
    /** Retrieves the user name */
    getUserName() : string {};
    
    /** Sets the scope with the string you provide */
    setScope(scope: string) {};
    
    /** Sets the refresh token with the string you provide */
    setRefreshToken(refreshToken: string) {};
    
    /** Retrieves the scope */
    getScope() : string {};
    
    /** Retrieves the parameter for the parameter name you provide */
    getParameter(name: string) {};
    
    }
    
    class GlideOAuthClientResponse{
    
    constructor(){};
    
    /** Retrieves the response content from an external OAuth provider. The response is in a name:value pair */
    getResponseParameters() : ? {};
    
    /** Retrieves all of the response information, including instance information */
    getBody() : string {};
    
    /** Retrieves the refresh token */
    getToken() : sn_auth.GlideOAuthToken {};
    
    /** Retrieves the HTTP response code from the external OAuth provider */
    getResponseCode() : string {};
    
    /** Retrieves the HTTP response content header from an external OAuth provider */
    getContentType() : string {};
    
    /** Retrieves the error message if authentication is not successful */
    getErrorMessage() : string {};
    
    }
    
    class GlideOAuthToken{
    
    constructor(){};
    
    /** Retrieves the refresh token */
    getRefreshToken() : number {};
    
    /** Retrieves the sys_id of the refresh token */
    getRefreshTokenSysID() : string {};
    
    /** Retrieves the lifespan of the access token in seconds */
    getExpiresIn() : number {};
    
    /** Retrieves the sys_id of the token ID */
    getAccessTokenSysID() : string {};
    
    /** Retrieves the scope, which is the amount of access granted by the access token */
    getScope() : string {};
    
    /** Retrieves the access token */
    getAccessToken() : string {};
    
    }
    
    }
    
    /** Scoped GlideRecord is used for database operations instead of writing SQL queries. Provides data access APIs to retrieve, update, and delete records from a table */
    class GlideRecord{
    
    constructor(tableName: string){};
    
    /** Retrieves the last error message */
    getLastErrorMessage() : string {};
    
    /** The label of the field as a String */
    getLabel() : string {};
    
    /** Adds a filter to return records based on a relationship in a related table */
    addJoinQuery(joinTable: string, primaryField: ?, joinTableField: ?) : GlideQueryCondition {};
    
    /** Sets the value of category for the query */
    setCategory(category: string) {};
    
    /** Adds a filter to return active records */
    addActiveQuery() : GlideQueryCondition {};
    
    /** Determines if the Access Control Rules which include the user's roles permit deleting records in this table */
    canDelete() : bool {};
    
    /** Sets a flag to indicate if the next database action (insert, update, delete) is to be aborted */
    setAbortAction(b: bool) {};
    
    /** Retrieves the number of rows in the GlideRecord */
    getRowCount() : number {};
    
    /** Retrieve the specified platform function in addition of the field values */
    addFunction(functionDefinition: string) {};
    
    /** Runs the query against the table based on the specified filters by addQuery and addEncodedQuery */
    query() {};
    
    /** Retrieves the table name associated with this GlideRecord */
    getTableName() : string {};
    
    /** Gets the optional category value of the query */
    getCategory() : string {};
    
    /** Specifies a descending orderBy */
    orderByDesc(fieldName: string) {};
    
    /** Determines if there are any more records in the GlideRecord */
    hasNext() : bool {};
    
    /**  */
    getClassDisplayValue() : string {};
    
    /** Checks if the current record is a new record that has not yet been inserted into the database */
    isNewRecord() : bool {};
    
    /** Retrieves the query condition of the current result set as an encoded query string */
    getEncodedQuery() : string {};
    
    /** Updates each GlideRecord in the list with any changes that have been made */
    updateMultiple() {};
    
    /** Retrieves the class name for the current record */
    getRecordClassName() : string {};
    
    /**  */
    autoSysFields(b: bool) {};
    
    /** Retrieves the name of the display field */
    getDisplayName() : string {};
    
    /** Adds a filter to return records by specifying a field and a value it should equal */
    addQuery(name: string, value: string) : GlideQueryCondition {};
    /** Adds a filter to return records based on a field, an operator, and a value */
    addQuery(name: string, operator: string, value: string) : GlideQueryCondition {};
    
    /** Sets the maximum number of records in the GlideRecord to be fetched in the next query */
    setLimit(limit: number) {};
    
    /** Gets the primary key of the record, which is usually the sys_id unless otherwise specified */
    getUniqueValue() : string {};
    
    /** Moves to the next record in the GlideRecord */
    next() : bool {};
    
    /** Deletes records that satisfy current query condition */
    deleteMultiple() {};
    
    /** Determines if the Access Control Rules which include the user's roles permit reading records in this table */
    canRead() : bool {};
    
    /** Insert a new record using the field values that have been set for the current record */
    insert() : string {};
    
    /** Updates the current GlideRecord with any changes that have been made */
    update(reason: ?) : string {};
    
    /** Specifies an orderBy column */
    orderBy(fieldName: string) {};
    
    /** Adds a filter to return records where the specified field is not null */
    addNotNullQuery(fieldName: string) : GlideQueryCondition {};
    
    /** Adds a filter to return records where the specified field is null */
    addNullQuery(fieldName: string) : GlideQueryCondition {};
    
    /** Adds an encoded query to the other queries that may have been set */
    addEncodedQuery(query: string) {};
    
    /** Gets the attributes on the field in question from the dictionary */
    getAttribute(attribute: string) : string {};
    
    /** Defines a GlideRecord based on the specified expression of name = value */
    get(name: ?, value: ?) : bool {};
    
    /** Determines if current record is a valid record */
    isValidRecord() : bool {};
    
    /** Sets sys_id value for the current record */
    setNewGuidValue(guid: string) {};
    
    /** Determines whether the table exists or not */
    isValid() : bool {};
    
    /** Determines whether the current database action is to be aborted. Available in Fuji patch 3 */
    isActionAborted() : bool {};
    
    /** Sets a range of rows to be returned by subsequent queries. If forceCount is true, getRowCount() method will return all possible records */
    chooseWindow(firstRow: number, lastRow: number, forceCount: bool) {};
    
    /** Determines if the Access Control Rules which include the user's roles permit editing records in this table */
    canWrite() : bool {};
    
    /** Provide additional options for text search query */
    setTextSearchOpts(textSearchOpts: ?) {};
    
    /** Determines if the Access Control Rules which include the user's roles permit inserting new records in this table */
    canCreate() : bool {};
    
    /** Enables and disables the running of business rules and script engines. When disabled, inserts and updates are not audited */
    setWorkflow(e: bool) {};
    
    /** Retrieves the underlying value of a field */
    getValue(fieldName: string) : string {};
    
    /** Retrieves a link to the current record */
    getLink(nostack: bool) : string {};
    
    /** Retrieves the GlideElement for a specified field */
    getElement(fieldName: string) : GlideElement {};
    
    /** Sets the value for the specified field. */
    setValue(fieldName: string, value: ?) {};
    
    /** Retrieves the display value for the current record */
    getDisplayValue(fieldName: string) : string {};
    
    /** Determines if the given field is defined in the current table */
    isValidField(fieldName: string) : bool {};
    
    /** Creates an empty record suitable for population before an insert */
    initialize() {};
    
    /** Retrieves the current operation being performed, such as insert, update, or delete */
    operation() : string {};
    
    /** Creates a new GlideRecord, sets the default values for the fields, and assigns a unique ID to the record */
    newRecord() {};
    
    /** Deletes the current record */
    deleteRecord() : bool {};
    
    }
    
    /** Web Services API, to send a message to a web service provider */
    namespace sn_ws {
    class RESTResponseV2{
    
    constructor(){};
    
    /** Get the numeric HTTP status code returned by the REST provider */
    getStatusCode(name: string) : number {};
    
    /** Deprecated -- use getAllHeaders instead */
    getHeaders() : Object {};
    
    /** Set the amount of time the instance waits for the response */
    waitForResponse(timeoutSecs: number) {};
    
    /** Get the content of the REST response body */
    getBody() : string {};
    
    /** Get the numeric error code, if there was an error during the REST transaction */
    getErrorCode() : number {};
    
    /** Get the error message if there was an error during the REST transaction */
    getQueryString() : string {};
    
    /** Get all headers returned in the REST response and the associated values */
    getAllHeaders() : [GlideHTTPHeader] {};
    
    /** Indicate if there was an error during the REST transaction */
    haveError() : bool {};
    
    /** Get the value for a specified header */
    getHeader(name: string) : string {};
    
    /** Get the query used for this request */
    getErrorMessage() : string {};
    
    }
    
    class SOAPMessageV2{
    
    constructor(soapMessage: string, soapFunction: string){};
    
    /** Configure the SOAP message to be sent through a MID Server */
    setMIDServer(midServerName: string) {};
    
    /** Get the content of the SOAP message body */
    getRequestBody() : string {};
    
    /** Get the value for an HTTP header specified by the SOAP client */
    getRequestHeader(headerName: string) : string {};
    
    /** Set basic authentication headers for the SOAP message */
    setBasicAuth(userName: string, userPass: string) {};
    
    /** Set WS-Security Username token */
    setWSSecurityUsernameToken(username: string, password: string) {};
    
    /** Set an HTTP header in the SOAP message to the specified value */
    setRequestHeader(headerName: string, headerValue: string) {};
    
    /** Get the URL of the endpoint for the SOAP message */
    getEndpoint() : string {};
    
    /** Set WS-Security X.509 token */
    setWSSecurityX509Token(keystoreId: string, keystoreAlias: string, keystorePassword: string, certificateId: string) {};
    
    /** Set a variable from the SOAP message record to the specified value without escaping XML reserved characters */
    setStringParameterNoEscape(name: string, value: string) {};
    
    /** Send the SOAP Message to the endpoint */
    execute() : sn_ws.SOAPResponse {};
    
    /** Set the amount of time the request waits for a response from the web service provider before the request times out */
    setHttpTimeout(timeoutMs: number) {};
    
    /** Set the endpoint for the SOAP message */
    setEndpoint(endpoint: string) {};
    
    /** Set the body content to send to the web service provider */
    setRequestBody(requestBody: string) {};
    
    /** Get name and value for all HTTP headers specified by the SOAP client */
    getRequestHeaders() : Object {};
    
    /** Set a variable from the SOAP message record to the specified value */
    setStringParameter(name: string, value: string) {};
    
    /** Define the SOAP action this SOAP message performs */
    setSOAPAction(soapAction: string) {};
    
    /** Set the mutual authentication protocol profile for the SOAP message */
    setMutualAuth(profileName: string) {};
    
    /** Associate outbound requests and the resulting response record in the ECC queue */
    setEccCorrelator(correlator: string) {};
    
    /** Set web service security values for the SOAP message */
    setWSSecurity(keystoreId: string, keystoreAlias: string, keystorePassword: string, certificateId: string) {};
    
    /** Override a value from the database by writing to the SOAP message payload */
    setEccParameter(name: string, value: string) {};
    
    /** Send the SOAP Message to the endpoint asynchronously */
    executeAsync() : sn_ws.SOAPResponse {};
    
    }
    
    class SOAPResponseV2{
    
    constructor(){};
    
    /** Get the numeric HTTP status code returned by the SOAP provider */
    getStatusCode() : number {};
    
    /** Deprecated -- use getAllHeaders instead */
    getHeaders() : Object {};
    
    /** Set the amount of time the instance waits for a response */
    waitForResponse(timeoutSecs: number) {};
    
    /** Get the content of the SOAP response body */
    getBody() : string {};
    
    /** Get the numeric error code if there was an error during the SOAP transaction */
    getErrorCode() : number {};
    
    /** Get all HTTP headers returned in the SOAP response and the associated values */
    getAllHeaders() : [GlideHTTPHeader] {};
    
    /** Indicate if there was an error during the SOAP transaction */
    haveError() : bool {};
    
    /** Get the value for a specified HTTP header */
    getHeader(name: string): string {};
    
    /** Get the error message if there was an error during the SOAP transaction */
    getErrorMessage() : string {};
    
    }
    
    class RESTMessageV2{
    
    constructor(name: string, methodName: string){};
    
    /** Configure the REST message to communicate through a MID Server */
    setMIDServer(midServer: string) {};
    
    /** Get the content of the REST message body */
    getRequestBody() : string {};
    
    /** Get the value for an HTTP header specified by the REST client */
    getRequestHeader(headerName: string) : string {};
    
    /** The HTTP method this REST message performs, such as GET or PUT. You must set an HTTP method when using the RESTMessageV2() constructor with no parameters */
    setHttpMethod(method: string) {};
    
    /** Set basic authentication headers for the REST message */
    setBasicAuth(userName: string, userPass: string) {};
    
    /** Set an HTTP header to the specified value */
    setRequestHeader(name: string, value: string) {};
    
    /** Set the credentials for the REST message using an existing basic auth or OAuth 2.0 profile. Valid types are 'basic' and 'oauth2'. Valid profileIds are the sys_id of a Basic Auth Configuration [sys_auth_profile_basic] record or an OAuth Entity Profile [oauth_entity_profile] record */
    setAuthenticationProfile(type: string, profileId: string) {};
    
    /** Append a name-value parameter to the request URL */
    setQueryParameter(name: string, value: string) {};
    
    /** Uses the specified attachment as the request body of this REST Message. Mutually exclusive with setRequestBody */
    setRequestBodyFromAttachment(attachmentSysId: string) {};
    
    /** Get the URL of the endpoint for the REST message */
    getEndpoint() : string {};
    
    /** Set a REST message function variable to the specified value without escaping XML reserved characters */
    setStringParameterNoEscape(name: string, value: string) {};
    
    /** Send the REST message to the endpoint */
    execute() : sn_ws.RESTResponseV2 {};
    
    /** Set the amount of time the REST message waits for a response from the REST provider */
    setHttpTimeout(timeoutMs: number) {};
    
    /** Set the endpoint for the REST message */
    setEndpoint(endpoint: string) {};
    
    /** Set the body content of a PUT or POST request. Mutually exclusive with setRequestBodyFromAttachment */
    setRequestBody(body: string) {};
    
    /** Get name and value for all HTTP headers specified by the REST client */
    getRequestHeaders() : Object {};
    
    /** Setup the response body to be saved into the specified attachment when the request is sent. encryptCtxSysId is optional */
    saveResponseBodyAsAttachment(tableName: string, recordSysId: string, filename: string, encryptCtxSysId: string) {};
    
    /** Set a REST message function variable to the specified value */
    setStringParameter(name: string, value: string) {};
    
    /** Set the mutual authentication protocol profile for the REST message */
    setMutualAuth(profileName: string) {};
    
    /** Set the ECC topic for the REST message. The default ECC topic is RESTProbe if topic is not set. In most cases it is unnecessary to set ECC topic */
    setEccTopic(topic: string) {};
    
    /** Associate outbound requests and the resulting response record in the ECC queue */
    setEccCorrelator(correlator: string) {};
    
    /** Override a value from the database by writing to the REST message payload */
    setEccParameter(name: string, value: string) {};
    
    /** Send the REST message to the endpoint asynchronously. The instance does not wait for a response from the web service provider when making asynchronous calls */
    executeAsync() : sn_ws.RESTResponseV2 {};
    
    /** Get the ECC topic for the REST message */
    getEccTopic() : string {};
    
    }
    
    }
    
    /** ServiceNow processors are equivalent to Java servlets. Processors provide a customizable URL endpoint that can execute arbitrary server-side Javascript code and produce output such as TEXT, JSON, or HTML. The GlideServletResponse API is used in processor scripts to access the HttpServletResponse object. The GlideServletResponse object provides a subset of the HttpServletResponse APIs. The methods are called using the global variable g_response. A useful global variable, g_target, is available in processor scripts. It contains the table name extracted from the URL. The URL to a processor has the format: https://<instance name.servicenow.com>/<path endpoint>.do?<parameter endpoint>=<value> where the path endpoint and parameter endpoint are defined on the processor form */
    class GlideServletResponse{
    
    constructor(){};
    
    /** Sets the MIME type of the response */
    setContentType(type: string) {};
    
    /** Sends a temporary redirect to the client */
    sendRedirect(location: string) {};
    
    /** Sets the status code for the response */
    setStatus(status: number) {};
    
    /** Sets a response header to the specified value */
    setHeader(key: string, value: string) {};
    
    }
    
    /** The scoped GlideElementDescriptor class provides information about individual fields */
    class GlideElementDescriptor{
    
    constructor(){};
    
    /** Returns the field's name */
    getName() : string {};
    
    /** Returns the field's data type */
    getInternalType() : string {};
    
    /** Returns the field's label */
    getLabel() : string {};
    
    /** Returns the field's length */
    getLength() : number {};
    
    }
    
    /** The scoped QueryCondition API provides additional AND or OR conditions that can be added to the current condition, allowing you to build complex queries such as: category='hardware' OR category='software' AND priority='2' AND priority='1' */
    class GlideQueryCondition{
    
    constructor(){};
    
    /** Adds an OR condition to the current condition. oper is an optional parameter */
    addOrCondition(name: string, oper: string, value: ?) : GlideQueryCondition {};
    
    /** Adds an AND condition to the current condition. oper is an optional parameter */
    addCondition(name: string, oper: string, value: ?) : GlideQueryCondition {};
    
    }
    
    /** A wrapper around an InputStream. No functions are provided to manipulate the stream from script. Rather this object can be passed to any API which takes an InputStream as an input parameter */
    class GlideScriptableInputStream{
    
    constructor(){};
    
    }
    
    /** These objects are relevant to Scripted GraphQL APIs and are accessed via the env input parameters to Scripted APIs */
    namespace sn_scripted_gql {
    class TypeResolutionEnvironment{
    
    constructor(){};
    
    /** The object returned from data fetcher */
    getObject() {};
    
    /** Represents the arguments that have been provided on a field */
    getArguments() {};
    
    /** Name of Interface or Union GraphQL Type */
    getTypeName() : string {};
    
    }
    
    class ResolverEnvironment{
    
    constructor(){};
    
    /** Information on the field. It is the result of the parent field fetch */
    getSource() {};
    
    /** Represents the arguments that have been provided on a field */
    getArguments() {};
    
    }
    
    }
    
    /** GlideRecordSecure is a class inherited from GlideRecord that performs the same functions as GlideRecord, and also enforces ACLs */
    class GlideRecordSecure extends GlideRecord{
    }
    
    /** Scoped GlideRecord is used for database operations instead of writing SQL queries. Provides data access APIs to retrieve, update, and delete records from a table */
    class current_proto{
    /**  */
    attested_date : GlideElement;
    
    /** Flag used to prevent loops when synchronizing data between a CI and its asset */
    skip_sync : GlideElement;
    
    /**  */
    operational_status : GlideElement;
    
    /**  */
    sys_updated_on : GlideElement;
    
    /**  */
    attestation_score : GlideElement;
    
    /**  */
    discovery_source : GlideElement;
    
    /**  */
    first_discovered : GlideElement;
    
    /**  */
    sys_updated_by : GlideElement;
    
    /** Modifies the due date with an offset */
    due_in : GlideElement;
    
    /**  */
    sys_created_on : GlideElement;
    
    /** Domain to which the configuration item belongs */
    sys_domain : GlideElement;
    
    /**  */
    install_date : GlideElement;
    
    /**  */
    gl_account : GlideElement;
    
    /**  */
    invoice_number : GlideElement;
    
    /**  */
    sys_created_by : GlideElement;
    
    /**  */
    warranty_expiration : GlideElement;
    
    /**  */
    asset_tag : GlideElement;
    
    /**  */
    fqdn : GlideElement;
    
    /**  */
    change_control : GlideElement;
    
    /** Business manager */
    owned_by : GlideElement;
    
    /** When the asset was checked out */
    checked_out : GlideElement;
    
    /**  */
    sys_domain_path : GlideElement;
    
    /**  */
    business_unit : GlideElement;
    
    /**  */
    delivery_date : GlideElement;
    
    /**  */
    maintenance_schedule : GlideElement;
    
    /**  */
    install_status : GlideElement;
    
    /**  */
    cost_center : GlideElement;
    
    /**  */
    attested_by : GlideElement;
    
    /**  */
    supported_by : GlideElement;
    
    /**  */
    dns_domain : GlideElement;
    
    /** Unique name, often is the DNS hostname or computer name */
    name : GlideElement;
    
    /**  */
    assigned : GlideElement;
    
    /**  */
    life_cycle_stage : GlideElement;
    
    /**  */
    purchase_date : GlideElement;
    
    /**  */
    subcategory : GlideElement;
    
    /**  */
    short_description : GlideElement;
    
    /**  */
    u_users : GlideElement;
    
    /**  */
    assignment_group : GlideElement;
    
    /** IT manager */
    managed_by : GlideElement;
    
    /**  */
    managed_by_group : GlideElement;
    
    /** Provides network printing service */
    can_print : GlideElement;
    
    /**  */
    last_discovered : GlideElement;
    
    /**  */
    sys_class_name : GlideElement;
    
    /**  */
    manufacturer : GlideElement;
    
    /**  */
    sys_id : GlideElement;
    
    /**  */
    po_number : GlideElement;
    
    /** When the asset was checked in */
    checked_in : GlideElement;
    
    /**  */
    sys_class_path : GlideElement;
    
    /**  */
    life_cycle_stage_status : GlideElement;
    
    /** Context MAC Address */
    mac_address : GlideElement;
    
    /**  */
    vendor : GlideElement;
    
    /** Customer name */
    company : GlideElement;
    
    /**  */
    justification : GlideElement;
    
    /**  */
    model_number : GlideElement;
    
    /**  */
    department : GlideElement;
    
    /** Person using or primarily responsible for this item */
    assigned_to : GlideElement;
    
    /**  */
    start_date : GlideElement;
    
    /**  */
    comments : GlideElement;
    
    /**  */
    cost : GlideElement;
    
    /**  */
    attestation_status : GlideElement;
    
    /** Operational Technology asset details */
    cmdb_ot_entity : GlideElement;
    
    /**  */
    sys_mod_count : GlideElement;
    
    /** Enable monitoring of the configuration item */
    monitor : GlideElement;
    
    /**  */
    serial_number : GlideElement;
    
    /** Context IP Address */
    ip_address : GlideElement;
    
    /**  */
    model_id : GlideElement;
    
    /** Which CI is this a duplicate of */
    duplicate_of : GlideElement;
    
    /**  */
    sys_tags : GlideElement;
    
    /**  */
    cost_cc : GlideElement;
    
    /**  */
    order_date : GlideElement;
    
    /**  */
    schedule : GlideElement;
    
    /**  */
    support_group : GlideElement;
    
    /**  */
    environment : GlideElement;
    
    /** When the asset is due for check in */
    due : GlideElement;
    
    /**  */
    attested : GlideElement;
    
    /**  */
    correlation_id : GlideElement;
    
    /**  */
    unverified : GlideElement;
    
    /** Attributes that describe the configuration item, usually XML */
    attributes : GlideElement;
    
    /**  */
    location : GlideElement;
    
    /** Associated asset, automatically created along with the CI when model requires it */
    asset : GlideElement;
    
    /**  */
    category : GlideElement;
    
    /**  */
    fault_count : GlideElement;
    
    /**  */
    lease_id : GlideElement;
    
    }
    
    var current = new current_proto();
    /** XMLDocument2 is a JavaScript Object wrapper for parsing and extracting XML data from an XML string. Use this JavaScript class to instantiate an object from an XML string, usually a return value from a Web Service invocation, or the XML payload of ECC Queue */
    class XMLDocument2{
    
    constructor(){};
    
    /** Gets the first node in the specified xpath */
    getFirstNode(xpath: string) : XMLNode {};
    
    /** Creates an element node with a text child node and adds it to the current node */
    createElementWithTextValue(name: string, value: string) : XMLNode {};
    
    /** Gets the node after the specified node */
    getNextNode(prev: XMLNode) : XMLNode {};
    
    /** Checks if the XMLDocument is valid */
    isValid() : bool {};
    
    /** Makes the node passed in as a parameter the current node */
    setCurrentElement(element: XMLNode) {};
    
    /** Gets the document element node of the XMLDocument2. The document element node is the root node */
    getDocumentElement() : XMLNode {};
    
    /** Parses the XML string and loads it into the XMLDocument2 object */
    parseXML(xmlDoc: string) : bool {};
    
    /** Creates and adds an element node to the current node. The element name is the string passed in as a parameter. The new element node has no text child nodes */
    createElement(name: string) : XMLNode {};
    
    /** Returns a string containing the XML */
    toString() : string {};
    
    /** Gets the node specified in the xpath */
    getNode(xpath: string) : XMLNode {};
    
    /** Gets all the text child nodes from the node referenced in the xpath */
    getNodeText(xpath: string) : string {};
    
    }
    
    /** The scoped GlideDuration class provides methods for working with spans of time or durations. GlideDuration objects store the duration as a date and time from January 1, 1970, 00:00:00. As a result, setValue() and getValue() use the GlideDateTime object for parameters and return values */
    class GlideDuration{
    
    constructor(){};
    
    /** Adds a given duration to the current duration */
    add(value: GlideDuration) : GlideDuration {};
    
    /** Gets the current duration in the given format */
    getByFormat(format: string) : string {};
    
    /** Gets internal value of the this duration object. GlidDuration is stored as DateTime */
    getValue() : string {};
    
    /**  */
    subtract(value: GlideDuration) : GlideDuration {};
    
    /** Gets the display value of the duration in number of days, hours, and minutes */
    getDisplayValue() : string {};
    
    /** Sets the internal value of the GlideDuration object. Internally, GlidDuration is stored as DateTime */
    setValue(o: ?) {};
    
    /** Gets the number of days */
    getDayPart() : number {};
    
    /** Sets the display value */
    setDisplayValue(asDisplayed: string) {};
    
    /** Gets the rounded number of days. If the time part is more than 12 hours, the return value is rounded up. Otherwise, it is rounded down */
    getRoundedDayPart() : number {};
    
    /** Gets the duration value in d HH:mm:ss format */
    getDurationValue() : string {};
    
    }
    
    /** The scoped GlideAggregate class is an extension of GlideRecord and allows database aggregation (COUNT, SUM, MIN, MAX, AVG) queries to be done. This can be helpful in creating customized reports or in calculations for calculated fields. The GlideAggregate class works only on number fields. Since currency fields are strings, you can't use the GlideAggregate class on currency fields */
    class GlideAggregate{
    
    constructor(tableName: string){};
    
    /** Moves to the next record in the GlideAggregate */
    next() : bool {};
    
    /** Retrieves the number of rows in the GlideRecord */
    getRowCount() : number {};
    
    /** Gets the query necessary to return the current aggregate */
    getAggregateEncodedQuery() : string {};
    
    /** Adds an aggregate */
    addAggregate(aggregate: string, field: string) {};
    
    /** Issues the query and gets the results */
    query() {};
    
    /** Retrieves the table name associated with this GlideRecord */
    getTableName() : string {};
    
    /** Gets the optional category value of the query */
    getCategory() : string {};
    
    /** Orders the aggregates using the value of the specified field. The field will also be added to the group-by list */
    orderBy(field: string) {};
    
    /** Sorts the aggregates into descending order based on the specified field */
    orderByDesc(field: string) {};
    
    /** Determines if there are any more results in the GlideAggregate */
    hasNext() : bool {};
    
    /** Provides the name of a field to use in grouping the aggregates. May be called numerous times to set multiple group fields */
    groupBy(field: string) {};
    
    /** Retrieves the encoded query */
    getEncodedQuery() : string {};
    
    /** Adds a NOT NULL query to the aggregate */
    addNotNullQuery(field: string) : GlideQueryCondition {};
    
    /** Sorts the aggregates based on the specified aggregate and field */
    orderByAggregate(aggregate: string, field: string) {};
    
    /** Adds a NULL query to the aggregate */
    addNullQuery(field: string) : GlideQueryCondition {};
    
    /** Gets the value of a field */
    getValue(field: string) : string {};
    
    /** Sets whether the results are to be grouped */
    setGroup(value: bool) {};
    
    /** Adds a query to the aggregate. Adds an encoded query to the other queries that may have been set for this aggregate */
    addEncodedQuery(query: string) {};
    
    /** Sets the value of category for the query */
    setCategory(category: string) {};
    
    /** Adds a query to the aggregate */
    addQuery(field: string, operator: string, value: string) : GlideQueryCondition {};
    
    /** Gets the value of the specified aggregate */
    getAggregate(aggregate: string, field: string) : string {};
    
    }
    
    /** Scoped GlideRecord is used for database operations instead of writing SQL queries. Provides data access APIs to retrieve, update, and delete records from a table */
    class previous_proto{
    /**  */
    attested_date : GlideElement;
    
    /** Flag used to prevent loops when synchronizing data between a CI and its asset */
    skip_sync : GlideElement;
    
    /**  */
    operational_status : GlideElement;
    
    /**  */
    sys_updated_on : GlideElement;
    
    /**  */
    attestation_score : GlideElement;
    
    /**  */
    discovery_source : GlideElement;
    
    /**  */
    first_discovered : GlideElement;
    
    /**  */
    sys_updated_by : GlideElement;
    
    /** Modifies the due date with an offset */
    due_in : GlideElement;
    
    /**  */
    sys_created_on : GlideElement;
    
    /** Domain to which the configuration item belongs */
    sys_domain : GlideElement;
    
    /**  */
    install_date : GlideElement;
    
    /**  */
    gl_account : GlideElement;
    
    /**  */
    invoice_number : GlideElement;
    
    /**  */
    sys_created_by : GlideElement;
    
    /**  */
    warranty_expiration : GlideElement;
    
    /**  */
    asset_tag : GlideElement;
    
    /**  */
    fqdn : GlideElement;
    
    /**  */
    change_control : GlideElement;
    
    /** Business manager */
    owned_by : GlideElement;
    
    /** When the asset was checked out */
    checked_out : GlideElement;
    
    /**  */
    sys_domain_path : GlideElement;
    
    /**  */
    business_unit : GlideElement;
    
    /**  */
    delivery_date : GlideElement;
    
    /**  */
    maintenance_schedule : GlideElement;
    
    /**  */
    install_status : GlideElement;
    
    /**  */
    cost_center : GlideElement;
    
    /**  */
    attested_by : GlideElement;
    
    /**  */
    supported_by : GlideElement;
    
    /**  */
    dns_domain : GlideElement;
    
    /** Unique name, often is the DNS hostname or computer name */
    name : GlideElement;
    
    /**  */
    assigned : GlideElement;
    
    /**  */
    life_cycle_stage : GlideElement;
    
    /**  */
    purchase_date : GlideElement;
    
    /**  */
    subcategory : GlideElement;
    
    /**  */
    short_description : GlideElement;
    
    /**  */
    u_users : GlideElement;
    
    /**  */
    assignment_group : GlideElement;
    
    /** IT manager */
    managed_by : GlideElement;
    
    /**  */
    managed_by_group : GlideElement;
    
    /** Provides network printing service */
    can_print : GlideElement;
    
    /**  */
    last_discovered : GlideElement;
    
    /**  */
    sys_class_name : GlideElement;
    
    /**  */
    manufacturer : GlideElement;
    
    /**  */
    sys_id : GlideElement;
    
    /**  */
    po_number : GlideElement;
    
    /** When the asset was checked in */
    checked_in : GlideElement;
    
    /**  */
    sys_class_path : GlideElement;
    
    /**  */
    life_cycle_stage_status : GlideElement;
    
    /** Context MAC Address */
    mac_address : GlideElement;
    
    /**  */
    vendor : GlideElement;
    
    /** Customer name */
    company : GlideElement;
    
    /**  */
    justification : GlideElement;
    
    /**  */
    model_number : GlideElement;
    
    /**  */
    department : GlideElement;
    
    /** Person using or primarily responsible for this item */
    assigned_to : GlideElement;
    
    /**  */
    start_date : GlideElement;
    
    /**  */
    comments : GlideElement;
    
    /**  */
    cost : GlideElement;
    
    /**  */
    attestation_status : GlideElement;
    
    /** Operational Technology asset details */
    cmdb_ot_entity : GlideElement;
    
    /**  */
    sys_mod_count : GlideElement;
    
    /** Enable monitoring of the configuration item */
    monitor : GlideElement;
    
    /**  */
    serial_number : GlideElement;
    
    /** Context IP Address */
    ip_address : GlideElement;
    
    /**  */
    model_id : GlideElement;
    
    /** Which CI is this a duplicate of */
    duplicate_of : GlideElement;
    
    /**  */
    sys_tags : GlideElement;
    
    /**  */
    cost_cc : GlideElement;
    
    /**  */
    order_date : GlideElement;
    
    /**  */
    schedule : GlideElement;
    
    /**  */
    support_group : GlideElement;
    
    /**  */
    environment : GlideElement;
    
    /** When the asset is due for check in */
    due : GlideElement;
    
    /**  */
    attested : GlideElement;
    
    /**  */
    correlation_id : GlideElement;
    
    /**  */
    unverified : GlideElement;
    
    /** Attributes that describe the configuration item, usually XML */
    attributes : GlideElement;
    
    /**  */
    location : GlideElement;
    
    /** Associated asset, automatically created along with the CI when model requires it */
    asset : GlideElement;
    
    /**  */
    category : GlideElement;
    
    /**  */
    fault_count : GlideElement;
    
    /**  */
    lease_id : GlideElement;
    
    }
    
    var previous = new previous_proto();
    /** Error types which can be set as the response body of a Scripted REST API */
    namespace sn_ws_err {
    class NotAcceptableError{
    
    constructor(message: string){};
    
    }
    
    class ServiceError{
    
    constructor(){};
    
    /** The detailed error message */
    setDetail(detail: string) {};
    
    /** The error message */
    setMessage(message: string) {};
    
    /** The response status code -- defaults to 500 */
    setStatus(code: number) {};
    
    }
    
    class UnsupportedMediaTypeError{
    
    constructor(message: string){};
    
    }
    
    class ConflictError{
    
    constructor(message: string){};
    
    }
    
    class NotFoundError{
    
    constructor(message: string){};
    
    }
    
    class BadRequestError{
    
    constructor(message: string){};
    
    }
    
    }
    
    /** GlideSession manages all of the information for a user session. You can retrieve this from gs.getSession() */
    class GlideSession{
    
    constructor(){};
    
    /** Get the Time Zone name associated with the user */
    getTimeZoneName() : string {};
    
    /** Store a value in an active session */
    putClientData(name: string, value: string) {};
    
    /** Language used by the user */
    getLanguage() : string {};
    
    /** Gets the current URI for the session */
    getUrlOnStack() : string {};
    
    /** Fetch the value in active session based on the name */
    getClientData(name: string) : string {};
    
    /** Checks if the current session is interactive */
    isInteractive() : bool {};
    
    /** Gets the client IP address */
    getClientIP() : string {};
    
    /** Determines if the current user is currently logged in */
    isLoggedIn() : bool {};
    
    /** Gets the ID of current application, defined as a user preference and set by the application picker */
    getCurrentApplicationId() : string {};
    
    }
    
    /** The scoped GlideSystem (referred to by the variable name 'gs' in any server-side JavaScript) API provides a number of convenient methods to get information about the system, the current logged in user, etc. */
    class GlideSystem{
    /** Returns the (UTC) start of the quarter that was the specified number of months ago adjusted for the timezone of the server */
    monthsAgo(month: number) : string {};
    
    /** Returns the (UTC) end of the hour that was the specified number of hours ago adjusted for the timezone of the server */
    hoursAgoEnd(hours: number) : string {};
    
    /** Gets the date and time for the end of this month in UTC, adjusted for the timezone of the server */
    endOfThisMonth() : string {};
    
    /** Checks if the current session is interactive */
    isInteractive() : bool {};

    /** Write message to log */
    log(message:string, source:string) : void {};
    
    /** Returns the (UTC) end of the day that was the specified number of days ago adjusted for the timezone of the server */
    daysAgoEnd(daysAgo: number) : string {};
    
    /** Gets the date and time for the beginning of next month in UTC, adjusted for the timezone of the server */
    beginningOfNextMonth() : string {};
    
    /** number of hours ago */
    hoursAgo(hours: number) : string {};
    
    /** Returns the (UTC) end of the quarter that was the specified number of quarters ago adjusted for the timezone of the server */
    quartersAgoEnd(quarters: number) : string {};
    
    /** Gets the date and time for the beginning of this year in UTC, adjusted for the timezone of the server */
    beginningOfThisYear() : string {};
    
    /** Gets the ID of current application, defined as a user preference and set by the application picker */
    getCurrentApplicationId() : string {};
    
    /** Gets the date and time for the end of last year in UTC, adjusted for the timezone of the server */
    endOfLastYear() : string {};
    
    /** Gets the date and time for the end of next year in UTC, adjusted for the timezone of the server */
    endOfNextYear() : string {};
    
    /** Queries an object and returns true if the object is null, undefined, or contains an empty string */
    nil(o: Object) : bool {};
    
    /** Gets the date and time for the beginning of this quarter in UTC, adjusted for the timezone of the server */
    beginningOfThisQuarter() : string {};
    
    /** Determines if debugging is active for a specific scope */
    isDebugging() : bool {};
    
    /** Set the redirect URI for this transaction. This determines the next page the user will see */
    setRedirect(url: string) {};
    
    /** Returns a String of the form :interval,value,operator */
    datePart(interval: string, value: string, operator: string) : string {};
    
    /** Generates a GUID that can be used when a unique identifier is required */
    generateGUID(obj: Object) : string {};
    
    /**  */
    getNewAppScopeCompanyPrefix() : string {};
    
    /** Gets the username, or User ID, of the current user (e.g., abel.tuter) */
    getUserName() : string {};
    
    /** Determines if the UI is running as mobile */
    isMobile() : bool {};
    
    /** Uses the info level to log a message to the system log */
    info(message: string, parm1: Object, parm2: Object, parm3: Object, parm4: Object, parm5: Object) {};
    
    /**  */
    base64Encode(s: string) : string {};
    
    /** Gets the current URI for the session */
    getUrlOnStack() : string {};
    
    /** Returns the (UTC) start of the quarter that was the specified number of months ago adjusted for the timezone of the server */
    monthsAgoStart(month: number) : string {};
    
    /** Gets a string representing the cache version for a CSS file */
    getCssCacheVersionString() : string {};
    
    /** Gets the caller scope name, or returns null if there is no caller */
    getCallerScopeName() : string {};
    
    /**  */
    base64Decode(s: string) : string {};
    
    /** number of minutes ago */
    minutesAgo(minutes: number) : string {};
    
    /** Returns the (UTC) start of the hour that was the specified number of hours ago adjusted for the timezone of the server */
    hoursAgoStart(hours: number) : string {};
    
    /** Uses the warn level to log a message to the system log */
    warn(message: string, parm1: Object, parm2: Object, parm3: Object, parm4: Object, parm5: Object) {};
    
    /** Returns the (UTC) end of next week adjusted for the timezone of the server */
    endOfNextWeek() : string {};
    
    /** Gets the date and time for the beginning of last week in UTC, adjusted for the timezone of the server */
    beginningOfLastWeek() : string {};
    
    /** Determines if the current user has the specified role */
    hasRole(role: string) : bool {};
    
    /** Determines if the current user is currently logged in */
    isLoggedIn() : bool {};
    
    /** Gets the date and time for the end of this week in UTC, adjusted for the timezone of the server */
    endOfThisWeek() : string {};
    
    /** Gets the display name of the current user (e.g., Abel Tuter, as opposed to abel.tuter) */
    getUserDisplayName() : string {};
    
    /** Gets the date and time for the beginning of this week in UTC, adjusted for the timezone of the server */
    beginningOfThisWeek() : string {};
    
    /** Returns a reference to the GlideUser object for the current user */
    getUser() : GlideUser {};
    
    /**  */
    urlDecode(url: string) : string {};
    
    /** Gets the date and time for the beginning of last year in UTC, adjusted for the timezone of the server */
    beginningOfLastYear() : string {};
    
    /** Determines if a database table exists */
    tableExists(name: string) : bool {};
    
    /** Uses the error level to log a message to the system log */
    error(message: string, parm1: Object, parm2: Object, parm3: Object, parm4: Object, parm5: Object) {};
    
    /**  */
    urlEncode(url: string) : string {};
    
    /** Gets the date and time for the end of this year in UTC, adjusted for the timezone of the server */
    endOfThisYear() : string {};
    
    /** Gets the name of the current scope */
    getCurrentScopeName() : string {};
    
    /** Returns (UTC) 24 hours ago adjusted for the timezone of the current session */
    yesterday() : string {};
    
    /** Returns the (UTC) start of the day that was the specified number of days ago adjusted for the timezone of the server */
    daysAgoStart(daysAgo: number) : string {};
    
    /** Gets the date and time for the beginning of last month in UTC, adjusted for the timezone of the server */
    beginningOfLastMonth() : string {};
    
    /** Gets the date and time for the beginning of this month in UTC, adjusted for the timezone of the server */
    beginningOfThisMonth() : string {};
    
    /** Gets the date and time for the beginning of next year in UTC, adjusted for the timezone of the server */
    beginningOfNextYear() : string {};
    
    /** Returns the date of the duration time after January 1 */
    getDurationDate(duration: string) : string {};
    
    /** Adds an error message for the current session */
    addErrorMessage(message: string) {};
    
    /** Returns the (UTC) beginning of the specified week adjusted for the timezone of the current session */
    beginningOfWeek(o: Object) : string {};
    
    /** Returns the (UTC) end of the minute that was the specified number of minutes ago adjusted for the timezone of the serve */
    minutesAgoEnd(minutes: number) : string {};
    
    /** Gets the GlideSession Session ID */
    getSessionID() : string {};
    
    /** Gets the date and time for the end of next month in UTC, adjusted for the timezone of the server */
    endOfNextMonth() : string {};
    
    /** Gets the sys_id of the current user */
    getUserID() : string {};
    
    /** Provides a safe way to call from the sandbox, allowing only trusted scripts to be included */
    include(name: string) : bool {};
    
    /** Returns the (UTC) start of the day that was the specified number of days ago adjusted for the timezone of the server */
    daysAgo(days: number) : string {};
    
    /** Returns the (UTC) start of the minute that was the specified number of minutes ago adjusted for the timezone of the serve */
    minutesAgoStart(minutes: number) : string {};
    
    /** Retrieves a message from UI messages */
    getProperty(key: string, alt: Object) : string {};
    
    /** Returns the (UTC) end of the specified week adjusted for the timezone of the current session */
    endOfWeek(o: Object) : string {};
    
    /** Gets the date and time for the end of last month in UTC, adjusted for the timezone of the server */
    endOfLastMonth() : string {};
    
    /** Uses the debug level to log a message to the system log */
    debug(message: string, parm1: Object, parm2: Object, parm3: Object, parm4: Object, parm5: Object) {};
    
    /** Retrieves a message from UI messages. args is an optional paramter */
    getMessage(id: string, args: ?) : string {};
    
    /** Gets the date and time for the end of this quarter in UTC, adjusted for the timezone of the server */
    endOfThisQuarter() : string {};
    
    /** Queues an event for the event manager */
    eventQueue(name: string, record: GlideRecord, parm1: string, parm2: string, queue: string) {};
    
    /**  */
    xmlToJSON(xmlString: string) : Object {};
    
    /** Adds an info message for the current session */
    addInfoMessage(message: string) {};
    
    /** Gets the date and time for the beginning of next week in UTC, adjusted for the timezone of the server */
    beginningOfNextWeek() : string {};
    
    /**  */
    getMaxSchemaNameLength() : number {};
    
    /** Returns the (UTC) end of last week adjusted for the timezone of the server */
    endOfLastWeek() : string {};
    
    /** Returns the (UTC) start of the quarter that was the specified number of quarters ago adjusted for the timezone of the server */
    quartersAgoStart(quarters: number) : string {};
    
    /** Gets a reference to the current Glide session */
    getSession() : GlideSession {};
    
    }
    
    var gs = new GlideSystem();
    /** The scoped GlideFilter class allows you to determine if a record meets a specified set of requirements. There is no constructor for scoped GlideFilter, it is accessed by using the global object 'GlideFilter' */
    class GlideFilter{
    
    constructor(){};
    
    }
    
    /** The scoped GlideDate class provides methods for performing operations on GlideDate objects, such as instantiating GlideDate objects or working with GlideDate fields */
    class GlideDate{
    
    constructor(){};
    
    /** Gets the date in the given date format */
    getByFormat(format: string) : string {};
    
    /** Returns the month part of a date with no timezone conversion */
    getMonthNoTZ() : number {};
    
    /** Gets the date value stored in the database by the GlideDate object in the internal format, yyyy-MM-dd, and the system time zone, UTC by default */
    getValue() : string {};
    
    /** Returns the year part of a date with no timezone conversion */
    getYearNoTZ() : number {};
    
    /** Gets the duration difference between two GlideDate values */
    subtract(start: GlideDate, end: GlideDate) : GlideDuration {};
    
    /** Gets the date in the current user's display format and time zone */
    getDisplayValue() : string {};
    
    /** Sets the date of the GlideDate object */
    setValue(o: ?) {};
    
    /** Gets the display value in the internal format (yyyy-MM-dd). Note: This method is useful for date or time fields, but not date fields */
    getDisplayValueInternal() : string {};
    
    /** Returns the day part of a date with no timezone conversion */
    getDayOfMonthNoTZ() : number {};
    
    /** Sets a date value using the current user's display format and time zone */
    setDisplayValue(asDisplayed: string) {};
    
    }
    
    /** Custom Parse By Script Result API */
    namespace sn_impex {
    class ImportSetTable{
    
    constructor(){};
    
    /** Defines a string column with the max size */
    addColumn(label: string, maxLength: number) {};
    
    /** Inserts a data row given as a Map<String, String> to import set table */
    insert(rowData: map<string, string>) {};
    
    /** Returns 20 when the user clicks on test load 20 records, in every other case, returns -1 */
    getMaximumRows() : integer {};
    
    /** Defines a JSON column with the max size */
    addJSONColumn(label: string, maxLength: number) {};
    
    /** Defines an XML column with the max size */
    addXMLColumn(label: string, maxLength: number) {};
    
    }
    
    class CSVParser{
    
    constructor(){};
    
    /** This method returns Map where key=column header and value=parsed value in that column */
    parseLineToObject(csv: string, headers: Array<string>, delimiter: string, quoteCharacter: string) : Object {};
    
    /** This method returns list of parsed values */
    parseLineToArray(csv: string, delimiter: string, quoteCharacter: string) : Array<string> {};
    
    }
    
    class ScriptParseResult{
    
    constructor(){};
    
    /** Get the skip flag, if the flag is true, the result is ignored in staging table */
    getSkip() : boolean {};
    
    /** Set the skip flag, if the flag is true, the result is ignored in staging table */
    setSkip(skip: boolean) {};
    
    /** Get all rows of column names and values map */
    getRows() : List<Map<String,String>> {};
    
    /** Add a row of column names and values map into result list */
    addRow(map: Map<String, String>) {};
    
    }
    
    }
    
    /** ServiceNow processors are equivalent to Java servlets. Processors provide a customizable URL endpoint that can execute arbitrary server-side Javascript code and produce output such as TEXT, JSON, or HTML. The GlideScriptedProcessor APIs are used in processor scripts to access the the processor (servlet) capabilities. There are no constructors for the GlideScriptedProcessor APIs. The methods are called using the global variable g_processor. A useful global variable, g_target, is available in processor scripts. It contains the table name extracted from the URL. The URL to a processor has the format: https://<instance name.servicenow.com>/<path endpoint>.do?<parameter endpoint>=<value> where the path endpoint and parameter endpoint are defined on the processor form */
    class GlideScriptedProcessor{
    
    constructor(){};
    
    /** Redirects to the specified URL */
    redirect(url: string) {};
    
    /** Writes the contents of the given string to the response */
    writeOutput(contentType: string, value: string) {};
    
    /** Writes a JSON object to the current URL. Note: Works only in scoped apps */
    writeJSON(jsonObject: ?) {};
    
    }
    
    /** These objects are relevant to Scripted REST APIs and are accessed via the request or response input parameters to Scripted APIs */
    namespace sn_ws_int {
    class WSSoapRequestDocument extends Object{
    }
    
    class RESTAPIResponseStream{
    
    constructor(){};
    
    /** Write an InputStream directly to the response stream. Can be called multiple times. Caller responsible for response format and setting proper Content-Type and status code prior to calling */
    writeStream(inputStream: Object) {};
    
    /** Write a string directly to the response stream. Can be called multiple times. Caller responsible for response format and setting proper Content-Type and status code prior to calling */
    writeString(stringToWrite: string) {};
    
    }
    
    class RESTAPIResponse{
    
    constructor(){};
    
    /** Set response headers from the specified object */
    setHeaders(headers: ?) {};
    
    /** Return stream writer. Caller responsible to set proper content type and status using setStatus and setHeader methods. Caller responsible to populate all headers on response before actually writing to stream */
    getStreamWriter() : sn_ws_int.RESTAPIResponseStream {};
    
    /** Set the Location header */
    setLocation(locationValue: string) {};
    
    /** Set Response Error */
    setError(error: ?) {};
    
    /** Set the Content-Type header */
    setContentType(contentType: string) {};
    
    /** Use the specified object as the response body */
    setBody(body: ?) {};
    
    /** Set response HTTP status code */
    setStatus(code: number) {};
    
    /** Set a response header */
    setHeader(name: string, value: string) {};
    
    }
    
    class WSRequest{
    
    constructor(){};
    
    }
    
    class WSResponse{
    
    constructor(){};
    
    /** Use this variable to assign a response value as a DOM Element */
    soapResponseElement
    
    }
    
    class WSSoapRequestXML extends string{
    }
    
    class RESTAPIRequest{
    
    constructor(){};
    
    /** All headers from the request */
    headers
    
    /** The variable path parameters passed in the request URI as an object */
    pathParams
    
    /** The query parameters from the request as an object */
    queryParams
    
    /** Get the query category (i.e. read replica category) from query parameter 'sysparm_query_category' */
    getRequestedQueryCategory() : string {};
    
    /** Obtain a set of media types that are common between what the client request accepts and what this service is able to produce */
    getSupportedResponseContentTypes() : Object {};
    
    /** The body of the request */
    body : sn_ws_int.RESTAPIRequestBody;
    
    /** The entire query string from the request URI */
    queryString : string;
    
    /** The request URI, excluding domain information */
    uri : string;
    
    /** The entire request URL, including domain */
    url : string;
    
    /** Get the value of a specific header from the request */
    getHeader(headerName: string) : string {};
    
    }
    
    class RESTAPIRequestBody{
    
    constructor(){};
    
    /** Returns the next entry from the request body as an object if request is array. If not an array then returns entire request body as an object */
    nextEntry() : Object {};
    
    /** The request body de-serialized as an object */
    data
    
    /** The request body as a string -- be careful to consider impact to memory */
    dataString : string;
    
    /** The body of the request as a stream. Note, this object provides no functions to manipulate the stream from script. Rather this object can be passed to another API which takes an InputStream as an input parameter */
    dataStream : GlideScriptableInputStream;
    
    /** Return true if request has more entries. Use this in conjunction with nextEntry */
    hasNext() : bool {};
    
    }
    
    }
    
    /** The scoped GlideTime class provides methods for performing operations on GlideTime objects, such as instantiating GlideTime objects or working with GlideTime fields */
    class GlideTime{
    
    constructor(){};
    
    /** Gets the time in the given time format */
    getByFormat(format: string) : string {};
    
    /** Gets the duration difference between two GlideTime values */
    subtract(start: GlideTime, end: GlideTime) : GlideDuration {};
    
    /** Returns hour part of local time 0-11 */
    getHourLocalTime() : number {};
    
    /** Sets a time value using the current user's display format and time zone */
    setDisplayValue(asDisplayed: string) {};
    
    /** Returns hour part of UTC time 0-11 */
    getHourUTC() : number {};
    
    /** Gets the time value stored in the database by the GlideTime object in the internal format, HH:mm:ss, and the system time zone, UTC by default */
    getValue() : string {};
    
    /** Returns minutes part of UTC time */
    getMinutesUTC() : number {};
    
    /** Returns seconds part of time */
    getSeconds() : number {};
    
    /** Gets the time in the current user's display format and time zone */
    getDisplayValue() : string {};
    
    /** Sets the time of the GlideTime object in the internal time zone, which is UTC by default or the value of the glide.sys.internal.tz property, if set */
    setValue(value: ?) {};
    
    /** Gets the display value in the current user's time zone and the internal format (HH:mm:ss). Useful for date/time fields, but not for date fields */
    getDisplayValueInternal() : string {};
    
    /** Returns hour-of-the-day part of local time 0-23 */
    getHourOfDayLocalTime() : number {};
    
    /** Returns the hour-of-the-day part of UTC time 0-23 */
    getHourOfDayUTC() : number {};
    
    /** Returns minutes part of local time */
    getMinutesLocalTime() : number {};
    
    }
    
    /** The Scoped GlideUser API provides access to information about the current user and current user roles. Using the Scoped GlideUser API avoids the need to use the slower GlideRecord queries to get user information */
    class GlideUser{
    
    constructor(){};
    
    /** Gets the user id, or login name, of the current user */
    getName() : string {};
    
    /** Gets the display name of the current user */
    getDisplayName() : string {};
    
    /** Gets the Company ID of the current user */
    getCompanyID() : string {};
    
    /** Determines if the current user has the specified role */
    hasRole(role: string) : bool {};
    
    /** Gets the sys_id of current user */
    getID() : string {};
    
    /** Determines if the current user is a member of the specified group */
    isMemberOf(group: string) : bool {};
    
    /** Saves a user preference value to the database */
    savePreference(name: string, value: string) {};
    
    /** Gets the specified user preference value for the current user */
    getPreference(name: string) : string {};
    
    }
    
    /** The scoped GlideSchedule API provides methods for performing operations on GlideSchedule objects, such as adding new schedule segments to a schedule, determining if a datetime is within the schedule, or setting the schedule timezone */
    class GlideSchedule{
    
    constructor(){};
    
    /** Adds a new schedule segment to the current schedule */
    add(startDate: GlideDateTime, offset: GlideDuration) : GlideDateTime {};
    
    /** Determines the elapsed time in the schedule between two date time values using the timezone of the schedule or, if that is not specified, the timezone of the session */
    duration(startDate: GlideDateTime, endDate: GlideDateTime) : GlideDuration {};
    
    /** Gets the current schedule name */
    getName() : string {};
    
    /** Loads a schedule with the schedule information. If a timezone is not specified or is nil, the current session timezone is used for the schedule */
    load(sysID: string, timeZone: string, excludeSpanID: string) {};
    
    /** Determines if the current schedule is valid. A schedule is valid if it has at least one schedule span */
    isValid() : bool {};
    
    /** Sets the timezone for the current schedule */
    setTimeZone(tz: string) {};
    
    }
    
    /** The Scoped GlideElement API provides methods for dealing with fields and their values. Scoped GlideElement methods are available for the fields of the current GlideRecord */
    class GlideElement{
    
    constructor(){};
    
    /** Gets the currency ISO code for a record */
    getCurrencyCode() : string {};
    
    /** Gets the object's label */
    getLabel() : string {};
    
    /** Gets the name of the field */
    getName() : string {};
    
    /** Gets the value of the attribute on the field in question from the dictionary as a string. To get the value as a string, use getAttribute(string) */
    getBooleanAttribute(attribute: string) : bool {};
    
    /** Determines if the GlideRecord table can be read from */
    canRead() : bool {};
    
    /** Determines if the current field has been modified */
    changes() : bool {};
    
    /** Gets the display value */
    getReferenceDisplayValue() : string {};
    
    /** Gets currency in a string */
    getCurrencyString() : string {};
    
    /** Gets table name for a reference field */
    getReferenceTable() : string {};
    
    /** Gets the reference value */
    getReferenceValue() : string {};
    
    /** Determines whether the field is null */
    nil() : bool {};
    
    /** Gets the currency value in the sessions currency format */
    getSessionDisplayValue() : string {};
    
    /** Gets the decrypted value */
    getDecryptedValue() : string {};
    
    /** Gets the value of the attribute on the field in question from the dictionary as a string. If the attribute is a boolean attribute, use getBooleanAttribute(String) to get the value as a boolean rather than as a string */
    getAttribute(attribute: string) : string {};
    
    /** Gets the currency display value */
    getCurrencyDisplayValue() : string {};
    
    /** Gets the sessions currency ISO code */
    getSessionCurrencyCode() : string {};
    
    /** Gets a currency value */
    getCurrencyValue() : string {};
    
    /** The currency ISO code, in the base system currency */
    getReferenceCurrencyCode() : string {};
    
    /** Determines if the new value of a field after a change matches a certain object */
    changesTo(value: ?) : bool {};
    
    /** Retrieves the choice list for a field */
    getChoices(dependent: string) : [] {};
    
    /** Gets the table name */
    getTableName() : string {};
    
    /** Determines whether a field has a particular attribute */
    hasAttribute(attribute: string) : bool {};
    
    /** Sets a date to a numeric value */
    setDateNumericValue(value: ?) {};
    
    /** Sets the display value of the field */
    setDisplayValue(value: ?) {};
    
    /** Gets a GlideRecord object for a reference element */
    getRefRecord() : GlideRecord {};
    
    /** Determines if the GlideRecord table can be written to */
    canWrite() : bool {};
    
    /** Determines the previous value of the current field matched a certain object */
    changesFrom(value: ?) : bool {};
    
    /** Determines if the user's role permits creation of new records in this field */
    canCreate() : bool {};
    
    /** Gets the field's element descriptor */
    getED() : GlideElementDescriptor {};
    
    /** Gets the ammount in the sessions currency */
    getSessionValue() : string {};
    
    /** Gets date in numberic value */
    dateNumericValue(value: string) : number {};
    
    /** Adds an error message. Can be retrieved using getError() */
    setError(message: string) {};
    
    /** Sets the display value of the field */
    setValue(value: ?) {};
    
    /** Gets the formatted display value of the field */
    getDisplayValue(maxCharacters: number) : string {};
    
    /** Converts the value to a string */
    toString() : string {};
    
    }
    
    /** The scoped GlideDateTime default constructor, instantiates a new GlideDateTime object with the current date and time in Greenwich Mean Time (GMT). Optional 'value' parameter with a date and time value in the UTC time zone specified with the format yyyy-MM-dd HH:mm:ss */
    class GlideDateTime{
    
    constructor(value: string){};
    
    /** Gets the day of the week stored by the GlideDateTime object, expressed in the user's time zone */
    getDayOfWeekLocalTime() : number {};
    
    /** Returns true if the object's data time is before the input argument */
    before(object: GlideDateTime) : bool {};
    
    /** Adds a specified number of weeks to the current GlideDateTime object, expressed in the UTC time zone */
    addWeeksUTC(amount: number) {};
    
    /** Sets the day of the month to a specified value in the user's time zone */
    getDaysInMonthLocalTime() : number {};
    
    /** Sets the month stored by the GlideDateTime object to a specified value using the UTC time zone */
    setMonthUTC(month: number) {};
    
    /** Compares two GlideDateTime objects */
    compareTo(object: GlideDateTime) : number {};
    
    /** Sets the date and time of the current object using an existing GlideDateTime object. This method is equivalent to instantiating a new object with a GlideDateTime parameter */
    setGlideDateTime(gdt: GlideDateTime) {};
    
    /** Sets the month stored by the GlideDateTime object to a specified value using the current user's time zone */
    setMonthLocalTime(month: number) {};
    
    /** Gets the month stored by the GlideDateTime object, expressed in the current user's time zone */
    getMonthLocalTime() : number {};
    
    /** Gets the date for the user's time zone */
    getLocalDate() : GlideDate {};
    
    /** Sets the year stored by the GlideDateTime object to a specified value using the UTC time zone */
    setYearUTC(year: number) {};
    
    /** Gets the day of the week stored by the GlideDateTime object, expressed in the UTC time zone */
    getDayOfWeekUTC() : number {};
    
    /** Gets the number of the current week of the current year */
    getWeekOfYearUTC() : number {};
    
    /** Sets the day of the month to a specified value in the local time zone */
    setDayOfMonthLocalTime(day: number) {};
    
    /** Adds a specified number of years to the current GlideDateTime object, expressed in the UTC time zone */
    addYearsUTC(amount: number) {};
    
    /** Returns true if the object's data time is on or after the input argument */
    onOrAfter(object: GlideDateTime) : bool {};
    
    /** Adds a GlideTime object to the current GlideDateTime object */
    add(gt: GlideTime) {};
    
    /** Returns local time with internal time format */
    getInternalFormattedLocalTime() : string {};
    
    /** Gets the duration difference between two GlideDateTime values. Pass a single paramter which specifies milliseconds to subtract from the current GlideDateTime object */
    subtract(start: GlideDateTime, end: GlideDateTime) : GlideDuration {};
    
    /** Gets the number of the week stored by the GlideDateTime object, expressed in the user's time zone */
    getWeekOfYearLocalTime() : number {};
    
    /**  */
    getDisplayValueWithoutTZ() : string {};
    
    /** Sets a date and time value using the current user's display format and time zone. Also set an optional parameter 'format', to set date and time format */
    setDisplayValue(value: string, format: string) {};
    
    /** Returns local time with user time format */
    getUserFormattedLocalTime() : string {};
    
    /** Gets the month stored by the GlideDateTime object, expressed in the UTC time zone */
    getMonthUTC() : number {};
    
    /** Adds a specified number of seconds to the current GlideDateTime object */
    addSeconds(value: number) {};
    
    /** Gets the number of days in the month stored by the GlideDateTime object, expressed in the UTC time zone */
    getDaysInMonthUTC() : number {};
    
    /** Returns a GlideTime object that represents the time portion of the GlideDateTime object in the user's time zone */
    getLocalTime() : GlideTime {};
    
    /** Adds a specified number of years to the current GlideDateTime object, expressed in the user's time zone */
    addYearsLocalTime(amount: number) {};
    
    /** Gets the year stored by the GlideDateTime object, expressed in the current user's time zone */
    getYearLocalTime() : number {};
    
    /** Gets the day of the month stored by the GlideDateTime object, expressed in the UTC time zone */
    getDayOfMonthUTC() : number {};
    
    /** Gets the number of milliseconds since January 1, 1970, 00:00:00 Greenwich Mean Time (GMT) */
    getNumericValue() : number {};
    
    /** Returns a GlideTime object that represents the time portion of the GlideDateTime object */
    getTime() : GlideTime {};
    
    /** Determines if an object's time uses a daylight savings offset */
    isDST() : bool {};
    
    /** Adds a specified number of months to the current GlideDateTime object, expressed in the UTC time zone */
    addMonthsUTC(amount: number) {};
    
    /** Adds a specified number of days to the current GlideDateTime object, expressed in the user's timezone */
    addDaysLocalTime(amount: number) {};
    
    /** Gets the amount of time that daylight savings time is offset */
    getDSTOffset() : number {};
    
    /**  */
    hashCode() : number {};
    
    /** Adds a specified number of months to the current GlideDateTime object, expressed in the user's time zone */
    addMonthsLocalTime(amount: number) {};
    
    /** Gets the display value in the internal datetime format */
    getDisplayValueInternal() : string {};
    
    /** Gets the day of the month stored by the GlideDateTime object, expressed in the current user's time zone */
    getDayOfMonthLocalTime() : number {};
    
    /** Gets the date in the system time zone */
    getDate() : GlideDate {};
    
    /** Returns true if the object's data time is after the input argument */
    after(object: GlideDateTime) : bool {};
    
    /** Gets the current error message */
    getErrorMsg() : string {};
    
    /**  */
    getTZOffset() : number {};
    
    /** Sets a date and time value using the internal format and the current user's time zone */
    setDisplayValueInternal(value: string) {};
    
    /** Returns true if the object's data time is on or before the input argument */
    onOrBefore(object: GlideDateTime) : bool {};
    
    /** Sets the day of the month to a specified value in the UTC time zone */
    setDayOfMonthUTC(day: number) {};
    
    /** Determines if a value is a valid datetime */
    isValid() : bool {};
    
    /** Determines if an object's date is set */
    hasDate() : bool {};
    
    /** Sets the year stored by the GlideDateTime object to a specified value using the current user's time zone */
    setYearLocalTime(year: number) {};
    
    /** Sets a date and time value using the UTC time zone and the specified date and time format */
    setValueUTC(dt: string, format: string) {};
    
    /** Gets a datetiime value in the same format as it is stored in the database */
    getValue() : string {};
    
    /** Gets the year stored by the GlideDateTime object, expressed in the UTC time zone */
    getYearUTC() : number {};
    
    /**  */
    equals(object: GlideDateTime) : bool {};
    
    /** Gets the datetime in the current user's display format and time zone */
    getDisplayValue() : string {};
    
    /** Sets the date and time */
    setValue(value: number) {};
    
    /** Converts a datetime value to a string */
    toString() : string {};
    
    /** Adds a specified number of days to the current GlideDateTime object, expressed in the UTC time zone */
    addDaysUTC(amount: number) {};
    
    /** Adds a specified number of weeks to the current GlideDateTime object, expressed in the user's timezone */
    addWeeksLocalTime(amount: number) {};
    
    }
    
    /** The Scoped GlideDBFunctionBuilder provides a builder API for creating platform function definition */
    class GlideDBFunctionBuilder{
    
    constructor(){};
    
    /** Start an addition function */
    add() : GlideDBFunctionBuilder {};
    
    /** Add a constant parameter to the current function */
    constant(constant: string) : GlideDBFunctionBuilder {};
    
    /** End the current function */
    endfunc() : GlideDBFunctionBuilder {};
    
    /** Start a subtraction function */
    subtract() : GlideDBFunctionBuilder {};
    
    /** Start a length function */
    length() : GlideDBFunctionBuilder {};
    
    /** Start a function that will return the first non-null value in a list of values */
    coalesce() : GlideDBFunctionBuilder {};
    
    /** Start a concatenation function */
    concat() : GlideDBFunctionBuilder {};
    
    /** Start a function that will return a substring when given a string and an integer position. Optionally a third length parameter can be included to limit the length of the resulting substring. */
    substring() : GlideDBFunctionBuilder {};
    
    /** Start a function that return the duration between 2 dates */
    datediff() : GlideDBFunctionBuilder {};
    
    /** Add a field parameter to the current function */
    field(fieldName: string) : GlideDBFunctionBuilder {};
    
    /** Return the completed function definition */
    build() : string {};
    
    /** Start a function that returns the current timestamp in the UTC timezone. This function should be used as a parameter to the datediff function to calculate a duration between the current datetime and another datetime field or datetime constant */
    now() : GlideDBFunctionBuilder {};
    
    /** Start a function that returns the day of the week of a given date */
    dayofweek() : GlideDBFunctionBuilder {};
    
    /** Start a division function */
    divide() : GlideDBFunctionBuilder {};
    
    /** Start a function that will return the first occurrence of a substring within a string. Takes optional search start position as third arg. */
    position() : GlideDBFunctionBuilder {};
    
    /** Start a multiplication function */
    multiply() : GlideDBFunctionBuilder {};
    
    }
    
    /** MetricBase JavaScript API */
    namespace sn_clotho {
    class TransformResult{
    
    constructor(){};
    
    /** Returns a series with the specified label */
    getByLabel(label: string) : sn_clotho.Data {};
    
    /** Returns a mapping of group names to their series */
    byGroup() : map {};
    
    /** Returns the all series of this TransformResult in the form of an array */
    toArray() : [sn_clotho.Data] {};
    
    /** Returns this result's series, assuming that there is a single resultant series */
    getData() : sn_clotho.Data {};
    
    }
    
    class Transformer{
    
    constructor(gr: GlideRecord){};
    
    /** Specifies the metric field that this transformer operates on */
    metric(metricName: string) : sn_clotho.TransformPart {};
    
    /** Groups the subject records by the specified field */
    groupBy(field: string) : sn_clotho.TransformPart {};
    
    /** Executes the transforms defined by this transformer over the specified time range and returns an object containing the results */
    execute(rangeStart: GlideDateTime, rangeEnd: GlideDateTime) : sn_clotho.TransformResult {};
    
    }
    
    class DataBuilder{
    
    constructor(cx: Context, args: [object], ctorObj: Function, inNewExpr: boolean){};
    
    /** Adds the specified value to the data at the specified time */
    add(start: GlideDateTime, value: number) : sn_clotho.DataBuilder {};
    
    }
    
    class TransformPart{
    
    constructor(){};
    
    /** Subtracts the specified constant quantity from all values */
    sub(substrahend: number) : sn_clotho.TransformPart {};
    
    /** Multiplies all values by the specified constant quantity */
    mul(factor: number) : sn_clotho.TransformPart {};
    
    /** Performs a logarithm on all values with the specified constant base */
    log(base: number) : sn_clotho.TransformPart {};
    
    /** Produces a new series where each value is the sum of all of the values at each timestamp */
    sum() : sn_clotho.TransformPart {};
    
    /** Groups the subject records by the specified field */
    groupBy(field: string) : sn_clotho.TransformPart {};
    
    /** Divides all values by the specified constant quantity */
    div(divisor: number) : sn_clotho.TransformPart {};
    
    /** Fits the series to the specified model using the specified parameters */
    fit(_params: object) : sn_clotho.TransformPart {};
    
    /** Produces a new series where each value is the average of all of the values at each timestamp */
    avg() : sn_clotho.TransformPart {};
    
    /** Produces a new series with the smallest values at each timestamp */
    min() : sn_clotho.TransformPart {};
    
    /** Produces a new series with the values filtered (AVG, MAX, MIN or LAST) by non-overlapping windows */
    partition(_aggregator: string, _window: string, _base: string) : sn_clotho.TransformPart {};
    
    /** Produces a set of series with the top 'count' (specified) largest values at each timestamp */
    top(count: number) : sn_clotho.TransformPart {};
    
    /** Limits the number of data points in each series to the specified count */
    limit(count: number) : sn_clotho.TransformPart {};
    
    /** Produces a set of new series by specified condition */
    where(condition: Condition) : sn_clotho.TransformPart {};
    
    /** Produces a new series with the standard deviation of the values at each timestamp */
    stddev() : sn_clotho.TransformPart {};
    
    /** Floors all values to the specified precision */
    floor(precision: number) : sn_clotho.TransformPart {};
    
    /** Produces a set of series where each is one of the specified percentiles of all of the data */
    fractiles(fractions: [number]) : sn_clotho.TransformPart {};
    
    /** Adds the specified constant quantity to all values */
    add(summand: number) : sn_clotho.TransformPart {};
    
    /** Produces a new series with the largest values at each timestamp */
    max() : sn_clotho.TransformPart {};
    
    /** Produces a set of series with the bottom 'count' (specified) smallest values at each timestamp */
    bottom(count: number) : sn_clotho.TransformPart {};
    
    /** Produces a new series that counts the number of series with values in the input */
    count() : sn_clotho.TransformPart {};
    
    /** Populates missing (NaN) values with two-point linear regression using the specified tolerance for maximum range of missing data */
    interpolate(countOrDuration: object) : sn_clotho.TransformPart {};
    
    /** Labels this series */
    label(label: string) : sn_clotho.TransformPart {};
    
    /** Ceils all values to the specified precision */
    ceil(precision: number) : sn_clotho.TransformPart {};
    
    /** Produces a new series with the values filtered (AVG, MAX, MIN or LAST) by sliding windows */
    filter(_aggregator: string, _window: string) : sn_clotho.TransformPart {};
    
    /** Produces a new series with the median of the values at each timestamp */
    median() : sn_clotho.TransformPart {};
    
    /** Rounds all values to the specified precision */
    round(precision: number) : sn_clotho.TransformPart {};
    
    /** Specifies the metric field that this transformer operates on */
    metric(metricName: string) : sn_clotho.TransformPart {};
    
    /** Includes this intermediate transform as part of the result */
    collect() : sn_clotho.TransformPart {};
    
    /** Aligns all series to have the specified number of data points */
    resample(numValues: number) : sn_clotho.TransformPart {};
    
    }
    
    class Data{
    
    constructor(){};
    
    /** Returns the value of the subject this series operates on */
    getSubject() : string {};
    
    /** Converts the specified model string into a series */
    fromModelString(model: string) : sn_clotho.Data {};
    
    /** Returns the label of this series */
    getLabel() : string {};
    
    /** Returns the start time of this series */
    getStart() : GlideDateTime {};
    
    /** Returns the number of values in this series */
    size() : number {};
    
    /** Returns the values in this series in the form of an array of numbers */
    getValues() : [number] {};
    
    /** Returns the name of the table this series operates on */
    getTableName() : string {};
    
    /** Returns the name of the metric this series operates on */
    getMetricName() : string {};
    
    /** Converts this series into a model string */
    toModelString() : string {};
    
    /** Returns the end time of this series */
    getEnd() : GlideDateTime {};
    
    /** Returns the period of this series */
    getPeriod() : number {};
    
    }
    
    class Client{
    
    constructor(){};
    
    /** Performs the specified transform(s) over the specified range */
    transform(o1: object, o2: GlideDateTime, o3: GlideDateTime) : object {};
    
    /** Uses the specified DataBuilder to put data into MetricBase */
    put(dataBuilder: sn_clotho.DataBuilder) {};
    
    }
    
    }
    
    /** GlideLocale is a global object that can be called in scripts. Use the get() method to get a GlideLocale object */
    class GlideLocale{
    
    constructor(){};
    
    /** Returns the decimal separator */
    getGroupingSeparator() : string {};
    
    /** Returns the grouping separator */
    getDecimalSeparator() : string {};
    
    }
    
    /** The scoped XMLNodeIterator class allows you to iterate through a node of a XML document */
    class XMLNodeIterator{
    
    constructor(){};
    
    /** Gets the next element in the iteration */
    next() : XMLNode {};
    
    /** Determines if the iteration has more elements */
    hasNext() : bool {};
    
    }
    `
    
    var client = `
/** Interact with Service Portal utility functions. */
class spUtil_proto{
    /** Add an info message. */
    addInfoMessage(message: string) {};
    
    /** Call widget on server with data. */
    get(scope: ?, data: ?) {};
    
    /** Update data in the scope by getting it from the server. */
    update(scope: ?) {};
    
    }
    
    var spUtil = new spUtil_proto();
    /** Navigation API. Note: The code in this file is compatible with API Level 1 and API Level 2 */
    class g_navigation_proto{
    /** Redirects to a record */
    openRecord(table: string, sys_id: string) {};
    
    /** Reload the current frame */
    reloadWindow() {};
    
    /** Open a popup window with features \nurl: The url to open \nname: The name of the new window \nfeatures: is a comma separated list of features. See https://developer.mozilla.org/en-US/docs/Web/API/Window/open \nnoStack: True to append sysparm_stack=no to the url. This prevents weirdness when using the form back button \nreturns the instance of newly opened Window */
    openPopup(url: string, name: string, features: string, noStack: bool) : ? {};
    
    /** Refresh the navigator contents */
    refreshNavigator() {};
    
    /** Redirects to another URL. \nurl: URL to be loaded. It can be any URL supported by the browser \ntarget: is the target frame. If left blank, the URL will load in the current frame */
    open(url: string, target: string) {};
    
    }
    
    var g_navigation = new g_navigation_proto();
    /** g_form is a global object used in client-side scripts to customize forms */
    class g_form_proto{
    /** Shows or hides a section Works in both tab and flat modes. This method is available starting with the Fuji release */
    setSectionDisplay(sectionName: string, display: bool) : bool {};
    
    /** Removes all options from a choice list */
    clearOptions(fieldName: string) {};
    
    /** Returns the <option> element for a select box named fieldName and where choiceValue matches the option value Returns null if the field is not found or the option is not found */
    getOption(fieldName: string, choiceValue: string) : HTMLElement {};
    
    /** Hides all related lists on the form */
    hideRelatedLists() {};
    
    /** Removes a specific option from a choice list */
    removeOption(fieldName: string, choiceValue: string) {};
    
    /** Hides all field messages. <type> paramter is optional */
    hideAllFieldMsgs(type: string) {};
    
    /** Returns false if the field's value is false or undefined, otherwise true is returned. Useful with checkbox fields Returns true when the checkbox is checked */
    getBooleanValue(fieldName: string) : bool {};
    
    /** Returns all section names, whether visible or not, in an array This method is available starting with the Fuji release */
    getSectionNames() : string {};
    
    /** Displays either an informational or error message under the specified form field (either a control object or the name of the field). Type may be either 'info' or 'error.' If the control or field is currently scrolled off the screen, it will be scrolled to. A global property (glide.ui.scroll_to_message_field) is available that controls automatic message scrolling when the form field is offscreen (scrolls the form to the control or field) */
    showFieldMsg(input: string, message: string, type: string, scrollForm: bool) {};
    
    /** Returns true if the field is required Returns false if the field is optional */
    isMandatory(fieldName: string) : bool {};
    
    /** Returns the HTML element for the form */
    getFormElement() : HTMLElement {};
    
    /** Displays the field if true. Hides the field if false. If the field is hidden, the space is left blank. This method cannot hide mandatory fields with no value */
    setVisible(fieldName: string, display: bool) {};
    
    /** Returns the HTML element for the specified field Compound fields may contain several HTML elements. Generally not necessary as there are built-in methods that use the fields on the form */
    getControl(fieldName: string) : HTMLElement {};
    
    /** Returns the name of the table this record belongs to */
    getTableName() : string {};
    
    /** Hides the message placed by showFieldMsg() */
    hideFieldMsg(input: string, clearAll: bool) {};
    
    /** Returns true if the record has never been saved Returns false if the record has been saved */
    isNewRecord() : bool {};
    
    /** Displays an error message under the specified form field (either a control object or the name of the field). If the control or field is currently scrolled off the screen, it will be scrolled to. A global property (glide.ui.scroll_to_message_field) is available that controls automatic message scrolling when the form field is offscreen (scrolls the form to the control or field). The showFieldMsg() method is a similar method that requires a 'type' parameter */
    showErrorBox(input: string, message: string, scrollForm: bool) {};
    
    /** Removes the icon that matches the exact same name and text. This method is available starting with the Fuji release */
    removeDecoration(fieldName: string, icon: string, title: string) {};
    
    /** Returns the sys_id of the record displayed in the form */
    getUniqueValue() : string {};
    
    /** Hides the error message placed by showErrorBox() */
    hideErrorBox(input: string) {};
    
    /** Gets the plain text value of the field label. This method is available starting with the Fuji release */
    getLabelOf(fieldName: string) : string {};
    
    /** Makes the field read-only if true Makes the field editable if false. Note: Both setReadOnly and setReadonly are functional.  Best Practice: Use UI Policy rather than this method whenever possible */
    setReadOnly(fieldName: string, value: bool) {};
    
    /** Flashes the specified color the specified number of times in the field. Used to draw attention to a particular field */
    flash(widgetName: string, color: string, count: integer) {};
    
    /** Makes the field required if true. Makes the field optional if false. Best Practice: Use UI Policy rather than this method whenever possible  */
    setMandatory(fieldName: string, value: bool) {};
    
    /** Saves the record User will be taken away from the form, returning them to where they were previously */
    submit() {};
    
    /** Returns the value of the specified field as an integer An empty value returns 0 */
    getIntValue(fieldName: string) : integer {};
    
    /** Grays out field and makes it unavailable */
    setDisabled(fieldName: string, value: bool) {};
    
    /** Returns the most recent action name or, for a client script, the sys_id of the UI Action clicked Note: not available to Wizard Client Scripts */
    getActionName() : string {};
    
    /** Saves the record without navigating away from the record (update and stay) */
    save() {};
    
    /** Removes messages that were previously added with addErrorMessage() and addInfoMessage() */
    clearMessages() {};
    
    /** Returns the decimal value of the specified field */
    getDecimalValue(fieldName: string) : string {};
    
    /** Sets the plain text value of the field label. This method is available starting with the Fuji release */
    setLabelOf(fieldname: string, label: string) {};
    
    /** Displays an error message at the top of the form */
    addErrorMessage(message: string) {};
    
    /** Hides the specified related list on the form */
    hideRelatedList(listTableName: string) {};
    
    /** Prevents new file attachments from being added Hides the paperclip icon. See also: enableAttachments() */
    disableAttachments() {};
    
    /** Allows new file attachments to be added Shows the paperclip icon. See also: disableAttachments() */
    enableAttachments() {};
    
    /** Returns the GlideRecord for a specified field getReference() accepts a second parameter, a callback function Warning: This requires a call to the server so using this function will require additional time and may introduce latency to your page */
    getReference(fieldName: string, callback: string) : string {};
    
    /** Displays the field if true. Hides the field if false. This method cannot hide mandatory fields with no value. If the field is hidden, the space is used to display other items */
    setDisplay(fieldName: string, display: bool) {};
    
    /** Displays the specified related list on the form */
    showRelatedList(listTableName: string) {};
    
    /** Displays all related lists on the form */
    showRelatedLists() {};
    
    /** Adds an icon on a field’s label. This method is available starting with the Fuji release */
    addDecoration(fieldName: string, icon: string, title: string) {};
    
    /** Removes any value(s) from the specified field */
    clearValue(fieldName: string) {};
    
    /** Returns the value of the specified field */
    getValue(fieldName: string) : string {};
    
    /** Displays an informational message at the top of the form */
    addInfoMessage(message: string) {};
    
    /** Adds a choice to a choice list field If the index is not specified, the choice is added to the end of the list. Optional: Use the index field to specify a particular place in the list */
    addOption(fieldName: string, choiceValue: string, choiceLabel: string) {};
    
    /** Returns the HTML element for the field specified via the ID Compound fields may contain several HTML elements. Generally not necessary as there are built-in methods that use the fields on the form */
    getElement(id: string) : HTMLElement {};
    
    /** Sets the value and the display value of a field Will display value if there is no displayValue */
    setValue(fieldName: string, value: string, displayValue: string) {};
    
    /** Returns the elements for the form's sections in an array */
    getSections() : string {};
    
    /** Returns true if the section is visible Returns false if the section is not visible or does not exist. This method is available starting with the Fuji release */
    isSectionVisible(sectionName: string) : bool {};
    
    }
    
    var g_form = new g_form_proto();
    /** Constructor to create a new dialog window object in the current window and frame. id is the name of the UI page to load into the dialog window */
    class GlideDialogWindow{
    
    constructor(id: string){};
    
    /** Sets the size of the dialog window. If you do not pass width and height parameters, a default size is used */
    setSize(width: integer, height: integer) {};
    
    /** Closes the dialog window */
    destroy() {};
    
    /** Sets the title of the dialog window */
    setTitle(title: string) {};
    
    /** Sets a given window property to a specified value. Any window property can be set using this method */
    setPreference(name: string, value: string) {};
    
    /** Renders the dialog window */
    render() {};
    
    }
    
    /** g_list is a global object used in client-side scripts to customize lists */
    class g_list_proto{
    /** Sorts the list in descending order and saves the choice */
    sortDescending(field: string) {};
    
    /** Returns true if the list has been personalized by the user by choosing the list mechanic and changing the list layout */
    isUserList() : bool {};
    
    /** Sets the first row that will be displayed in the list when the list is refreshed */
    setFirstRow(rowNum: number) {};
    
    /** Sets the orderBy criteria for the list. For a single order by field use orderBy field or orderByDescField. For multiple fields, use orderByField1^orderByField2^orderByField3. orderBy specifies ascending order and orderByDesc specifies descending. These prefix strings are optional. If not specified orderBy is assumed */
    setOrderBy(orderBy: string) {};
    
    /** Returns the field or comma-separated list of fields that are used to group the list */
    getGroupBy() : string {};
    
    /** Displays or hides all of the groups within the list and saves the current collapsed/expanded state of the groups as a user preference */
    showHideGroups(showFlag: bool) {};
    
    /** Sets the groupBy criteria for the list, for a single field or multiple fields. For a single field, use field or groupByField. The groupBy prefix is optional. For multiple fields use field1^field2^field3 or groupByField1^groupByField2^groupByField3 */
    setGroupBy(groupBy: string) {};
    
    /** Returns the list title */
    getTitle() : string {};
    
    /** Returns the first field that is used to order by or a blank */
    getOrderBy() : string {};
    
    /** Returns the GlideList2 object for the list or for the list that contains the specified item. String listID or DOMElement element - specifies the list by list ID or specifies the list by element */
    get(listID: string, element: DOMElement) : GlideList2 {};
    
    /** Returns the view used to display the list */
    getView() : string {};
    
    /** Returns the encoded query string for the list */
    getQuery(orderBy: bool, groupBy: bool, fixed: bool, all: bool) : string {};
    
    /** Returns the sysparm_fixed query. A fixed query is the part of the query that cannot be removed from the breadcrumb (i.e., it is fixed for the user). It is specified by including a 'sysparm_fixed_query parameter' for the application module */
    getFixedQuery() : string {};
    
    /** Sets the encoded query string for the list, including the orderBy and groupBy if specified, and then refreshes the list using the new filter */
    setFilterAndRefresh(filter: string) {};
    
    /** Displays or hides the list and saves the current collapsed/expanded state of the list as a user preference */
    showHideList(showFlag: bool) {};
    
    /** Returns the table name for the list */
    getTableName() : string {};
    
    /** Clears the image for an item */
    toggleListNoPref() {};
    
    /** Refreshes the list. The orderBy part of the list filter is ignored so that the list uses its natural ordering when it is refreshed */
    refresh(firstRow: number, additionalParms: string) {};
    
    /** Sets the number of rows per page to display */
    setRowsPerPage(rows: number) {};
    
    /** Sorts the list in ascending order and saves the choice */
    sort(field: string) {};
    
    /** Sets the encoded query string for the list, ignoring the orderBy and groupBy parts of the query string */
    setFilter(filter: string) {};
    
    /** Returns the name of the list, which is usually the table name */
    getListName() : string {};
    
    /** Refreshes the list. The orderBy part of the list filter is included if it is currently specified for the list */
    refreshWithOrderBy(firstRow: number, additionalParms: string) {};
    
    /** Adds a single term to the list query filter */
    addFilter(filter: string) : queryCondition {};
    
    /** Returns the related list field that associates the related list to the parent form */
    getRelated() : string {};
    
    /** Returns the name of the parent table for a related list (the table associated with the form) */
    getParentTable() : string {};
    
    /** Returns a comma-separated list of the sys_ids for the items that are checked in the list */
    getChecked() : string {};
    
    /** Toggles the display of the list and saves the current collapsed/expanded state of the list as a user preference */
    toggleList() {};
    
    }
    
    var g_list = new g_list_proto();


    /** g_user is a global object used in client-side scripts, to get current user information */
    class g_user_proto{
    /** Returns true if the current user has at least one of the specified roles in the comma-separated list or the admin role */
    hasRoleFromList(roles: string) : bool {};
    
    /** Gets information for use in client scripts without making an AJAX call to the server. Works with gs.getSession().putClientData(,) */
    getClientData(key: string) : string {};
    
    /** Returns true only if the current user has this specified role */
    hasRoleExactly(role: string) : bool {};
    
    /** Returns true if the current user has any role */
    hasRoles() : bool {};
    
    /** Returns true if the current user has the selected role or the admin role */
    hasRole(role: string) : bool {};
    
    /** Returns the first and last name of the current user */
    getFullName() : string {};
    
    }
    
    var g_user = new g_user_proto();
    /** Retrieves a message from UI Messages */
    class getMessage{
    
    constructor(key: string) : string{};
    
    }
    
    /** The GlideAjax class allows the execution of server-side code from the client. Initialize GlideAjax with the name of the client callable Script Include that extends AbstractAjaxProcessor */
    class GlideAjax{
    
    constructor(scriptIncludeName: string){};
    
    /** Adds parameters to the request, which are read in the Script Include. sysparm_name parameter is used to invoke a function in Script Include */
    addParam(name: string, value: string) {};
    
    /** Makes an asynchronous call to the server. On completion, invokes callback function with response object as an argument */
    getXML(callBackFunction: string) {};
    
    /** Makes an asynchronous call to the server. On completion, invokes callback function with 'answer' value extracted from response object as an argument */
    getXMLAnswer(callbackFunction: string, additionalParams: object, responseParams: object) {};
    
    }
    `
    

    var glidequery = `
/**
 * Main GlideQuery class used to build and execute queries.
 * @example
 * var query = new GlideQuery('sys_user');
 * @constructor
 * @param {string} table Table to query
 * @param {Array} [plan] Contains an array of Step objects describing the
 * query. Generally only used by GlideQuery itself.
 */
 function GlideQuery(table, plan) {
	Object.defineProperties(
		this,
		{
			table: { value: table },
			plan: { value: plan || [] }
		}
	);
}

GlideQuery.prototype.table = null;
GlideQuery.prototype.plan = null;
GlideQuery.prototype.type = 'GlideQuery';

/**
 * Returns a new GlideQuery containing a where clause. Cannot be
 * preceded by an orWhere, orWhereNull, or orWhereNotNull expression,
 * to avoid ambiguity.
 * @example
 * new GlideQuery('sys_user')
 *     .where('active', true)
 *     .where('last_login', '>', '2016-04-15')
 *
 * // active = true AND (priority = 1 OR severity = 1)
 * new GlideQuery('incident')
 *     .where('active', true)
 *     .where(new GlideQuery()
 *         .where('priority', 1)
 *         .orWhere('severity', 1))
 * @param {string | GlideQuery} fieldOrQuery field (or another GlideQuery) related to the where clause
 * @param {string} [operator] Operator used in where clause. Is considered '=' when only two arguments given.
 * @param {any} value Value used in where clause
 * @returns {GlideQuery} New GlideQuery containing where clause
 */
GlideQuery.prototype.where = function where(field, operator, value) {
	var query;
	if (field instanceof GlideQuery) {
		query = new GlideQuery(this.table, this.plan.concat({
			type: 'where',
			query: field,
			whereClause: true,
			action: GlideQueryActions.whereNestedQuery(this.table, field),
		}));
	} else {
		var op = value === undefined ? '=' : operator;
		var val = value === undefined ? operator : value;

		GlideQuery.checkWhereOperator(op, val);

		query = new GlideQuery(this.table, this.plan.concat({
			type: 'where',
			field: field,
			operator: op,
			value: val,
			whereClause: true,
			action: GlideQueryActions.where(this.table, field, op, val),
		}));
	}

	return GlideQuery.checkWhereAmbiguity(query);
};

/**
 * Returns a new GlideQuery containing an orWhere clause. Must be
 * preceded by a single where, whereNull, or whereNotNull expression. However
 * it cannot be followed by a where, whereNull, or whereNotNull expression
 * to avoid ambiguity.
 * @example
 * new GlideQuery('sys_user')
 *     .where('failed_attempts', '>', 0)
 *	   .orWhere('last_login', '<', '2019-04-15')
 *	   .select()
 *
 * // active = true OR (title = 'Vice President' AND state = 'CA')
 * new GlideQuery('sys_user')
 *     .where('active', true)
 *     .orWhere(new GlideQuery()
 *         .where('title', 'Vice President')
 *         .where('state', 'CA'))
 *     .select('name')
 * @param {string | GlideQuery} fieldOrQuery field (or another GlideQuery) related to the where clause
 * @param {string} [operator] Operator used in where clause. Is considered '=' when only two arguments given.
 * @param {any} value Value used in where clause
 * @returns {GlideQuery} New GlideQuery containing where clause
 */
GlideQuery.prototype.orWhere = function orWhere(field, operator, value) {
	var query;
	if (field instanceof GlideQuery) {
		query = new GlideQuery(this.table, this.plan.concat({
			type: 'orWhere',
			query: field,
			whereClause: true,
			action: GlideQueryActions.whereNestedQuery(this.table, field),
		}));
	} else {
		var op = value === undefined ? '=' : operator;
		var val = value === undefined ? operator : value;

		GlideQuery.checkWhereOperator(op, val);

		query = new GlideQuery(this.table, this.plan.concat({
			type: 'orWhere',
			field: field,
			operator: op,
			value: val,
			whereClause: true,
			action: GlideQueryActions.where(this.table, field, op, val),
		}));
	}

	return GlideQuery.checkWhereAmbiguity(query);
};

/**
 * Returns a new GlideQuery containing NOT NULL clause. Cannot be
 * preceded by an orWhere, orWhereNull, or orWhereNotNull expression.
 * @example
 * new GlideQuery('sys_user')
 *     .whereNotNull('first_name')
 * @param {string} field Field related to the clause
 * @returns {GlideQuery} New GlideQuery containing NOT NULL clause
 */
GlideQuery.prototype.whereNotNull = function whereNotNull(field) {
	return GlideQuery.checkWhereAmbiguity(
		new GlideQuery(
			this.table,
			this.plan.concat({
				type: 'whereNotNull',
				field: field,
				whereClause: true,
				action: GlideQueryActions.where(this.table, field),
			})
		)
	);
};

/**
 * Returns a new GlideQuery containing NOT NULL clause. Must be
 * preceded by a single where, whereNull, or whereNotNull expression.
 * @example
 * new GlideQuery('sys_user')
 *     .whereNotNull('first_name')
 *     .orWhereNotNull('last_name')
 * @param {string} field Field related to the clause
 * @returns {GlideQuery} New GlideQuery containing NOT NULL clause
 */
GlideQuery.prototype.orWhereNotNull = function orWhereNotNull(field) {
	return GlideQuery.checkWhereAmbiguity(
		new GlideQuery(
			this.table,
			this.plan.concat({
				type: 'orWhereNotNull',
				field: field,
				whereClause: true,
				action: GlideQueryActions.where(this.table, field),
			})
		)
	);
};

/**
 * Returns a new GlideQuery containing WHERE NULL clause. Cannot be
 * preceded by an orWhere, orWhereNull, or orWhereNotNull expression.
 * @example
 * new GlideQuery('sys_user')
 *     .whereNull('last_name')
 * @param {string} field Field related to the clause
 * @returns {GlideQuery} New GlideQuery containing NULL clause
 */
GlideQuery.prototype.whereNull = function whereNull(field) {
	return GlideQuery.checkWhereAmbiguity(
		new GlideQuery(
			this.table,
			this.plan.concat({
				type: 'whereNull',
				field: field,
				whereClause: true,
				action: GlideQueryActions.where(this.table, field),
			})
		)
	);
};

/**
 * Returns a new GlideQuery containing WHERE NULL clause. Must be
 * preceded by a single where, whereNull, or whereNotNull expression.
 * @example
 * new GlideQuery('sys_user')
 *     .whereNull('last_name')
 *     .orWhereNull('first_name')
 * @param {string} field Field related to the clause
 * @returns {GlideQuery} New GlideQuery containing NULL clause
 */
GlideQuery.prototype.orWhereNull = function orWhereNull(field) {
	return GlideQuery.checkWhereAmbiguity(
		new GlideQuery(
			this.table,
			this.plan.concat({
				type: 'orWhereNull',
				field: field,
				whereClause: true,
				action: GlideQueryActions.where(this.table, field),
			})
		)
	);
};

/**
 * Returns a single record, using keyValues as a set of key-values to query by.
 * getBy assumes the '=' operator for each key-value. Returns
 * @example
 * var user = new GlideQuery('sys_user')
 *     .getBy({
 *         first_name: 'Fred',
 *         last_name: 'Luddy'
 *     }, ['first_name', 'last_name', 'city', 'active']) // select first_name, last_name, city, active
 *     .orElse({
 *         first_name: 'Nobody',
 *         last_name: 'Found',
 *         city: 'Nowhere',
 *         active: false
 *     });
 * @param {Object} keyValues Object where the keys are the name of the fields, and the values are
 * @param {Array} [selectedFields] Additional fields to return in result
 * @returns {Optional} Optional containing result of query
 */
GlideQuery.prototype.getBy = function getBy(keyValues, selectedFields) {
	var queryFields = Object.keys(keyValues);
	GlideQueryEvaluator.checkFieldsHaveNoFlag(queryFields, 'getBy');
	var table = this.table;

	var whereSteps = queryFields.map(function (field) {
		return {
			type: 'where',
			field: field,
			operator: '=',
			value: keyValues[field],
			whereClause: true,
			action: GlideQueryActions.where(table, field, '=', keyValues[field]),
		};
	});

	return GlideQueryEvaluator.selectOne(
		new GlideQuery(this.table, this.plan.concat(whereSteps)),
		queryFields.concat(selectedFields || [])
	);
};

/**
 * Returns a single record by querying primary key.
 * @example
 * var user = new GlideQuery('sys_user')
 *     .get('5137153cc611227c000bbd1bd8cd2005', ['first_name', 'last_name'])
 *     .orElse({ first_name: 'Default', last_name: 'User' });
 * @param {string} key Object where the keys are the name of the fields, and the values are
 * @param {Array} [selectedFields] Additional fields to return in result
 * @returns {Optional} Optional containing result of query
 */
GlideQuery.prototype.get = function get(key, schema, selectFields) {
	return GlideQueryEvaluator.get(this, key, schema, selectFields);
};

/**
 * Inserts a single record, returning an Optional of the newly-created record
 * @example
 * var fred = new GlideQuery('sys_user')
 *     .insert({ first_name: 'Fred', last_name: 'Luddy' })
 *     .get();
 * @param {Object} keyValues Object containing key-values to insert into table
 * @param {Array} [selectedFields] Fields to return in result Optional
 * @throws {Error} When insert fails (e.g. when a business rule rejects the insert)
 * @returns {Optional} Optional containing result of query
 */
GlideQuery.prototype.insert = function insert(keyValues, selectFields) {
	return GlideQueryEvaluator.insert(this, keyValues, selectFields || []);
};

/**
 * Updates an existing record (just like update), however instead of requiring
 * where calls, it uses the primary key(s) in the recordValues object passed
 * in. If the primary key(s) isn't there, insertOrUpdate will insert a new
 * record instead. Returns an Optional of the newly created/updated record.
 * Often useful when you want to want to ensure a record exists and has the
 * correct values, as you don't need to check for the record's existence beforehand.
 * @example
 * // insert a new record
 * var user = new GlideQuery('sys_user')
 *     .insertOrUpdate({
 *         first_name: 'George',
 *         last_name: 'Griffey'
 *     })
 *     .orElse(null);
 *
 * // update existing record
 * var user = new GlideQuery('sys_user')
 *     .insertOrUpdate({
 *         sys_id: '2d0efd6c73662300bb513198caf6a72e',
 *         first_name: 'George',
 *         last_name: 'Griffey' })
 *     .orElse(null);
 * @param {Object} changes Object containing key-values to update/insert into table
 * @param {Array} [selectedFields] Fields to return in result Optional
 * @throws {Error} When insert fails (e.g. when a business rule rejects the insert)
 * @returns {Optional} Optional containing result of query
 */
GlideQuery.prototype.insertOrUpdate = function insertOrUpdate(changes, selectFields, reason) {
	return GlideQueryEvaluator.insertOrUpdate(this, changes, selectFields || [], reason);
};

/**
 * Updates an existing record. Requires a where call, specifying
 * all existing primary keys (usually sys_id). Returns an Optional
 * of the newly-updated record. Passes in a reason string (just
 * like GlideRecord's update).
 * @example
 * new GlideQuery('sys_user')
 *     .where('sys_id', userId)
 *     .update({ city: 'Los Angeles' });
 * @param {Object} changes Object containing key-values to update/insert into table
 * @param {Array} [selectedFields] Fields to return in result Optional
 * @throws {Error} When insert fails (e.g. when a business rule rejects the insert)
 * @returns {Optional} Optional containing result of query
 */
GlideQuery.prototype.update = function update(
	changes, selectFields, reason, prefetchedSchema, planOverride, insertWhenNotFound
) {
	return GlideQueryEvaluator.update(
		this,
		changes || {},
		selectFields || [],
		reason,
		prefetchedSchema,
		planOverride,
		insertWhenNotFound
	);
};

/**
 * Updates all records in the table (specified by preceding where clauses)
 * with the values contained in the changes object. Returns # of records
 * updated.
 * @example
 * new GlideQuery('sys_user')
 *     .where('active', false)
 *     .where('last_name', 'Griffey')
 *     .updateMultiple({ active: true });
 * @param {Object} changes Object containing key-values to update/insert into table
 * @returns {Object} Object with field rowCount
 */
GlideQuery.prototype.updateMultiple = function updateMultiple(changes) {
	return GlideQueryEvaluator.updateMultiple(this, changes);
};

GlideQuery.prototype.del = function del() {
	GlideQueryEvaluator.del(this);
};

/**
 * Deletes all records in the table specified by preceding where clauses.
 * @example
 * new GlideQuery('sys_user')
 *     .where('active', true)
 *     .where('last_name', 'Jeter')
 *     .deleteMultiple();
 * @returns {nothing}
 */
GlideQuery.prototype.deleteMultiple = GlideQuery.prototype.del;

/**
 * Specifies which fields to return and returns a Stream containing the
 * results of the query. Note that records aren't actually read from the
 * database until a terminal Stream method is called (such as reduce() or
 * toArray()). The Stream is intended for reading multiple records in
 * a similar fashion to Java's Stream class.
 *
 * You can append a flag to a field name when metadata about the field is
 * needed, instead of the value itself. For example using the field name
 * "company$DISPLAY" will return the display value of a company field.
 * Existing flags are:
 * * DISPLAY - returns the display value of a field
 * * CURRENCY_CODE - Returns the currency code (e.g. "USD") of a currency field
 * * CURRENCY_DISPLAY - Returns the currency display value (e.g. "¥123.45") of a currency field
 * * CURRENCY_STRING - Returns the currency string (e.g. "JPY;123.45") of a currency field
 * @example
 * var stream = new GlideQuery('sys_user')
 *     .select('first_name', 'last_name', 'company$DISPLAY');
 * @param {...string} fields Fields to select
 * @returns {Stream} Stream containing results of query
 */
GlideQuery.prototype.select = function select(fields) {
	return GlideQueryEvaluator.createStream(this, GlideQuery.flattenFields(fields, arguments));
};

/**
 * Similar to [select()]{@link GlideQuery#select}, however only returns an Optional
 * which may contain a single record. This is more efficient
 * than select() if you only need one record, or want to
 * test if a record exists.
 * @example
 * var user = new GlideQuery('sys_user')
 *     .where('zip', '12345')
 *     .whereNotNull('last_name')
 *     .selectOne('first_name', 'last_name', 'company$DISPLAY')
 *     .get();
 * @param {...string} fields Fields to select
 * @returns {Optional} Optional containing result of query
 */
GlideQuery.prototype.selectOne = function selectOne(fields) {
	return GlideQueryEvaluator.selectOne(this, GlideQuery.flattenFields(fields, arguments));
};

/**
 * Returns a GlideQuery which disables the running of business
 * rules, script engines, and audit.
 * @example
 * var query = new GlideQuery('task')
 *     .disableWorkflow()
 *     .where('active', true)
 *     .updateMultiple({ priority: 1 });
 * @returns {GlideQuery} New GlideQuery which disables business rules
 */
GlideQuery.prototype.disableWorkflow = function disableWorkflow() {
	return new GlideQuery(this.table, this.plan.concat({
		type: 'disableWorkflow',
		action: GlideQueryActions.disableWorkflow,
	}));
};

/**
 * Returns a GlideQuery which does not update sys fields such as
 * sys_created_on, sys_updated_on, and sys_mod_count. This is the
 * equivalent of using autoSysFields(false) with GlideRecord.
 * @example
 * new GlideQuery('task')
 *     .disableAutoSysFields()
 *     .insert({ description: 'example', priority: 1 });
 * @returns {GlideQuery}
 */
GlideQuery.prototype.disableAutoSysFields = function disableAutoSysFields() {
	return new GlideQuery(this.table, this.plan.concat({
		type: 'disableAutoSysFields',
		action: GlideQueryActions.disableAutoSysFields,
	}));
};

/**
 * Returns a GlideQuery which forces an update even when no
 * changes are made. Useful when you want to force a business
 * rule to execute.
 * @example
 * new GlideQuery('task')
 *     .forceUpdate()
 *     .where('sys_id', taskId)
 *     .update()
 * @returns {GlideQuery}
 */
GlideQuery.prototype.forceUpdate = function forceUpdate() {
	return new GlideQuery(this.table, this.plan.concat({
		type: 'forceUpdate',
		action: GlideQueryActions.forceUpdate,
	}));
};

/**
 * Returns a GlideQuery which specifies that the records should
 * be returned in ascending order by a given field.
 * @example
 * var query = new GlideQuery('incident')
 *     .orderBy('number');
 * @param {string} field Fields to order by (ascending)
 * @returns {GlideQuery} New GlideQuery which contains orderBy
 */
GlideQuery.prototype.orderBy = function orderBy(field) {
	return new GlideQuery(
		this.table,
		this.plan.concat({
			type: 'orderBy',
			field: field,
			action: GlideQueryActions.orderBy(this.table, field),
		})
	);
};

/**
 * Returns a GlideQuery which specifies that the records should
 * be returned in descending order by a given field. Can be used
 * with aggregate queries
 * @example
 * var query = new GlideQuery('incident')
 *     .orderByDesc('number');
 *
 * new GlideQuery('incident')
 *     .aggregate('sum', 'child_incidents')
 *     .groupBy('category')
 *     .orderByDesc('sum', 'child_incidents')
 *
 * @param {string} fieldOrAggregate Field to order by with non-aggregate queries or
     aggregate type if used with aggregate queries
 * @param {string} [field] Field to order by (only used with aggregate queries)
 * @returns {GlideQuery} New GlideQuery which contains orderByDesc
 */
GlideQuery.prototype.orderByDesc = function orderByDesc(fieldOrAggregate, field) {
	return new GlideQuery(
		this.table,
		this.plan.concat({
			type: 'orderByDesc',
			field: field || fieldOrAggregate,
			action: GlideQueryActions.orderByDesc(this.table, fieldOrAggregate, field),
		})
	);
};

/**
 * Returns a GlideQuery which limits the number of records returned.
 * @example
 * var incidents = new GlideQuery('incident')
 *     .limit(20)
 *     .select('priority', 'description');
 * @param {number} limit Max number of records to return
 * @returns {GlideQuery} New GlideQuery which contains limit
 */
GlideQuery.prototype.limit = function limit(limit) {
	return new GlideQuery(
		this.table,
		this.plan.concat({
			type: 'limit',
			value: limit,
			action: GlideQueryActions.limit(limit),
		})
	);
};

/**
 * By default GlideQuery uses GlideRecord for database interactions.
 * By calling withAcls() GlideQuery will use GlideRecordSecure, which
 * honors ACLs.
 * @example
 * var users = new GlideQuery('sys_user')
 *     .withAcls()
 *     .limit(20)
 *     .orderByDesc('first_name')
 *     .select('first_name')
 *     .toArray(100);
 * @returns {GlideQuery} New GlideQuery which uses GlideRecordSecure
 */
GlideQuery.prototype.withAcls = function withAcls() {
	return new GlideQuery(
		this.table,
		this.plan.concat({
			type: 'withAcls',
		})
	);
};

/**
 * Returns the aggregate average of a given numeric field. Can be
 * used on fields of type:
 * * integer
 * * longint
 * * float
 * * double
 * * currency
 * @example
 * var faults = new GlideQuery('cmdb_ci')
 *     .avg('fault_count')
 *     .orElse(0);
 * @param {string} field Numeric field
 * @throws {Error} When invalid field given
 * @returns {Optional} Optional of results of aggregate, or empty if no records found
 */
GlideQuery.prototype.avg = function avg(field) {
	return GlideQueryEvaluator.callSimpleAggregate(this, 'avg', field);
};

/**
 * Returns the aggregate maximum of a given field.
 * @example
 * var name = new GlideQuery('sys_user')
 *     .max('first_name')
 *     .orElse('');
 * @param {string} field
 * @throws {Error} When invalid field given
 * @returns {Optional} Optional of results of aggregate, or empty if no records found
 */
GlideQuery.prototype.max = function max(field) {
	return GlideQueryEvaluator.callSimpleAggregate(this, 'max', field);
};

/**
 * Returns the aggregate minimum of a given field.
 * @example
 * var lowestModCount = new GlideQuery('sys_user')
 *     .min('sys_mod_count')
 *     .orElse(0);
 * @param {string} field
 * @throws {Error} When invalid field given
 * @returns {Optional} Optional of results of aggregate, or empty if no records found
 */
GlideQuery.prototype.min = function min(field) {
	return GlideQueryEvaluator.callSimpleAggregate(this, 'min', field);
};

/**
 * Returns the aggregate sum of a given numeric field. Can be
 * used on fields of type:
 * * integer
 * * longint
 * * float
 * * double
 * * currency
 * @example
 * var totalFaults = new GlideQuery('cmdb_ci')
 *     .sum('fault_count')
 *     .orElse(0);
 * @param {string} field Numeric field
 * @throws {Error} When invalid field given
 * @returns {Optional} Optional of results of aggregate, or empty if no records found
 */
GlideQuery.prototype.sum = function sum(field) {
	return GlideQueryEvaluator.callSimpleAggregate(this, 'sum', field);
};

/**
 * Returns the row count of records matching the query
 * @example
 * var userCount = new GlideQuery('sys_user')
 *     .where('active', true)
 *     .count();
 * @returns {number}
 */
GlideQuery.prototype.count = function count() {
	return GlideQueryEvaluator.callSimpleAggregate(this, 'count');
};

/**
 * Groups query results. Used with aggregate()
 * @example
 * new GlideQuery('task')
 *     .aggregate('count')
 *     .groupBy('contact_type')
 *     .select()
 * @param {...string} fields Fields to group by
 * @returns {GlideQuery} GlideQuery which groups results
 */
GlideQuery.prototype.groupBy = function groupBy(fields) {
	if (!fields) {
		NiceError.raise('groupBy expects a field name');
	}

	var table = this.table;
	var fieldArray = GlideQuery.flattenFields(fields, arguments);

	return new GlideQuery(
		this.table,
		this.plan.concat(fieldArray.map(function (f) {
			return {
				type: 'groupBy',
				field: f,
				action: GlideQueryActions.groupBy(table, f),
			};
		}))
	);
};

/**
 * Aggregates a field using an aggregate function. Used to build
 * queries which aggregate against multiple fields and/or multiple
 * aggregate functions. If you only need to aggregate against one
 * field with one function, and you don't need to use groupBy(), then
 * use one of the terminal functions instead:
 * * avg()
 * * min()
 * * max()
 * * count()
 * @example
 * new GlideQuery('task')
 *     .aggregate('avg', 'reassignment_count')
 *     .groupBy('contact_type')
 *     .select()
 * @param {string} aggregateType Aggregate type ('sum', 'avg', 'min', 'max', or 'count')
 * @param {string} field Field to aggregate
 * @returns {GlideQuery} GlideQuery which aggregates by a field
 */
GlideQuery.prototype.aggregate = function aggregate(aggregateType, field) {
	var type = aggregateType.toLowerCase();

	if (!GlideQueryEvaluator.aggregateQueries[type]) {
		NiceError.raise('Invalid aggregate type: ' + type);
	}

	return new GlideQuery(
		this.table,
		this.plan.concat({
			type: type,
			field: field,
			aggregate: true,
			action: GlideQueryActions.aggregate(this.table, field, aggregateType),
		})
	);
};

/**
 * Filters aggregate groups. Used with aggregate() and groupBy.
 * @example
 * new GlideQuery('task')
 *     .where('description', description)
 *     .groupBy('priority')
 *     .aggregate('sum', 'reassignment_count')
 *     .having('sum', 'reassignment_count', '>', 4)
 *     .select()
 * @param {string} aggregateType Aggregate type ('sum', 'avg', 'min', 'max', or 'count')
 * @param {string} field Field to aggregate
 * @param {string} operator Only numeric operators allowed: '>', '<', '>=', '<=', '=', and '!='
 * @param {number} value
 * @returns {GlideQuery} GlideQuery containing HAVING clause
 */
GlideQuery.prototype.having = function having(aggregate, field, operator, value) {
	GlideQuery.checkHavingOperatorAndValue(operator, value);
	var aggregateType = aggregate.toLowerCase();

	return new GlideQuery(
		this.table,
		this.plan.concat({
			type: 'having',
			aggregateType: aggregateType,
			field: field,
			operator: operator,
			value: value,
			action: GlideQueryActions.having(this.table, field, operator, value, aggregateType),
		})
	);
};

/**
 * Returns a GlideRecord representing the current GlideQuery. The
 * GlideRecord has not yet been queried, and so query() may need to
 * be called before using the GlideReord. The GlideRecord may
 * be a GlideAggregate in case aggregate queries are used.
 * @example
 * var userGr = new GlideQuery('sys_user')
 *     .where('active', true)
 *     .whereNotNull('first_name')
 *     .limit(10)
 *     .toGlideRecord();
 * userGr.query();
 * while (userGr.next()) {
 *     doSomething(userGr);
 * }
 * @returns {GlideRecord}
 */
GlideQuery.prototype.toGlideRecord = function toGlideRecord() {
	var gr = GlideQueryEvaluator.createGlideRecord(this);
	var schema = GlideQueryEvaluator.loadSchemaForTable(this, []);
	GlideQueryEvaluator.executePlan(this, gr, schema);
	return gr;
};

/**
 * Parses an encoded query.
 * @example
 * GlideQuery.parse('task', 'active=true^descriptionISNOTEMPTY')
 *     .select('description')
 *     .forEach(function (task) { gs.info(task.description); });
 * @param {string} table Table to query against
 * @param {string} encodedQuery Encoded query to parse
 * @returns {GlideRecord}
 */
GlideQuery.parse = function (table, encodedQuery) {
       return GlideQueryParser.parse(table, encodedQuery);
};

GlideQuery.prototype.toString = function toString() {
	return 'GlideQuery<' + this.table + '> ' + JSON.stringify(this.plan, null, 2);
};

GlideQuery.operators = {
	'=': 'comparable',
	'!=': 'comparable',
	'>': 'comparable',
	'>=': 'comparable',
	'<': 'comparable',
	'<=': 'comparable',
	IN: 'array',
	'NOT IN': 'array',
	STARTSWITH: 'string',
	ENDSWITH: 'string',
	CONTAINS: 'string',
	'DOES NOT CONTAIN': 'string',
	INSTANCEOF: 'string',
	SAMEAS: 'string',
	NSAMEAS: 'string',
	GT_FIELD: 'string',
	LT_FIELD: 'string',
	GT_OR_EQUALS_FIELD: 'string',
	LT_OR_EQUALS_FIELD: 'string',
	BETWEEN: 'array',
	DYNAMIC: 'string',
	EMPTYSTRING: 'string',
	ANYTHING: 'string',
	LIKE: 'string',
	'NOT LIKE': 'string',
	ON: 'string',
};

GlideQuery.checkHavingOperatorAndValue = function checkHavingOperatorAndValue(operator, value) {
	if (!JSUtil.instance_of(value, 'java.lang.Double') || !isFinite(value)) {
		NiceError.raise('Numeric value expected for having() value. Found ' + value);
	}
	if (GlideQuery.operators[operator] !== 'comparable') {
		NiceError.raise("Operator '" + operator + "' is not supported by having");
	}
};

GlideQuery.checkWhereOperator = function checkWhereOperator(operator, value) {
	if (!GlideQuery.operators[operator]) {
		NiceError.raise("Operator '" + operator + "' is not supported by where");
	}

	if (GlideQuery.operators[operator] === 'array' && !Array.isArray(value)) {
		NiceError.raise("Operator '" + operator + "' can only be used on array values");
	}

	if (operator === 'BETWEEN' && value.length !== 2) {
		NiceError.raise('BETWEEN requires array with two values, but was given one with ' + value.length + ' value(s)');
	}

	if (Array.isArray(value) && GlideQuery.operators[operator] !== 'array') {
		NiceError.raise("Array values can only be used with 'NOT IN' or 'IN' operators");
	}

	if (GlideQuery.operators[operator] === 'string' && !JSUtil.instance_of(value, 'java.lang.String')) {
		NiceError.raise("Operator '" + operator + "' can only be used on string values");
	}
};

GlideQuery.flattenFields = function flattenFields(firstArg, args) {
	if (Array.isArray(firstArg)) {
		return firstArg;
	}

	var flattenedFields = [];
	for (var i in args) {
		flattenedFields.push(args[i]);
	}

	return flattenedFields;
};

GlideQuery.checkWhereAmbiguity = function checkWhereAmbiguity(glideQuery) {
	var whereFound = 0;
	var orWhereFound = 0;
	glideQuery.plan
		.filter(function (step) { return step.whereClause; })
		.forEach(function (step) {
			if (step.type.startsWith('where')) {
				whereFound += 1;
			} else if (step.type.startsWith('or')) {
				orWhereFound += 1;
			}

			if (orWhereFound && !whereFound) {
				NiceError.raise(step.type + ' must be preceeded by where/whereNull/whereNotNull expression');
			}

			if (step.query && step.query.plan.some(function (s) { return s.query; })) {
				NiceError.raise('Cannot nest queries 3 or more levels');
			}
		});

	if (whereFound > 1 && orWhereFound) {
		NiceError.raise(
			'Ambiguous query: cannot contain multiple where***() expressions with an orWhere***() expression'
		);
	}

	return glideQuery;
};
`

    
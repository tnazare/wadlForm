'use strict';
describe('WadlParser controller tests', function() {

  describe('Controller: WadlParser', function() {
    var WadlParser,
    scope,
    httpBackend,
    http,
    xmlString;

    beforeEach(module('wadlFormApp'));

    beforeEach(inject(function($rootScope, $controller, $httpBackend, $http) {
      scope = $rootScope.$new();
      httpBackend = $httpBackend;
      httpBackend.when('GET', 'wadlFiles/application1.wadl').respond(xmlString);
      http = $http;
      xmlString = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><application xmlns="http://wadl.dev.java.net/2009/02"><doc xmlns:jersey="http://jersey.java.net/" jersey:generatedBy="Jersey: 1.13 06/29/2012 05:14 PM"/><grammars><include href="application.wadl/xsd0.xsd"><doc xml:lang="en" title="Generated"/></include></grammars><resources base="http://dev-software.vidal.net/excalibur-rest-snapshot/rest/"><resource path="/pmsi/scored-indication-groups"><method name="GET" id="computeScores"><request><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="codes"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="productId"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="vmpId"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="packId"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="ucdId"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="pathologies"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:int" style="query" name="selectedId"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" default="10" type="xs:int" style="query" name="scoreBalancing"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" default="LOW" type="xs:string" style="query" name="rejectNoise"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" default="25" type="xs:int" style="query" name="discriminantCursor"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" default="30" type="xs:int" style="query" name="depreciationRate"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" default="false" type="xs:boolean" style="query" name="verbose"/></request><response><representation mediaType="application/atom+xml"/></response></method><method name="POST" id="computeScores"><request><ns2:representation xmlns:ns2="http://wadl.dev.java.net/2009/02" xmlns="" mediaType="text/xml" element="request"/></request><response><representation mediaType="application/atom+xml"/></response></method></resource></resources></application>';
      WadlParser = $controller('WadlParser', {$scope: scope, $http: http});
    }));

    it('should get Wadl xml from url and set xml as a string in wadlXmlAsString', function () {
      httpBackend.expectGET('wadlFiles/application1.wadl');
      scope.loadWadlOnClick('wadlFiles/application1.wadl', null);

      httpBackend.flush();

      expect(scope.resources).not.toBe(null);
    });

    it('should parse xml input string', function () {
      expect(scope.parseWadl(xmlString)).not.toBe(null);
    });


    it('should parse xml and retrieve resources', function () {
      var resources = scope.parseWadl(xmlString);

      expect(resources.base).toBe('http://dev-software.vidal.net/excalibur-rest-snapshot/rest/');
      expect(resources.innerArray.length).toBe(1);
    });

    it('should parse xml and retrieve requests within the first resource', function () {
      var resources = scope.parseWadl(xmlString);

      expect(resources.innerArray[0].methods.length).toBe(2);
      expect(resources.innerArray[0].methods[0].params.length).toBe(12);
      expect(resources.innerArray[0].methods[0].verb).toBe('GET');
    });

    it('should parse xml and retrieve params within the first request of the first resource', function () {
      var resources = scope.parseWadl(xmlString);

      expect(resources.innerArray[0].methods[0].params[7].httpDefault).toBe('10');
      expect(resources.innerArray[0].methods[0].params[7].httpName).toBe('scoreBalancing');
      expect(resources.innerArray[0].methods[0].params[7].httpType).toBe('xs:int');
      expect(resources.innerArray[0].methods[0].params[7].httpStyle).toBe('query');
      expect(resources.innerArray[0].methods[0].params[7].xmlNamespaceSchema).toBe('http://www.w3.org/2001/XMLSchema');
    });

    it('should parse xml and retrieve resource that are nested under the same url and recreate entries', function () {
      var wadlXmlAsStringWithNestedResource = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><application xmlns="http://wadl.dev.java.net/2009/02"><doc xmlns:jersey="http://jersey.java.net/" jersey:generatedBy="Jersey: 1.13 06/29/2012 05:14 PM"/><grammars><include href="application.wadl/xsd0.xsd"><doc xml:lang="en" title="Generated"/></include></grammars><resources base="http://dev-software.vidal.net/excalibur-rest-snapshot/rest/"><resource path="/pmsi/scored-indication-groups"><method name="GET" id="computeScores"><request><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="codes"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="productId"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="vmpId"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="packId"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="ucdId"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="pathologies"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:int" style="query" name="selectedId"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" default="10" type="xs:int" style="query" name="scoreBalancing"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" default="LOW" type="xs:string" style="query" name="rejectNoise"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" default="25" type="xs:int" style="query" name="discriminantCursor"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" default="30" type="xs:int" style="query" name="depreciationRate"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" default="false" type="xs:boolean" style="query" name="verbose"/></request><response><representation mediaType="application/atom+xml"/></response></method><method name="POST" id="computeScores"><request><ns2:representation xmlns:ns2="http://wadl.dev.java.net/2009/02" xmlns="" mediaType="text/xml" element="request"/></request><response><representation mediaType="application/atom+xml"/></response></method></resource><resource path="imd/cladimed"><resource path="/all"><method name="GET" id="getAll"><response><representation mediaType="application/atom+xml"/></response></method></resource><resource path="/{id}"><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:int" style="template" name="id"/><method name="GET" id="getCladimedById"><response><representation mediaType="application/atom+xml"/></response></method></resource><resource path="/{id}/products"><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:int" style="template" name="id"/><method name="GET" id="getDmiProductsByCladimedId"><request><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:int" style="query" name="limit"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" default="false" type="xs:boolean" style="query" name="filterOnlyCatalogue"/></request><response><representation mediaType="application/atom+xml"/></response></method></resource></resource></resources></application>';

      var resources = scope.parseWadl(wadlXmlAsStringWithNestedResource);

      expect(resources.innerArray.length).toBe(4);
    });

    it('should parse xml and retrieve resource that are nested under the same url and recreate entries but not aggregate if there is a method in the resource', function () {
      var wadlXmlAsStringWithNestedResource = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?> <application xmlns="http://wadl.dev.java.net/2009/02"> <doc xmlns:jersey="http://jersey.java.net/" jersey:generatedBy="Jersey: 1.13 06/29/2012 05:14 PM"/> <grammars> <include href="application.wadl/xsd0.xsd"> <doc xml:lang="en" title="Generated"/> </include> </grammars> <resources base="http://dev-software.vidal.net/excalibur-rest-snapshot/rest/"> <resource path="api/products"> <method name="GET" id="searchProducts"> <request> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="q"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="startwith"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="status"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:int" style="query" name="start-page"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:int" style="query" name="page-size"/> </request> <response> <representation mediaType="application/atom+xml"/> </response> </method> <resource path="/form-color"> <method name="GET" id="searchProductsByGalenicFormColorsAndClass"> <request> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="form"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="color"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:int" style="query" name="vidal-class-id"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:int" style="query" name="start-page"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:int" style="query" name="page-size"/> </request> <response> <representation mediaType="application/atom+xml"/> </response> </method> </resource> </resource> </resources> </application>';

      var resources = scope.parseWadl(wadlXmlAsStringWithNestedResource);

      expect(resources.innerArray.length).toBe(2);
    });

    it('should parse xml and retrieve resource that are nested under the same url and recreate entries but not aggregate if there is a method in the resource and not aggregate method under the parent', function () {
      var wadlXmlAsStringWithNestedResource = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?> <application xmlns="http://wadl.dev.java.net/2009/02"> <doc xmlns:jersey="http://jersey.java.net/" jersey:generatedBy="Jersey: 1.13 06/29/2012 05:14 PM"/> <grammars> <include href="application.wadl/xsd0.xsd"> <doc xml:lang="en" title="Generated"/> </include> </grammars> <resources base="http://dev-software.vidal.net/excalibur-rest-snapshot/rest/"> <resource path="api/alerts"> <method name="GET" id="getSimpleAlerts"> <request> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="productId"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="vmpId"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="packId"/> </request> <response> <representation mediaType="application/atom+xml"/> </response> </method> <method name="POST" id="getAlertsWithPatient"> <request> <ns2:representation xmlns:ns2="http://wadl.dev.java.net/2009/02" xmlns="" mediaType="text/xml" element="prescription"/> </request> <response> <representation mediaType="application/atom+xml"/> </response> </method> <resource path="/interactions"> <method name="GET" id="getInteractions"> <request> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="productId"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="vmpId"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="packId"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="drugCode"/> </request> <response> <representation mediaType="application/atom+xml"/> </response> </method> </resource> </resource> </resources> </application>';

      var resources = scope.parseWadl(wadlXmlAsStringWithNestedResource);

      expect(resources.innerArray.length).toBe(2);
      expect(resources.innerArray[0].methods.length).toBe(2);
      expect(resources.innerArray[1].methods.length).toBe(1);
    });

    it('should parse xml and retrieve query parameters', function () {
      var wadlXmlAsStringWithNestedResourceAndQueryParams = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><application xmlns="http://wadl.dev.java.net/2009/02"><doc xmlns:jersey="http://jersey.java.net/" jersey:generatedBy="Jersey: 1.13 06/29/2012 05:14 PM"/><grammars><include href="application.wadl/xsd0.xsd"><doc xml:lang="en" title="Generated"/></include></grammars><resources base="http://dev-software.vidal.net/excalibur-rest-snapshot/rest/"><resource path="imd/cladimed"><resource path="/{id}/products"><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:int" style="template" name="id"/><method name="GET" id="getDmiProductsByCladimedId"><request><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:int" style="query" name="limit"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" default="false" type="xs:boolean" style="query" name="filterOnlyCatalogue"/></request><response><representation mediaType="application/atom+xml"/></response></method></resource></resource></resources></application>';

      var resources = scope.parseWadl(wadlXmlAsStringWithNestedResourceAndQueryParams);

      expect(resources.innerArray.length).toBe(1);
      expect(resources.innerArray[0].queryParams.length).toBe(1);
      expect(resources.innerArray[0].queryParams[0].httpName).toBe('id');
    });

    it('should parse xml and handle wrong slash', function () {
      var wadlXmlAsStringWithNestedResourceAndQueryParams = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?> <application xmlns="http://wadl.dev.java.net/2009/02"> <doc xmlns:jersey="http://jersey.java.net/" jersey:generatedBy="Jersey: 1.13 06/29/2012 05:14 PM"/> <grammars> <include href="application.wadl/xsd0.xsd"> <doc xml:lang="en" title="Generated"/> </include> </grammars> <resources base="http://dev-software.vidal.net/excalibur-rest-snapshot/rest/"> <resource path="/pmsi"> <resource path="postControl"> <method id="getPostControl" name="GET"> <request> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" name="codes" style="query" type="xs:string"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" name="productId" style="query" type="xs:string"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" name="vmpId" style="query" type="xs:string"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" name="packId" style="query" type="xs:string"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" name="ucdId" style="query" type="xs:string"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" name="text" style="query" type="xs:string"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" name="codesToControl" style="query" type="xs:string"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" name="engine" style="query" type="xs:string" default="VIDAL"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" name="drugCursor" style="query" type="xs:string" default="DEFAULT"/> </request> <response> <representation mediaType="application/atom+xml"/> </response> </method> <method id="getPostControl" name="POST"> <request> <ns2:representation xmlns:ns2="http://wadl.dev.java.net/2009/02" xmlns="" element="request" mediaType="text/xml"/> </request> <response> <representation mediaType="application/atom+xml"/> </response> </method> </resource> <resource path="/text-analysis"> <method id="analyseText" name="POST"> <request> <representation mediaType="text/plain"/> </request> <response> <representation mediaType="application/atom+xml"/> </response> </method> </resource> <resource path="postComplement"> <method id="postComplement" name="GET"> <request> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" name="codes" style="query" type="xs:string"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" name="productId" style="query" type="xs:string"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" name="vmpId" style="query" type="xs:string"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" name="packId" style="query" type="xs:string"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" name="ucdId" style="query" type="xs:string"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" name="text" style="query" type="xs:string"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" name="codesToControl" style="query" type="xs:string"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" name="engine" style="query" type="xs:string" default="VIDAL"/> <param xmlns:xs="http://www.w3.org/2001/XMLSchema" name="drugCursor" style="query" type="xs:string" default="DEFAULT"/> </request> <response> <representation mediaType="application/atom+xml"/> </response> </method> </resource> </resource> </resources> </application>';

      var resources = scope.parseWadl(wadlXmlAsStringWithNestedResourceAndQueryParams);

      expect(resources.innerArray.length).toBe(3);
      expect(resources.innerArray[0].methods.length).toBe(1);
      expect(resources.innerArray[0].path).toBe('pmsi/postComplement');

      expect(resources.innerArray[1].methods.length).toBe(2);
      expect(resources.innerArray[1].path).toBe('pmsi/postControl');
      expect(resources.innerArray[2].methods.length).toBe(1);
      expect(resources.innerArray[2].path).toBe('pmsi/text-analysis');
      expect(resources.innerArray[2].methods[0].verb).toBe('POST');
    });

    it('should inline each url param pattern by the submited value', function () {
      var path = 'http://dev-software.vidal.net/excalibur-rest-snapshot/rest/imd/cladimed/{id}/products';
      var queryParams = {'id':12} ;

      var result = scope.inlineUrlParamsInRequestPath(path,queryParams);

      expect(result).toBe('http://dev-software.vidal.net/excalibur-rest-snapshot/rest/imd/cladimed/12/products');
    });

    it('should append query params submitted by form', function () {
      var path = 'http://dev-software.vidal.net/excalibur-rest-snapshot/rest/imd/cladimed/12/products';
      var formParams = {'page-size': 21,'start-page': 34,'status': 'zsqzdqzdqzd'} ;

      var result = scope.inlineFormParamsInGetRequestPath(path,formParams);

      expect(result).toBe('http://dev-software.vidal.net/excalibur-rest-snapshot/rest/imd/cladimed/12/products?page-size=21&start-page=34&status=zsqzdqzdqzd');
    });

    it('should append query params submitted by form properly and not add multiple ?', function () {
      var path = 'http://dev-software.vidal.net/excalibur-rest-snapshot/rest/imd/cladimed/12/products?';
      var formParams = {'page-size': 21,'start-page': 34,'status': 'zsqzdqzdqzd'} ;

      var result = scope.inlineFormParamsInGetRequestPath(path,formParams);

      expect(result).toBe('http://dev-software.vidal.net/excalibur-rest-snapshot/rest/imd/cladimed/12/products?page-size=21&start-page=34&status=zsqzdqzdqzd');
    });

    it('should append query params submitted by form properly and not forget to add a &', function () {
      var path = 'http://dev-software.vidal.net/excalibur-rest-snapshot/rest/imd/cladimed/12/products?q=21';
      var formParams = {'page-size': 21,'start-page': 34,'status': 'zsqzdqzdqzd'} ;

      var result = scope.inlineFormParamsInGetRequestPath(path,formParams);

      expect(result).toBe('http://dev-software.vidal.net/excalibur-rest-snapshot/rest/imd/cladimed/12/products?q=21&page-size=21&start-page=34&status=zsqzdqzdqzd');
    });

    it('should parse xml response and extract feed infos' , function () {
        var response = '<?xml version="1.0" encoding="UTF-8"?> <feed xmlns="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:vidal="http://api.vidal.net/-/spec/vidal-api/1.0/" xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/"> <title>Search Products - Query :bedel</title> <link rel="self" type="application/atom+xml" href="/rest/api/products?q=bedel&start-page=1&page-size=25" /> <id>/rest/api/products?q=bedel&start-page=1&page-size=25</id> <updated>2014-09-17T22:00:00Z</updated> <dc:date>2014-09-17T22:00:00Z</dc:date> <opensearch:itemsPerPage>25</opensearch:itemsPerPage> <opensearch:totalResults>1</opensearch:totalResults> <opensearch:startIndex>1</opensearch:startIndex> <entry> <title>BEDELIX 3 g pdre p susp buv</title> <link rel="alternate" type="application/atom+xml" href="/rest/api/product/1971" /> <link rel="related" type="application/atom+xml" href="/rest/api/product/1971/packages" title="PACKAGES" /> <link rel="related" type="application/atom+xml" href="/rest/api/product/1971/documents/opt" title="OPT_DOCUMENT" /> <link rel="related" type="application/atom+xml" href="/rest/api/product/1971/documents" title="DOCUMENTS" /> <link rel="related" type="application/atom+xml" href="/rest/api/vmp/8028" title="VMP" /> <category term="PRODUCT" /> <author> <name>VIDAL</name> </author> <id>vidal://product/1971</id> <updated>2014-09-17T22:00:00Z</updated> <summary type="text">BEDELIX 3 g pdre p susp buv</summary> <vidal:id>1971</vidal:id> <vidal:dispensationPlace name="PHARMACY">PHARMACY</vidal:dispensationPlace> <vidal:activePrinciples>montmorillonite beidellitique</vidal:activePrinciples> <vidal:horsGHS>false</vidal:horsGHS> <vidal:refundRate name="NR">NR</vidal:refundRate> <vidal:itemType name="VIDAL">VIDAL</vidal:itemType> <vidal:marketStatus name="AVAILABLE">Commercialisé</vidal:marketStatus> <vidal:company type="OWNER" vidalId="2908">Ipsen Pharma</vidal:company> <vidal:drugInSport>false</vidal:drugInSport> <vidal:exceptional>false</vidal:exceptional> <vidal:retrocession>false</vidal:retrocession> <vidal:beCareful>false</vidal:beCareful> <vidal:midwife>true</vidal:midwife> <vidal:perVolume>3g</vidal:perVolume> <vidal:hasPublishedDoc>true</vidal:hasPublishedDoc> <vidal:onMarketDate format="yyyy-MM-dd">1980-03-15</vidal:onMarketDate> <vidal:withoutPrescription>true</vidal:withoutPrescription> <vidal:vmp vidalId="8028">montmorillonite beidellitique * 3 g ; voie orale + voie rectale ; pdre p susp buv/rect</vidal:vmp> </entry> </feed>';

        var json = scope.parseXmlToJson(response);

        expect(json).not.toBe(null);
        expect(json.title).toBe('Search Products - Query :bedel');
        expect(json.links.length).toBe(1);
        expect(json.links[0].rel).toBe('self');
        expect(json.links[0].type).toBe('application/atom+xml');
        expect(json.links[0].href).toBe('/rest/api/products?q=bedel&amp;start-page=1&amp;page-size=25');
        expect(json.id).toBe('/rest/api/products?q=bedel&start-page=1&page-size=25');
        expect(json.updated).toBe('2014-09-17T22:00:00Z');
        expect(json.dcDate).toBe('2014-09-17T22:00:00Z');
        expect(json.opensearch.itemsPerPage).toBe('25');
        expect(json.opensearch.totalResults).toBe('1');
        expect(json.opensearch.startIndex).toBe('1');
    });

    it('should parse xml response and extract link infos' , function () {
        var response = '<?xml version="1.0" encoding="UTF-8"?><link rel="self" type="application/atom+xml" href="/rest/api/products?q=bedel&start-page=1&page-size=25" /> <id>/rest/api/products?q=bedel&start-page=1&page-size=25</id> <updated>2014-09-17T22:00:00Z</updated> <dc:date>2014-09-17T22:00:00Z</dc:date> <opensearch:itemsPerPage>25</opensearch:itemsPerPage> <opensearch:totalResults>1</opensearch:totalResults> <opensearch:startIndex>1</opensearch:startIndex> <entry> <title>BEDELIX 3 g pdre p susp buv</title> <link rel="alternate" type="application/atom+xml" href="/rest/api/product/1971" /> <link rel="related" type="application/atom+xml" href="/rest/api/product/1971/packages" title="PACKAGES" /> <link rel="related" type="application/atom+xml" href="/rest/api/product/1971/documents/opt" title="OPT_DOCUMENT" /> <link rel="related" type="application/atom+xml" href="/rest/api/product/1971/documents" title="DOCUMENTS" /> <link rel="related" type="application/atom+xml" href="/rest/api/vmp/8028" title="VMP" />';
        var links = [];
        jQuery(response).children('link').each(function(){
            links.push(scope.extractAttributesFromXmlAutoClosingTag(this, 'link'));
        });
        expect(links[0].rel).toBe('alternate');
        expect(links[0].type).toBe('application/atom+xml');
        expect(links[0].href).toBe('/rest/api/product/1971');

        expect(links[1].rel).toBe('related');
        expect(links[1].type).toBe('application/atom+xml');
        expect(links[1].href).toBe('/rest/api/product/1971/packages');

        expect(links[2].rel).toBe('related');
        expect(links[2].type).toBe('application/atom+xml');
        expect(links[2].href).toBe('/rest/api/product/1971/documents/opt');

        expect(links[3].rel).toBe('related');
        expect(links[3].type).toBe('application/atom+xml');
        expect(links[3].href).toBe('/rest/api/product/1971/documents');

        expect(links[4].rel).toBe('related');
        expect(links[4].type).toBe('application/atom+xml');
        expect(links[4].href).toBe('/rest/api/vmp/8028');
    });

    it('should parse xml response and extract entry infos' , function () {
        var response = '<?xml version="1.0" encoding="UTF-8"?> <feed xmlns="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:vidal="http://api.vidal.net/-/spec/vidal-api/1.0/" xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/"> <title>Search Products - Query :augmentin</title> <link rel="self" type="application/atom+xml" href="/rest/api/products?q=augmentin&amp;start-page=1&amp;page-size=25" /> <id>/rest/api/products?q=augmentin&amp;start-page=1&amp;page-size=25</id> <updated>2048-07-21T22:00:00Z</updated> <dc:date>2048-07-21T22:00:00Z</dc:date> <opensearch:itemsPerPage>25</opensearch:itemsPerPage> <opensearch:totalResults>10</opensearch:totalResults> <opensearch:startIndex>1</opensearch:startIndex> <entry> <title>AUGMENTIN 100 mg/12,5 mg p ml pdre p susp buv Enf</title> <link rel="alternate" type="application/atom+xml" href="/rest/api/product/1735" /> <link rel="related" type="application/atom+xml" href="/rest/api/product/1735/packages" title="PACKAGES" /> <link rel="related" type="application/atom+xml" href="/rest/api/product/1735/documents/opt?patient=false" title="OPT_DOCUMENT" /> <link rel="related" type="application/atom+xml" href="/rest/api/product/1735/documents" title="DOCUMENTS" /> <link rel="related" type="application/atom+xml" href="/rest/api/vmp/2675" title="VMP" /> <category term="PRODUCT" /> <author> <name>VIDAL</name> </author> <id>vidal://product/1735</id> <updated>2048-07-21T22:00:00Z</updated> <summary type="text">AUGMENTIN 100 mg/12,5 mg p ml pdre p susp buv Enf</summary> <vidal:id>1735</vidal:id> <vidal:dispensationPlace name="PHARMACY">PHARMACY</vidal:dispensationPlace> <vidal:activePrinciples>acide clavulanique sel de K; amoxicilline trihydrate</vidal:activePrinciples> <vidal:horsGHS>false</vidal:horsGHS> <vidal:genericType name="REFERENT">RÃ©fÃ©rent</vidal:genericType> <vidal:list name="I">Liste 1</vidal:list> <vidal:refundRate name="_65">65%</vidal:refundRate> <vidal:itemType name="VIDAL">VIDAL</vidal:itemType> <vidal:marketStatus name="AVAILABLE">CommercialisÃ©</vidal:marketStatus> <vidal:company type="OWNER" vidalId="986">GlaxoSmithKline</vidal:company> <vidal:drugInSport>false</vidal:drugInSport> <vidal:exceptional>false</vidal:exceptional> <vidal:retrocession>false</vidal:retrocession> <vidal:beCareful>false</vidal:beCareful> <vidal:midwife>false</vidal:midwife> <vidal:perVolume>100mg/12,5mgpml</vidal:perVolume> <vidal:hasPublishedDoc>true</vidal:hasPublishedDoc> <vidal:onMarketDate format="yyyy-MM-dd">1998-05-14</vidal:onMarketDate> <vidal:withoutPrescription>false</vidal:withoutPrescription> <vidal:vmp vidalId="2675">acide clavulanique (sel de K) * 12,5 mg/ml + amoxicilline * 100 mg/ml ; voie orale ; pdre p susp buv</vidal:vmp> </entry> </feed>';

        var entry = scope.extractEntry(jQuery(response).children('entry'));

        expect(entry).not.toBe(null);
        expect(entry.title.innerText).toBe('AUGMENTIN 100 mg/12,5 mg p ml pdre p susp buv Enf');
        expect(entry.links.length).toBe(5);
        expect(entry.links[0].rel).toBe('alternate');
        expect(entry.links[0].type).toBe('application/atom+xml');
        expect(entry.links[0].href).toBe('/rest/api/product/1735');

        expect(entry.links[1].rel).toBe('related');
        expect(entry.links[1].type).toBe('application/atom+xml');
        expect(entry.links[1].href).toBe('/rest/api/product/1735/packages');

        expect(entry.links[2].rel).toBe('related');
        expect(entry.links[2].type).toBe('application/atom+xml');
        expect(entry.links[2].href).toBe('/rest/api/product/1735/documents/opt?patient=false');

        expect(entry.links[3].rel).toBe('related');
        expect(entry.links[3].type).toBe('application/atom+xml');
        expect(entry.links[3].href).toBe('/rest/api/product/1735/documents');

        expect(entry.links[4].rel).toBe('related');
        expect(entry.links[4].type).toBe('application/atom+xml');
        expect(entry.links[4].href).toBe('/rest/api/vmp/2675');

        expect(entry.category).not.toBe(null);
        expect(entry.category.term).toBe('PRODUCT');
        expect(entry.author.name.innerText).toBe('VIDAL');
        expect(entry.id.innerText).toBe('vidal://product/1735');
        expect(entry.updated.innerText).toBe('2048-07-21T22:00:00Z');
        expect(entry.summary.type).toBe('text');
        expect(entry.summary.innerText).toBe('AUGMENTIN 100 mg/12,5 mg p ml pdre p susp buv Enf');
        expect(entry.vidal.id.innerText).toBe('1735');
        expect(entry.vidal.dispensationplace.name).toBe('PHARMACY');
        expect(entry.vidal.dispensationplace.innerText).toBe('PHARMACY');
        expect(entry.vidal.activeprinciples.innerText).toBe('acide clavulanique sel de K; amoxicilline trihydrate');
        expect(entry.vidal.horsghs.innerText).toBe('false');
        expect(entry.vidal.refundrate.name).toBe('_65');
        expect(entry.vidal.refundrate.innerText).toBe('65%');
        expect(entry.vidal.company.type).toBe('OWNER');
        expect(entry.vidal.company.vidalid).toBe('986');
        expect(entry.vidal.company.innerText).toBe('GlaxoSmithKline');
        expect(entry.vidal.druginsport.innerText).toBe('false');
        expect(entry.vidal.exceptional.innerText).toBe('false');
        expect(entry.vidal.retrocession.innerText).toBe('false');
        expect(entry.vidal.becareful.innerText).toBe('false');
        expect(entry.vidal.midwife.innerText).toBe('false');
        expect(entry.vidal.pervolume.innerText).toBe('100mg/12,5mgpml');
        expect(entry.vidal.haspublisheddoc.innerText).toBe('true');
        expect(entry.vidal.onmarketdate.format).toBe('yyyy-MM-dd');
        expect(entry.vidal.onmarketdate.innerText).toBe('1998-05-14');
        expect(entry.vidal.withoutprescription.innerText).toBe('false');
        expect(entry.vidal.vmp.vidalid).toBe('2675');
        expect(entry.vidal.vmp.innerText).toBe('acide clavulanique (sel de K) * 12,5 mg/ml + amoxicilline * 100 mg/ml ; voie orale ; pdre p susp buv');
    });

  });

});

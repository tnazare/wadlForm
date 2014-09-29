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
      scope.onClick('wadlFiles/application1.wadl', null);
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
      expect(resources.innerArray[0].methods[0].httpMethodName).toBe('GET');
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

    it('should parse xml and retrieve query parameters', function () {
      var wadlXmlAsStringWithNestedResourceAndQueryParams = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><application xmlns="http://wadl.dev.java.net/2009/02"><doc xmlns:jersey="http://jersey.java.net/" jersey:generatedBy="Jersey: 1.13 06/29/2012 05:14 PM"/><grammars><include href="application.wadl/xsd0.xsd"><doc xml:lang="en" title="Generated"/></include></grammars><resources base="http://dev-software.vidal.net/excalibur-rest-snapshot/rest/"><resource path="imd/cladimed"><resource path="/{id}/products"><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:int" style="template" name="id"/><method name="GET" id="getDmiProductsByCladimedId"><request><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:int" style="query" name="limit"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" default="false" type="xs:boolean" style="query" name="filterOnlyCatalogue"/></request><response><representation mediaType="application/atom+xml"/></response></method></resource></resource></resources></application>';
      var resources = scope.parseWadl(wadlXmlAsStringWithNestedResourceAndQueryParams);
      expect(resources.innerArray.length).toBe(1);
      expect(resources.innerArray[0].queryParams.length).toBe(1);
      expect(resources.innerArray[0].queryParams[0].httpName).toBe('id');
    });

  });
  
});
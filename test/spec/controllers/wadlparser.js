describe('WadlParser controller tests', function() {

  describe('Controller: WadlParser unique resource', function() {
    var WadlParser,
    scope,
    xmlString;

    beforeEach(module('wadlFormApp'));

    beforeEach(inject(function($rootScope, $controller) {
      xmlString = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><application xmlns="http://wadl.dev.java.net/2009/02"><doc xmlns:jersey="http://jersey.java.net/" jersey:generatedBy="Jersey: 1.13 06/29/2012 05:14 PM"/><grammars><include href="application.wadl/xsd0.xsd"><doc xml:lang="en" title="Generated"/></include></grammars><resources base="http://dev-software.vidal.net/excalibur-rest-snapshot/rest/"><resource path="/pmsi/scored-indication-groups"><method name="GET" id="computeScores"><request><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="codes"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="productId"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="vmpId"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="packId"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="ucdId"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:string" style="query" name="pathologies"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" type="xs:int" style="query" name="selectedId"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" default="10" type="xs:int" style="query" name="scoreBalancing"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" default="LOW" type="xs:string" style="query" name="rejectNoise"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" default="25" type="xs:int" style="query" name="discriminantCursor"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" default="30" type="xs:int" style="query" name="depreciationRate"/><param xmlns:xs="http://www.w3.org/2001/XMLSchema" default="false" type="xs:boolean" style="query" name="verbose"/></request><response><representation mediaType="application/atom+xml"/></response></method><method name="POST" id="computeScores"><request><ns2:representation xmlns:ns2="http://wadl.dev.java.net/2009/02" xmlns="" mediaType="text/xml" element="request"/></request><response><representation mediaType="application/atom+xml"/></response></method></resource></resources></application>';
      scope = $rootScope.$new();
      WadlParser = $controller('WadlParser', {$scope: scope, xmlString: xmlString});
    }));

    it('should parse xml input string', function () {
      expect(scope.xmlDoc).not.toBe(null);
    });

    it('should parse xml and retrive resources', function () {
      expect(scope.resources.base).toBe('http://dev-software.vidal.net/excalibur-rest-snapshot/rest/');
      expect(scope.resources.innerArray.length).toBe(1);
    });

    it('should parse xml and retrive requests within the first resource', function () {
      expect(scope.resources.innerArray[0].methods.length).toBe(2);
      expect(scope.resources.innerArray[0].methods[0].params.length).toBe(12);
      expect(scope.resources.innerArray[0].methods[0].httpMethodName).toBe('GET');
    });

    it('should parse xml and retrive params within the first request of the first resource', function () {
      expect(scope.resources.innerArray[0].methods[0].params[7].httpDefault).toBe('10');
      expect(scope.resources.innerArray[0].methods[0].params[7].httpName).toBe('scoreBalancing');
      expect(scope.resources.innerArray[0].methods[0].params[7].httpType).toBe('xs:int');
      expect(scope.resources.innerArray[0].methods[0].params[7].httpStyle).toBe('query');
      expect(scope.resources.innerArray[0].methods[0].params[7].xmlNamespaceSchema).toBe('http://www.w3.org/2001/XMLSchema');
    });
  });
  
});

var path = require('path');
describe("Testing Orderzapp", function () {
	var ptor;
  ptor = protractor.getInstance();
  var sellername;
  beforeEach(function(){
    ptor.sleep(3000);
  })
  describe("index", function () {
    it("should display the correct title as", function () {
      browser.get('/#');
      expect(browser.getTitle()).toBe('OrderZapp');
    });
    it("while signing in, it should throw an error when both the fields are left blank", function () {
    	element(by.id('signin_username')).sendKeys('');
    	element(by.id('signin_password')).sendKeys('');
    	element(by.id('signin_button')).click();
    	browser.waitForAngular();
      var ele = by.css('.validation-error ul li');
  		expect(ptor.isElementPresent(ele)).toBe(true);
    });
    it("while signing in, it should throw an error when mobile no field is left blank", function () {
      element(by.id('signin_username')).sendKeys('');
      element(by.id('signin_password')).sendKeys('priyanka');
      element(by.id('signin_button')).click();
      browser.waitForAngular();
      var ele = by.css('.validation-error ul li:nth-child(1)');
      expect(ptor.isElementPresent(ele)).toBe(true);
    });
    it("while signing in, it should throw an error when password field is left blank", function () {
      element(by.id('signin_password')).clear();
      element(by.id('signin_username')).sendKeys('919929167675');
      element(by.id('signin_password')).sendKeys('');
      element(by.id('signin_button')).click();
      browser.waitForAngular();
      var ele = by.css('.validation-error ul li:nth-child(3)');
      expect(ptor.isElementPresent(ele)).toBe(true);
    });
    it("while signing in, it should throw an error when mobile no is less than 5 digits", function () {
      element(by.id('signin_username')).clear();
      element(by.id('signin_username')).sendKeys('9199');
      var ele = by.css('.validation-error ul li:nth-child(2)');
      expect(ptor.isElementPresent(ele)).toBe(true);
    });
    it("while signing in, it should throw an error when mobile no is greater than 15 digits", function () {
      element(by.id('signin_username')).clear();
      element(by.id('signin_username')).sendKeys('9199353454656572');
      var ele = by.css('.validation-error ul li:nth-child(2)');
      expect(ptor.isElementPresent(ele)).toBe(true);
    });
    it("while signing in, it should throw a server error when mobile no entered is not registered.", function () {
      element(by.id('signin_username')).clear();
      element(by.id('signin_username')).sendKeys('919400789888');
      element(by.id('signin_password')).sendKeys('priyanka');
      element(by.id('signin_button')).click();
      browser.waitForAngular();
      var ele = by.css('.gmail-template');
      expect(ptor.isElementPresent(ele)).toBe(true);
      var message = element(by.id('notification'));
      expect(message.getText()).toEqual('User does not exists');
    });
    it("while signing in, it should throw a server error when password entered is not valid.", function () {
      element(by.id('signin_username')).clear();
      element(by.id('signin_password')).clear();
      element(by.id('signin_username')).sendKeys('919929167675');
      element(by.id('signin_password')).sendKeys('priyanka23');
      element(by.id('signin_button')).click();
      browser.waitForAngular();
      var ele = by.css('.gmail-template');    
      expect(ptor.isElementPresent(ele)).toBe(true);
      var message = element(by.id('notification'));
      expect(message.getText()).toEqual('mobileno or password is invalid');
    });
    it("should display the orders hub when user is signed in", function () {
      element(by.id('signin_username')).clear();
      element(by.id('signin_password')).clear();
      element(by.id('signin_username')).sendKeys('919929167675');
      element(by.id('signin_password')).sendKeys('priyanka');
      element(by.id('signin_button')).click();
      browser.waitForAngular();
      var ele = by.id('ordershub');
      expect(ptor.isElementPresent(ele)).toBe(true);
    });

    it("should move to 'Manage Seller' and count total sellers added", function () {
      var ele = by.id('dropdown_list');
      element(by.binding('usersession.currentUser.firstname')).click();
      expect(ptor.isElementPresent(ele)).toBe(true);
      element(by.css('.dropdown ul li:nth-child(1)')).click();
      browser.waitForAngular();
      element(by.css('.seller-list')).isDisplayed().then(function (isVisible) {
        if (isVisible) {
          ele = element( by.css('[ng-click="add_provider()"]') );
          expect(ptor.isElementPresent(ele)).toBe(true);
          var current_seller_count = element.all(by.repeater('provider in providers_list')).count();
          var sellers;
          element.all(by.repeater('provider in providers_list')).then(function(rows) {
            sellers = rows.length;
            console.log(sellers);
            expect(current_seller_count).toEqual(sellers);
          });
        } else {
          ele = ptor.findElement(protractor.By.id('no-seller-added-message-container'));
          expect(ele.isDisplayed()).toBe(true);
          ele = ptor.findElement(protractor.By.id('oz-add-seller-heading'));
          expect(ele.isDisplayed()).toBe(true);
        }
      });
    });

    it("should add new seller to the current user account", function () {
      element(by.css('.seller-list')).isDisplayed().then(function (isVisible) {
        if (isVisible) {
          var current_seller_count = element.all(by.repeater('provider in providers_list')).count();
          var sellers;
          element.all(by.repeater('provider in providers_list')).then(function(rows) {
            sellers = rows.length;
            console.log(sellers);
            expect(current_seller_count).toEqual(sellers);
          });
          element( by.css('[ng-click="add_provider()"]') ).click();
          ele = ptor.findElement(protractor.By.id('oz-add-seller-heading'));
          expect(ele.isDisplayed()).toBe(true);
          element(by.model('addseller.name')).sendKeys('Little Hearts n Chocolates');
          element(by.model('addseller.code')).sendKeys('C000LHC10011');
          element(by.model('addseller.providerbrandname')).sendKeys('Hearts & Cakes Pvt. Ltd');
          element(by.model('addseller.provideremail')).sendKeys('info123@hearts.com');
          element(by.model('sellercategory.categoryname')).element(by.css('select option[value="0"]')).click()
          element(by.model('addseller.tino')).sendKeys('BB025364747');
          element(by.model('addseller.servicetaxno')).sendKeys('TA-3747832AA');
          element(by.model('addseller.description')).sendKeys('Cakes n Sweets manufacturers since 1987.');
          element(by.id('addProviderLogo')).click();
          browser.pause();
          element(by.model('addseller.cod')).click();
          element( by.css('[ng-click="addSeller()"]') ).click();
          browser.waitForAngular();
          browser.pause();
          element.all(by.repeater('provider in providers_list')).then(function(rows) {
            var updated_seller_count = rows.length;
            console.log(sellers);
            console.log(updated_seller_count);
            expect(updated_seller_count).toEqual(sellers + 1);
          });
        } else {
          ele = ptor.findElement(protractor.By.id('no-seller-added-message-container'));
          expect(ele.isDisplayed()).toBe(true);
          ele = ptor.findElement(protractor.By.id('oz-add-seller-heading'));
          expect(ele.isDisplayed()).toBe(true);
          var current_seller_count = element.all(by.repeater('provider in providers_list')).count();
          var sellers;
          element(by.model('addseller.name')).sendKeys('Little Hearts n Chocolates');
          element(by.model('addseller.code')).sendKeys('C000LHC001');
          element(by.model('addseller.providerbrandname')).sendKeys('Hearts & Cakes Pvt. Ltd');
          element(by.model('addseller.provideremail')).sendKeys('info123@hearts.com');
          element(by.model('sellercategory.categoryname')).element(by.css('select option[value="0"]')).click()
          element(by.model('addseller.tino')).sendKeys('BB025364747');
          element(by.model('addseller.servicetaxno')).sendKeys('TA-3747832AA');
          element(by.model('addseller.description')).sendKeys('Cakes n Sweets manufacturers since 1987.');
          element(by.id('addProviderLogo')).click();
          browser.pause();
          element(by.model('addseller.cod')).click();
          element( by.css('[ng-click="addSeller()"]') ).click();
          browser.waitForAngular();
          browser.pause();
          element.all(by.repeater('provider in providers_list')).then(function(rows) {
            sellers = rows.length;
            console.log(sellers);
            expect(sellers).toEqual(++current_seller_count);
          });
        }
      });
    });
    it("once the seller is added , it should signout from application.", function () {
      var ele = by.id('dropdown_list');
      element(by.binding('usersession.currentUser.firstname')).click();
      expect(ptor.isElementPresent(ele)).toBe(true);
      element(by.css('.dropdown ul li:last-child')).click();
      browser.waitForAngular();
      var ele = by.css('.gmail-template');    
      expect(ptor.isElementPresent(ele)).toBe(true);
      var message = element(by.id('notification'));
      expect(message.getText()).toEqual('You are successfully signed out.');
    });
    it("should display the admin when user is signed in again", function () {
      element(by.id('signin_username')).clear();
      element(by.id('signin_password')).clear();
      element(by.id('signin_username')).sendKeys('919890990748');
      element(by.id('signin_password')).sendKeys('sunil');
      element(by.id('signin_button')).click();
      browser.waitForAngular();
      var ele = by.css('.gmail-template');    
      expect(ptor.isElementPresent(ele)).toBe(true);
      var message = element(by.id('notification'));
      expect(message.getText()).toEqual('Successful login !');
      var ele = by.id('ordershub');
      expect(ptor.isElementPresent(ele)).toBe(true);
    });
    it("should click on 'Agreements tab'", function () {
      var ele = by.id('agreements');    
      expect(ptor.isElementPresent(ele)).toBe(true);
      element(by.id('agreements')).click();
      var ele = by.id('accept_seller');    
      expect(ptor.isElementPresent(ele)).toBe(true);
    });
    it("should accept seller from the seller's acceptance request list", function(){
      element(by.repeater('provider in providers.list').row(0)).element(by.css('[ng-click="accept(provider.providerid)"]')).click();  
      // sellername = element(by.repeater('provider in providers.list').row(0)).element(by.binding('provider.providername')).getAttribute('ng-bind');  
      // console.log(sellername);
      browser.waitForAngular();
      var ele = by.css('.gmail-template');    
      expect(ptor.isElementPresent(ele)).toBe(true);
      var message = element(by.id('notification'));
      expect(message.getText()).toEqual('Seller request accepted successfully');
    });
    it("once the seller is accepted , it should signout from application.", function () {
      var ele = by.id('dropdown_list');
      element(by.binding('usersession.currentUser.firstname')).click();
      expect(ptor.isElementPresent(ele)).toBe(true);
      element(by.css('.dropdown ul li:last-child')).click();
      browser.waitForAngular();
      var ele = by.css('.gmail-template');    
      expect(ptor.isElementPresent(ele)).toBe(true);
      var message = element(by.id('notification'));
      expect(message.getText()).toEqual('You are successfully signed out.');
    });
    it("should display the ordershub when another user is signed in again", function () {
      element(by.id('signin_username')).clear();
      element(by.id('signin_password')).clear();
      element(by.id('signin_username')).sendKeys('919929167675');
      element(by.id('signin_password')).sendKeys('priyanka');
      element(by.id('signin_button')).click();
      browser.waitForAngular();
      var ele = by.css('.gmail-template');    
      expect(ptor.isElementPresent(ele)).toBe(true);
      var message = element(by.id('notification'));
      expect(message.getText()).toEqual('Successful login !');
      var ele = by.id('ordershub');
      expect(ptor.isElementPresent(ele)).toBe(true);
    });
    it("should select seller from the select box", function () {
      element(by.css('.seller-list')).isDisplayed().then(function (isVisible) {
        if (isVisible) {
          var select = element(by.model('provider'));
          element(by.id('select_seller')).click();
          element(by.css('select option[value="13"]')).click()
          browser.waitForAngular();
        }
      });
    });
    it("should go to manage branch module", function () {
      var ele = by.id('dropdown_list');
      element(by.binding('usersession.currentUser.firstname')).click();
      expect(ptor.isElementPresent(ele)).toBe(true);
      element(by.css('.dropdown ul li:nth-child(2)')).click();
      browser.waitForAngular();
    });
  });
});


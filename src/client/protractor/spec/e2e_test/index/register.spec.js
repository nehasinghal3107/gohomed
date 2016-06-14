
var path = require('path');
describe("Testing Orderzapp", function () {
	var ptor;
  ptor = protractor.getInstance();

  beforeEach(function(){
    ptor.sleep(3000);
  })

  describe("index", function () {

    it("should display the correct title as", function () {
      browser.get('/#');
      expect(browser.getTitle()).toBe('OrderZapp');
    });

    it("while signing up, it should throw an error when all the fields are left blank", function () {
    	element(by.id('signup_mobileno')).sendKeys('');
      element(by.id('signup_email')).sendKeys('');
      element(by.id('signup_password')).sendKeys('');
    	element(by.id('signup_firstname')).sendKeys('');
    	element(by.css('[ng-click="signup()"]')).click();
    	browser.waitForAngular();
      var ele = by.css('.validation-error-signup ul li');
  		expect(ptor.isElementPresent(ele)).toBe(true);
    });

    it("while signing up with registered user mobile no, it should throw an error", function () {
      element(by.id('signup_mobileno')).sendKeys('9929167675');
      element(by.id('signup_email')).sendKeys('neha@giantleapsystems.com');
      element(by.id('signup_password')).sendKeys('neha@123');
      element(by.id('signup_firstname')).sendKeys('Neha');
      element(by.css('[ng-click="signup()"]')).click();
      browser.waitForAngular();
      var ele = by.css('.gmail-template');
      expect(ptor.isElementPresent(ele)).toBe(true);
      var message = element(by.id('notification'));
      expect(message.getText()).toEqual('Mobile Number is already registered with OrderZapp Provider');
    });

    it("while signing up with new number and valid data, it should add user successfully", function () {
      element(by.id('signup_mobileno')).clear();
      element(by.id('signup_email')).clear();
      element(by.id('signup_password')).clear();
      element(by.id('signup_firstname')).clear();
      element(by.id('signup_mobileno')).sendKeys('9921271157');
      element(by.id('signup_email')).sendKeys('neha@giantleapsystems.com');
      element(by.id('signup_password')).sendKeys('neha');
      element(by.id('signup_firstname')).sendKeys('neha');
      element(by.css('[ng-click="signup()"]')).click();
      browser.waitForAngular();
      var ele = by.css('.gmail-template');
      expect(ptor.isElementPresent(ele)).toBe(true);
      var message = element(by.id('notification'));
      expect(message.getText()).toEqual('User Added Successfully');
    });
    it("it should verify user after signup and after verification goes to ordershub", function () {
      expect($('[ng-show=verify_user]').isDisplayed()).toBeTruthy();
      browser.pause();
      element(by.css('[ng-click="verify()"]')).click();
      browser.waitForAngular();
      var ele = by.id('ordershub');
      expect(ptor.isElementPresent(ele)).toBe(true);
      var ele = by.id('dropdown_list');
      element(by.binding('usersession.currentUser.firstname')).click();
      expect(ptor.isElementPresent(ele)).toBe(true);
      element(by.css('.dropdown ul li:last-child')).click();
      browser.waitForAngular();
    });
    
  });
});


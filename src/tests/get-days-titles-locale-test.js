import React from 'react';
import DayView from '../day-view.js'
import moment from 'moment'
import { expect } from 'chai';
const { describe, it } = global;

describe('getDaysTitles', function() {
  it('should start on monday for swedish locale', function() {
  	moment.locale('sv');

  	var daysTitles = new DayView().getDaysTitles();

  	expect(daysTitles[0].val).to.equal('må');
  	expect(daysTitles[0].label).to.equal('må');
  	expect(daysTitles[1].val).to.equal('ti');
  	expect(daysTitles[1].label).to.equal('ti');
  	expect(daysTitles[2].val).to.equal('on');
  	expect(daysTitles[2].label).to.equal('on');
  	expect(daysTitles[3].val).to.equal('to');
  	expect(daysTitles[3].label).to.equal('to');
  	expect(daysTitles[4].val).to.equal('fr');
  	expect(daysTitles[4].label).to.equal('fr');
  	expect(daysTitles[5].val).to.equal('lö');
  	expect(daysTitles[5].label).to.equal('lö');
  	expect(daysTitles[6].val).to.equal('sö');
  	expect(daysTitles[6].label).to.equal('sö');
  });

  it('should start on monday for german locale', function() {
  	moment.locale('de');

  	var daysTitles = new DayView().getDaysTitles();

  	expect(daysTitles[0].val).to.equal('Mo');
  	expect(daysTitles[0].label).to.equal('Mo');
  	expect(daysTitles[1].val).to.equal('Di');
  	expect(daysTitles[1].label).to.equal('Di');
  	expect(daysTitles[2].val).to.equal('Mi');
  	expect(daysTitles[2].label).to.equal('Mi');
  	expect(daysTitles[3].val).to.equal('Do');
  	expect(daysTitles[3].label).to.equal('Do');
  	expect(daysTitles[4].val).to.equal('Fr');
  	expect(daysTitles[4].label).to.equal('Fr');
  	expect(daysTitles[5].val).to.equal('Sa');
  	expect(daysTitles[5].label).to.equal('Sa');
  	expect(daysTitles[6].val).to.equal('So');
  	expect(daysTitles[6].label).to.equal('So');
  });

  it('should start on sunday for english locale', function() {
  	moment.locale('en');

  	var daysTitles = new DayView().getDaysTitles();

  	expect(daysTitles[0].val).to.equal('Su');
  	expect(daysTitles[0].label).to.equal('Su');
  	expect(daysTitles[1].val).to.equal('Mo');
  	expect(daysTitles[1].label).to.equal('Mo');
  	expect(daysTitles[2].val).to.equal('Tu');
  	expect(daysTitles[2].label).to.equal('Tu');
  	expect(daysTitles[3].val).to.equal('We');
  	expect(daysTitles[3].label).to.equal('We');
  	expect(daysTitles[4].val).to.equal('Th');
  	expect(daysTitles[4].label).to.equal('Th');
  	expect(daysTitles[5].val).to.equal('Fr');
  	expect(daysTitles[5].label).to.equal('Fr');
  	expect(daysTitles[6].val).to.equal('Sa');
  	expect(daysTitles[6].label).to.equal('Sa');
  });
});
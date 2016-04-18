var startCurDate = new Date();
var endCurDate = new Date();
var startNxtDate = new Date();
var endNxtDate = new Date();
var startPrvDate = new Date();
var endPrvDate = new Date();
var nxtMnth = startCurDate.getMonth()+1;
var prvMnth = startCurDate.getMonth()-1;
var todayDate = new Date();
startCurDate.setDate(1);
startNxtDate.setDate(1);
startPrvDate.setDate(1);

var isLeapYear = ((startCurDate.getFullYear())%4 == 0) ? true : false;
var monthCurData, monthNxtData, monthPrvData;

var monthArray = [
  {
    fullForm:"January",
    shortForm:"Jan",
    days:31,
    month : 0
  },
  {
    fullForm:"February",
    shortForm:"Feb",
    days: ((isLeapYear)? 29 : 28),
    month : 1
  },
  {
    fullForm:"March",
    shortForm:"Mar",
    days:31,
    month : 2
  },
  {
    fullForm:"April",
    shortForm:"Apr",
    days:30,
    month : 3
  },
  {
    fullForm:"May",
    shortForm:"May",
    days:31,
    month : 4
  },
  {
    fullForm:"June",
    shortForm:"Jun",
    days:30,
    month : 5
  },
  {
    fullForm:"July",
    shortForm:"Jul",
    days:31,
    month : 6
  },
  {
    fullForm:"August",
    shortForm:"Aug",
    days:31,
    month : 7
  },
  {
    fullForm:"September",
    shortForm:"Sep",
    days:30,
    month : 8
  },
  {
    fullForm:"October",
    shortForm:"Oct",
    days:31,
    month : 9
  },
  {
    fullForm:"November",
    shortForm:"Nov",
    days:30,
    month : 10
  },
  {
    fullForm:"December",
    shortForm:"Dec",
    days:31,
    month : 11
  }
];

function getMonthDetails(_month){
	// Ti.API.info('_month '+_month);
    return monthArray[_month];
};

function setNewConfig(_month){
	startCurDate.setMonth(_month);
	endCurDate.setMonth(_month);
	nxtMnth = startCurDate.getMonth()+1;
	prvMnth = startCurDate.getMonth()-1;
	updateData();
}
updateData();
function updateData(){
	if(nxtMnth == 12){
	    nxtMnth = 0;
	    var nxtYear = startCurDate.getFullYear();
	    nxtYear += 1;
	    startNxtDate.setFullYear(nxtYear);
	    endNxtDate.setFullYear(nxtYear);
	}
	if(prvMnth == -1){
	  prvMnth = 12;
	  var prvYear = startCurDate.getFullYear();
	  prvYear -= 1;
	  startPrvDate.setFullYear(prvYear);
	  endPrvDate.setFullYear(prvYear);
	}
	startNxtDate.setMonth(nxtMnth);
	endNxtDate.setMonth(nxtMnth);
	startPrvDate.setMonth(prvMnth);
	endPrvDate.setMonth(prvMnth);
	
	monthCurData = getMonthDetails(startCurDate.getMonth());
	monthNxtData = getMonthDetails(startNxtDate.getMonth());
	monthPrvData = getMonthDetails(startPrvDate.getMonth());
	
	endCurDate.setDate(monthCurData.days);
	endNxtDate.setDate(monthNxtData.days);
	endPrvDate.setDate(monthPrvData.days);
}
var dayArray = [
  {
    day:0,
    fullForm:"Sunday",
    shortForm:"Sun"
  },
  {
    day:1,
    fullForm:"Monday",
    shortForm:"Mon"
  },
  {
    day:2,
    fullForm:"Tuesday",
    shortForm:"Tue"
  },
  {
    day:3,
    fullForm:"Wednesday",
    shortForm:"Wed"
  },
  {
    day:4,
    fullForm:"Thursday",
    shortForm:"Thu"
  },
  {
    day:5,
    fullForm:"Friday",
    shortForm:"Fri"
  },
  {
    day:6,
    fullForm:"Saturday",
    shortForm:"Sat"
  }
];

function getDayData(_day){
	// Ti.API.info('_day >> '+_day);
  return dayArray[_day];
}

function getDayArray(){
  return dayArray;
}

function getMonthData(){
  return{
    current:{
      startDate : startCurDate,
      endDate : endCurDate,
      monthData : monthCurData,
      startDay : getDayData(startCurDate.getDay()),
      endDay : getDayData(endCurDate.getDay()),
      todayDate : todayDate,
      date : todayDate.getDate(),
      year : todayDate.getFullYear(),
      day : getDayData(todayDate.getDay())
    },
    next:{
      startDate : startNxtDate,
      endDate : endNxtDate,
      monthData : monthNxtData,
      startDay : getDayData(startNxtDate.getDay()),
      endDay : getDayData(endNxtDate.getDay()),
      year : startNxtDate.getFullYear(),
      date : 1,
    },
    prev:{
      startDate : startPrvDate,
      endDate : endPrvDate,
      monthData : monthPrvData,
      startDay : getDayData(startPrvDate.getDay()),
      endDay : getDayData(endPrvDate.getDay()),
      year : startPrvDate.getFullYear(),
      date : 1,
    }
  };
};

function getDayNumber(_day){
  // Ti.API.info("Current Day >> "+_day);
  if(_day < 0){
    _day += 6;
  }else if(_day > 6){
    _day = (_day%7);
  }
  return _day;
}

function dataRangeAccess(){
  return {
    getMonthData : getMonthData,
    getDayData : getDayData,
    getDayArray : getDayArray,
    getDayNumber : getDayNumber,
    getMonthDetails : getMonthDetails,
    setNewConfig : setNewConfig
  };
};

exports.dataRangeAccess = dataRangeAccess;
